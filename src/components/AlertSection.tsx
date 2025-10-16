import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { getAlerts, deleteAlert, type AlertsResponse, type AlertItem } from '@/lib/api'
import { useAuthStore } from '@/lib/authStore'
import { Skeleton } from './ui/skeleton'
import { Check, Trash2, RefreshCcw } from 'lucide-react'

// AlertItem type now imported from lib/api

const AlertSection = () => {
    const token = useAuthStore((s) => s.token)
    const [alerts, setAlerts] = useState<AlertItem[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [deletingIds, setDeletingIds] = useState<Record<number, boolean>>({})
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(10)
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // Headers no longer needed; using authorized client in lib/api

    async function fetchAlerts() {
        setIsLoading(true)
        setError(null)
        try {
            const response: AlertsResponse = await getAlerts(page, size, 'id,ASC')
            setAlerts(response.content)
            setTotalElements(response.totalElements)
            setTotalPages(response.totalPages)
        } catch (e: any) {
            setError(e?.message || 'Failed to load alerts')
            setAlerts([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, page, size])

    async function handleMarkAsRead(id: number) {
        setDeletingIds((prev) => ({ ...prev, [id]: true }))
        try {
            await deleteAlert(id)
            setAlerts((prev) => (prev ? prev.filter((a) => a.id !== id) : prev))
        } catch (e) {
            // keep the item but show a toast-like inline error
            setError((e as any)?.message || 'Failed to mark alert as read')
        } finally {
            setDeletingIds((prev) => ({ ...prev, [id]: false }))
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
                <p className="text-muted-foreground mt-1">Recent system notifications and detection alerts.</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>Incoming Alerts</CardTitle>
                        <div className="flex items-center gap-2">
                            <select
                                className="border rounded px-2 py-1 text-sm"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value) || 10)}
                                disabled={isLoading}
                                aria-label="Page size"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <Button variant="outline" size="sm" onClick={fetchAlerts} disabled={isLoading}>
                                <RefreshCcw className="mr-2" /> Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : error ? (
                        <div className="text-sm text-destructive">
                            {error}
                        </div>
                    ) : alerts && alerts.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No alerts to display.</div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Type</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="w-[160px]">Sent To</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="w-[160px]">Vehicle Detection Id</TableHead>
                                        <TableHead className="w-[80px] text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts?.map((alert) => (
                                        <TableRow key={alert.id}>
                                            <TableCell className="font-medium">{alert.type}</TableCell>
                                            <TableCell className="max-w-[520px] truncate" title={alert.message}>{alert.message}</TableCell>
                                            <TableCell>{alert.sentTo}</TableCell>
                                            <TableCell>{alert.status}</TableCell>
                                            <TableCell>{alert.vehicleDetectionId ?? '—'}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Mark as read"
                                                        onClick={() => handleMarkAsRead(alert.id)}
                                                        disabled={!!deletingIds[alert.id]}
                                                        title="Mark as read"
                                                    >
                                                        {deletingIds[alert.id] ? <Skeleton className="h-4 w-4" /> : <Check />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex items-center justify-between mt-4 text-sm">
                                <div>
                                    Showing page {page + 1} of {Math.max(1, totalPages)} — {totalElements.toLocaleString()} total
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled={page <= 0 || isLoading} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</Button>
                                    <Button variant="outline" size="sm" disabled={page + 1 >= totalPages || isLoading} onClick={() => setPage((p) => p + 1)}>Next</Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default AlertSection