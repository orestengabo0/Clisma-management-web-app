import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { ChevronLeft, ChevronRight, Download, Maximize, Minimize, Printer, ZoomIn, ZoomOut } from 'lucide-react'

// Lazy import react-pdf to avoid SSR issues and reduce initial bundle
let pdfjsLib: any
let DocumentComp: any
let PageComp: any

async function ensurePdfImports() {
    if (!pdfjsLib) {
        const mod = await import('react-pdf')
        // Use pdfjs from react-pdf and set worker via URL to avoid TS/type issues
        const { pdfjs } = mod as any
        // Set workerSrc using the same version as pdfjs to prevent API/Worker mismatch
        const workerVersion = (pdfjs as any).version || '3.11.174'
            ; (pdfjs as any).GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${workerVersion}/build/pdf.worker.min.mjs`
        pdfjsLib = pdfjs
        DocumentComp = mod.Document
        PageComp = mod.Page
    }
}

type FitMode = 'fit-width' | 'fit-page'

type PdfViewerProps = {
    fileUrl: string
    fileName?: string
}

export function PdfViewer({ fileUrl, fileName = 'report.pdf' }: PdfViewerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [numPages, setNumPages] = useState<number>(0)
    const [scale, setScale] = useState<number>(1)
    const [pageWidth, setPageWidth] = useState<number>(800)
    const [fitMode, setFitMode] = useState<FitMode>('fit-width')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [ready, setReady] = useState<boolean>(false)
    const [visiblePages, setVisiblePages] = useState<Record<number, boolean>>({ 1: true })

    useEffect(() => {
        ensurePdfImports().then(() => setReady(true)).catch(() => setReady(false))
    }, [])

    // Resize observer to adapt width
    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current
        const ro = new ResizeObserver(() => {
            const padding = 0
            const width = el.clientWidth - padding
            setPageWidth(Math.max(320, width))
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Adjust scale when fit mode or width changes
    useEffect(() => {
        if (fitMode === 'fit-width') {
            setScale(1)
        }
    }, [fitMode, pageWidth])

    const onLoadSuccess = useCallback((info: { numPages: number }) => {
        setNumPages(info.numPages)
    }, [])

    const zoomIn = useCallback(() => setScale((s) => Math.min(4, s + 0.1)), [])
    const zoomOut = useCallback(() => setScale((s) => Math.max(0.25, s - 0.1)), [])
    const fitWidth = useCallback(() => setFitMode('fit-width'), [])
    const fitPage = useCallback(() => setFitMode('fit-page'), [])

    const goPrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), [])
    const goNext = useCallback(() => setCurrentPage((p) => Math.min(numPages || 1, p + 1)), [numPages])

    const onGoToPage = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const val = Number(fd.get('page'))
        if (!Number.isNaN(val)) setCurrentPage(Math.min(Math.max(1, val), numPages || 1))
    }, [numPages])

    const effectiveWidth = useMemo(() => {
        if (fitMode === 'fit-page') {
            // For fit-page, choose a slightly smaller width to keep whole page visible vertically.
            return Math.min(pageWidth, 900)
        }
        return pageWidth
    }, [fitMode, pageWidth])

    // Intersection observer for lazy page rendering
    useEffect(() => {
        if (!containerRef.current) return
        const container = containerRef.current
        const io = new IntersectionObserver(
            (entries) => {
                const updates: Record<number, boolean> = {}
                for (const entry of entries) {
                    const idx = Number((entry.target as HTMLElement).dataset.pageIndex)
                    if (entry.isIntersecting) updates[idx] = true
                }
                if (Object.keys(updates).length) setVisiblePages((prev) => ({ ...prev, ...updates }))
            },
            { root: container, rootMargin: '200px 0px', threshold: 0.01 }
        )

        const items = container.querySelectorAll('[data-page-index]')
        items.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [numPages, ready, effectiveWidth, scale])

    const handleDownload = useCallback(() => {
        const a = document.createElement('a')
        a.href = fileUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
    }, [fileUrl, fileName])

    const handlePrint = useCallback(() => {
        const win = window.open(fileUrl, '_blank')
        win?.print()
    }, [fileUrl])

    return (
        <Card className="w-full">
            <div className="flex items-center justify-between p-3 gap-2 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goPrev} disabled={currentPage <= 1}><ChevronLeft /></Button>
                    <form onSubmit={onGoToPage} className="flex items-center gap-2">
                        <input
                            name="page"
                            type="number"
                            min={1}
                            max={Math.max(1, numPages)}
                            defaultValue={currentPage}
                            className="h-9 w-16 rounded-md border bg-background px-2 text-center text-sm"
                        />
                        <span className="text-sm text-muted-foreground">/ {numPages || 1}</span>
                    </form>
                    <Button variant="outline" size="icon" onClick={goNext} disabled={currentPage >= (numPages || 1)}><ChevronRight /></Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={zoomOut}><ZoomOut /></Button>
                    <Button variant="outline" size="icon" onClick={zoomIn}><ZoomIn /></Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant={fitMode === 'fit-width' ? 'default' : 'outline'} size="sm" onClick={fitWidth}><Maximize className="mr-2" /> Fit width</Button>
                    <Button variant={fitMode === 'fit-page' ? 'default' : 'outline'} size="sm" onClick={fitPage}><Minimize className="mr-2" /> Fit page</Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm" onClick={handleDownload}><Download className="mr-2" /> Download</Button>
                    <Button variant="ghost" size="sm" onClick={handlePrint}><Printer className="mr-2" /> Print</Button>
                </div>
            </div>
            <CardContent className="p-0">
                <div ref={containerRef} className="h-[75vh] w-full overflow-auto">
                    {!ready ? (
                        <div className="p-6 text-sm text-muted-foreground">Loading PDF viewer…</div>
                    ) : (
                        <DocumentComp file={fileUrl} onLoadSuccess={onLoadSuccess} loading={<div className="p-6 text-sm text-muted-foreground">Loading document…</div>}>
                            <div className="flex flex-col items-center py-4 gap-4">
                                {Array.from({ length: numPages || 1 }, (_, i) => i + 1).map((pageIndex) => (
                                    <div key={pageIndex} data-page-index={pageIndex} className="w-full flex justify-center">
                                        {visiblePages[pageIndex] ? (
                                            <PageComp
                                                pageNumber={pageIndex}
                                                width={Math.round(effectiveWidth * (fitMode === 'fit-page' ? 0.9 : 1) * scale)}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                onRenderSuccess={() => {
                                                    // noop; placeholder for current-page tracking
                                                }}
                                            />
                                        ) : (
                                            <div style={{ width: Math.round(effectiveWidth * (fitMode === 'fit-page' ? 0.9 : 1) * scale), height: 1123 }} className="rounded-md bg-muted/30 animate-pulse" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </DocumentComp>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default PdfViewer
