import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Download, Eye, RefreshCcw, ArchiveRestore, Trash2, Trash, FileSpreadsheet, FileText, X, AlertTriangle } from 'lucide-react'
import PdfViewer from './PdfViewer'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'

type ReportType = 'PDF' | 'CSV'

type ReportItem = {
    id: number
    name: string
    type: ReportType
    dateGenerated: string
    inTrash: boolean
    url: string
    mimeType: string
}

type DateValidationError = {
    type: 'future' | 'empty' | 'invalid_range' | 'max_range'
    message: string
    field?: 'start' | 'end' | 'both'
}

function formatNow(): string {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

function createSimplePdfBlob(): Blob {
    const pdf = `%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n4 0 obj << /Length 44 >> stream\nBT /F1 24 Tf 72 720 Td (Hello Report) Tj ET\nendstream endobj\n5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000061 00000 n \n0000000118 00000 n \n0000000293 00000 n \n0000000402 00000 n \ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n482\n%%EOF\n`
    return new Blob([pdf], { type: 'application/pdf' })
}

function createSampleCsvBlob(): Blob {
    const rows = [
        ['Vehicle', 'CO (gm)', 'NO2 (gm)', 'PM (µg/m³)', 'Date'],
        ['TRK-1001', '120', '45', '30', '2025-09-01'],
        ['CAR-4201', '98', '50', '22', '2025-09-02'],
        ['TRK-1002', '135', '60', '35', '2025-09-03'],
        ['VAN-8832', '110', '40', '28', '2025-09-03'],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    return new Blob([csv], { type: 'text/csv' })
}

// Date validation functions
function validateDateRange(startDate: string, endDate: string): DateValidationError | null {
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today

    // Check for empty dates
    if (!startDate || !endDate) {
        return {
            type: 'empty',
            message: 'Please select a valid date range to generate the report.',
            field: !startDate && !endDate ? 'both' : !startDate ? 'start' : 'end'
        }
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Check for future dates
    if (start > today || end > today) {
        return {
            type: 'future',
            message: 'Selected dates are invalid. Please choose past or current dates only.',
            field: start > today ? 'start' : 'end'
        }
    }

    // Check for invalid range (start after end)
    if (start > end) {
        return {
            type: 'invalid_range',
            message: 'Start date cannot be later than end date.',
            field: 'both'
        }
    }

    // Check for maximum range (1 year)
    const maxRangeMs = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
    if (end.getTime() - start.getTime() > maxRangeMs) {
        return {
            type: 'max_range',
            message: 'Date range cannot exceed 1 year. Please select a shorter period.',
            field: 'both'
        }
    }

    return null
}

// Helper function to get date input styling based on validation error
function getDateInputClassName(hasError: boolean, isDisabled: boolean): string {
    const baseClasses = "h-9 rounded-md border bg-background px-3 text-sm transition-colors"
    const errorClasses = "border-destructive focus:border-destructive focus:ring-destructive"
    const disabledClasses = "opacity-50 cursor-not-allowed"
    const normalClasses = "border-input focus:border-ring focus:ring-ring"

    if (isDisabled) {
        return `${baseClasses} ${disabledClasses}`
    }

    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`
}

const ReportSection = () => {
    const [reports, setReports] = useState<ReportItem[]>([])
    const [format, setFormat] = useState<ReportType>('PDF')
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewItem, setPreviewItem] = useState<ReportItem | null>(null)
    const idCounter = useRef<number>(1)

    // Date filter state
    const [preset, setPreset] = useState<'today' | '7' | '30' | 'custom'>('today')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')

    // Generation state
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    // Date validation state
    const [dateValidationError, setDateValidationError] = useState<DateValidationError | null>(null)

    // Delete confirmation state
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const [pendingDelete, setPendingDelete] = useState<ReportItem | null>(null)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const activeReports = useMemo(() => reports.filter(r => !r.inTrash), [reports])
    const trashedReports = useMemo(() => reports.filter(r => r.inTrash), [reports])

    // Validation computed state
    const isDateRangeValid = useMemo(() => {
        const error = validateDateRange(startDate, endDate)
        return error === null
    }, [startDate, endDate])

    const canGenerateReport = !isGenerating && isDateRangeValid

    function applyPreset(next: 'today' | '7' | '30' | 'custom') {
        setPreset(next)
        const today = new Date()
        const toISODate = (d: Date) => d.toISOString().slice(0, 10)
        if (next === 'today') {
            const d = new Date()
            setStartDate(toISODate(d))
            setEndDate(toISODate(d))
        } else if (next === '7') {
            const from = new Date(today)
            from.setDate(today.getDate() - 6)
            setStartDate(toISODate(from))
            setEndDate(toISODate(today))
        } else if (next === '30') {
            const from = new Date(today)
            from.setDate(today.getDate() - 29)
            setStartDate(toISODate(from))
            setEndDate(toISODate(today))
        } else {
            // custom: keep current values, user edits fields

        }
    }

    React.useEffect(() => {
        // initialize default preset
        applyPreset('today')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Validate dates whenever they change
    useEffect(() => {
        const error = validateDateRange(startDate, endDate)
        setDateValidationError(error)
    }, [startDate, endDate])

    async function generateReport() {
        setFeedback(null)

        // Validate dates before generation
        const validationError = validateDateRange(startDate, endDate)
        if (validationError) {
            setDateValidationError(validationError)
            setFeedback({ type: 'error', message: validationError.message })
            return
        }

        setIsGenerating(true)
        try {
            // Simulate server processing time
            await new Promise((res) => setTimeout(res, 1200))

            const name = `Report ${formatNow()} (${startDate}→${endDate})`
            let blob: Blob
            let mime: string
            if (format === 'PDF') {
                blob = createSimplePdfBlob()
                mime = 'application/pdf'
            } else {
                blob = createSampleCsvBlob()
                mime = 'text/csv'
            }
            const url = URL.createObjectURL(blob)
            const item: ReportItem = {
                id: idCounter.current++,
                name,
                type: format,
                dateGenerated: new Date().toISOString(),
                inTrash: false,
                url,
                mimeType: mime,
            }
            setReports(prev => [item, ...prev])
            setFeedback({ type: 'success', message: 'Report generated successfully.' })
        } catch (e: any) {
            setFeedback({ type: 'error', message: e?.message || 'Failed to generate report.' })
        } finally {
            setIsGenerating(false)
        }
    }

    function downloadReport(item: ReportItem) {
        const a = document.createElement('a')
        a.href = item.url
        a.download = `${item.name}.${item.type.toLowerCase()}`
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    function previewReport(item: ReportItem) {
        setPreviewItem(item)
        setPreviewOpen(true)
    }

    function moveToTrash(item: ReportItem) {
        setReports(prev => prev.map(r => (r.id === item.id ? { ...r, inTrash: true } : r)))
    }

    function restoreFromTrash(item: ReportItem) {
        setReports(prev => prev.map(r => (r.id === item.id ? { ...r, inTrash: false } : r)))
    }

    function requestPermanentDelete(item: ReportItem) {
        setPendingDelete(item)
        setConfirmOpen(true)
    }

    async function confirmPermanentDelete() {
        if (!pendingDelete) return
        setIsDeleting(true)
        try {
            // TODO: Replace with real API call when backend is available
            await new Promise((res) => setTimeout(res, 500))
            URL.revokeObjectURL(pendingDelete.url)
            setReports(prev => prev.filter(r => r.id !== pendingDelete.id))
            setFeedback({ type: 'success', message: 'Report permanently deleted.' })
        } catch (e: any) {
            setFeedback({ type: 'error', message: e?.message || 'Failed to delete report.' })
        } finally {
            setIsDeleting(false)
            setConfirmOpen(false)
            setPendingDelete(null)
        }
    }

    const disableActions = isGenerating

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <p className="text-muted-foreground mt-1">Generate, preview, download, and manage reports.</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {/* Filters Row */}
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[200px]">
                                <p className="text-sm font-medium mb-1">Format</p>
                                <Select value={format} onValueChange={(v: ReportType) => setFormat(v)}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PDF">
                                            <div className="flex items-center gap-2"><FileText /> PDF</div>
                                        </SelectItem>
                                        <SelectItem value="CSV">
                                            <div className="flex items-center gap-2"><FileSpreadsheet /> CSV</div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium mb-1 w-full">Quick range</p>
                                <div className="flex gap-2 flex-wrap">
                                    <Button variant={preset === 'today' ? 'default' : 'outline'} size="sm" onClick={() => applyPreset('today')} disabled={isGenerating}>Today</Button>
                                    <Button variant={preset === '7' ? 'default' : 'outline'} size="sm" onClick={() => applyPreset('7')} disabled={isGenerating}>Last 7 days</Button>
                                    <Button variant={preset === '30' ? 'default' : 'outline'} size="sm" onClick={() => applyPreset('30')} disabled={isGenerating}>Last 30 days</Button>
                                    <Button variant={preset === 'custom' ? 'default' : 'outline'} size="sm" onClick={() => setPreset('custom')} disabled={isGenerating}>Custom</Button>
                                </div>
                            </div>

                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-1">Start date</p>
                                    <input
                                        type="date"
                                        className={getDateInputClassName(
                                            dateValidationError?.field === 'start' || dateValidationError?.field === 'both',
                                            isGenerating || preset !== 'custom'
                                        )}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        disabled={isGenerating || preset !== 'custom'}
                                    />
                                    {dateValidationError?.field === 'start' && (
                                        <p className="text-xs text-destructive mt-1">{dateValidationError.message}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-1">End date</p>
                                    <input
                                        type="date"
                                        className={getDateInputClassName(
                                            dateValidationError?.field === 'end' || dateValidationError?.field === 'both',
                                            isGenerating || preset !== 'custom'
                                        )}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        disabled={isGenerating || preset !== 'custom'}
                                    />
                                    {dateValidationError?.field === 'end' && (
                                        <p className="text-xs text-destructive mt-1">{dateValidationError.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1" />

                            <div className="flex items-end">
                                <Button onClick={generateReport} disabled={!canGenerateReport}>
                                    {isGenerating ? (
                                        <>
                                            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                                            Generating…
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCcw className="mr-2" /> Generate Report
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {feedback && (
                            <div className={feedback.type === 'success' ? 'text-emerald-600 text-sm' : 'text-destructive text-sm'}>
                                {feedback.message}
                            </div>
                        )}

                        {/* General validation error for both fields or range issues */}
                        {dateValidationError && (dateValidationError.field === 'both' || dateValidationError.type === 'empty') && (
                            <div className="text-destructive text-sm flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {dateValidationError.message}
                            </div>
                        )}

                        <Separator />

                        {/* Tips / Summary */}
                        <div className="text-xs text-muted-foreground">
                            Reports will include data from <span className="font-medium">{startDate || '—'}</span> to <span className="font-medium">{endDate || '—'}</span>.
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Active Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    {isGenerating && activeReports.length === 0 ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : activeReports.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No active reports yet. Generate one above.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[260px]">Report</TableHead>
                                    <TableHead className="w-[100px]">Type</TableHead>
                                    <TableHead className="w-[200px]">Date Generated</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[260px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeReports.map((r) => (
                                    <TableRow key={r.id} className="transition-colors">
                                        <TableCell className="font-medium">{r.name}</TableCell>
                                        <TableCell>{r.type}</TableCell>
                                        <TableCell>{new Date(r.dateGenerated).toLocaleString()}</TableCell>
                                        <TableCell>Active</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => previewReport(r)} disabled={disableActions}>
                                                    <Eye className="mr-2" /> Preview
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => downloadReport(r)} disabled={disableActions}>
                                                    <Download className="mr-2" /> Download
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => moveToTrash(r)} disabled={disableActions}>
                                                    <Trash2 className="mr-2" /> Move to Trash
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Trash</CardTitle>
                </CardHeader>
                <CardContent>
                    {trashedReports.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Trash is empty.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[260px]">Report</TableHead>
                                    <TableHead className="w-[100px]">Type</TableHead>
                                    <TableHead className="w-[200px]">Date Generated</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[300px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trashedReports.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.name}</TableCell>
                                        <TableCell>{r.type}</TableCell>
                                        <TableCell>{new Date(r.dateGenerated).toLocaleString()}</TableCell>
                                        <TableCell>In Trash</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => restoreFromTrash(r)} disabled={disableActions}>
                                                    <ArchiveRestore className="mr-2" /> Restore
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => requestPermanentDelete(r)} disabled={disableActions}>
                                                    <Trash className="mr-2" /> Delete Permanently
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-5xl" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Preview: {previewItem?.name}</span>
                            {/* <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} aria-label="Close preview">
                                <X />
                            </Button> */}
                        </DialogTitle>
                    </DialogHeader>
                    {previewItem?.type === 'PDF' ? (
                        <div className="h-[80vh]">
                            <PdfViewer fileUrl={previewItem.url} fileName={`${previewItem.name}.pdf`} />
                        </div>
                    ) : previewItem?.type === 'CSV' ? (
                        <CsvPreview url={previewItem.url} />
                    ) : null}
                </DialogContent>
            </Dialog>

            {/* Permanent Delete Confirmation Dialog */}
            <Dialog open={confirmOpen} onOpenChange={(v) => { if (!isDeleting) setConfirmOpen(v) }}>
                <DialogContent className="max-w-md" aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle />
                            Confirm Permanent Delete
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        <p>Are you sure you want to permanently delete this report?</p>
                        <p className="text-muted-foreground">This action cannot be undone, and the report cannot be restored.</p>
                        {pendingDelete && (
                            <p className="text-xs text-muted-foreground">Target: <span className="font-medium">{pendingDelete.name}</span></p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmPermanentDelete} disabled={isDeleting}>
                            {isDeleting && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />}
                            Confirm Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CsvPreview({ url }: { url: string }) {
    const [rows, setRows] = useState<string[][]>([])
    const [error, setError] = useState<string | null>(null)

    React.useEffect(() => {
        let active = true
        fetch(url)
            .then(r => r.text())
            .then(text => {
                if (!active) return
                const parsed = text.split(/\r?\n/).filter(Boolean).map(line => line.split(','))
                setRows(parsed)
            })
            .catch((e) => setError(e?.message || 'Failed to load CSV'))
        return () => {
            active = false
        }
    }, [url])

    if (error) return <div className="text-sm text-destructive">{error}</div>
    if (rows.length === 0) return <div className="text-sm text-muted-foreground">Loading preview…</div>

    const header = rows[0]
    const body = rows.slice(1, 100)

    return (
        <div className="max-h-[70vh] overflow-auto border rounded-md">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        {header.map((h, idx) => (
                            <th key={idx} className="text-left font-medium p-2 bg-muted/50">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {body.map((r, i) => (
                        <tr key={i} className="border-b last:border-0">
                            {r.map((c, j) => (
                                <td key={j} className="p-2 align-middle">{c}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ReportSection