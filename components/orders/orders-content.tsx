"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Receipt, Clock, CheckCircle, XCircle, AlertCircle, Eye, ExternalLink, ShoppingCart, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

type OrderItem = {
  id: string
  siteId: string
  siteName: string
  priceCents: number
  withContent: boolean
  quantity: number
}

type Transaction = {
  id: string
  amount: number
  currency: string
  status: "INITIATED" | "SUCCESS" | "FAILED"
  provider?: string
  reference?: string
  createdAt: string
}

type Order = {
  id: string
  totalAmount: number
  currency: string
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  transactions: Transaction[]
}

const statusConfig = {
  PENDING: { icon: Clock, color: "status-pending", label: "Pending" },
  PAID: { icon: CheckCircle, color: "status-paid", label: "Paid" },
  FAILED: { icon: XCircle, color: "status-failed", label: "Failed" },
  CANCELLED: { icon: AlertCircle, color: "status-cancelled", label: "Cancelled" },
}

const transactionStatusConfig = {
  INITIATED: { icon: Clock, color: "tx-initiated", label: "Initiated" },
  SUCCESS: { icon: CheckCircle, color: "tx-success", label: "Success" },
  FAILED: { icon: XCircle, color: "tx-failed", label: "Failed" },
}

export function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchOrders = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      console.log(`🔄 Fetching orders page ${pageNum}...`)
      const response = await fetch(`/api/user/orders?page=${pageNum}&limit=5`)
      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Orders data received:', data)
        
        if (append) {
          setOrders(prev => [...prev, ...(data.orders || [])])
        } else {
          setOrders(data.orders || [])
        }
        
        setHasMore(data.hasMore || false)
        setPage(pageNum)
      } else {
        const errorData = await response.json()
        console.error('❌ API Error:', errorData)
      }
    } catch (error) {
      console.error('❌ Network/Request Error:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders(1, false)
  }, [fetchOrders])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOrders(page + 1, true)
    }
  }

  const formatCurrency = (cents: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(cents / 100)
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Your Orders</h2>
          <p className="text-muted-foreground">View and manage all your orders</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {/* Orders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                All Orders
              </CardTitle>
              <CardDescription>
                Complete history of your purchases
              </CardDescription>
            </div>
            {orders.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {orders.length} orders
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Start browsing publishers to make your first purchase.</p>
              <Button asChild>
                <Link href="/data">
                  Browse Publishers
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                const latestTransaction = order.transactions.length > 0 
                  ? order.transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                  : null
                
                return (
                  <div key={order.id} className="group flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        <StatusIcon className="h-6 w-6 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-lg text-gray-900">Order #{order.id.slice(-8)}</p>
                          {latestTransaction && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${transactionStatusConfig[latestTransaction.status].color}`}
                            >
                              {transactionStatusConfig[latestTransaction.status].label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatCurrency(order.totalAmount, order.currency)}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </span>
                          {order.items.length > 0 && (
                            <span className="flex items-center gap-1">
                              <ShoppingCart className="h-3 w-3" />
                              {order.items[0].siteName}{order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${statusConfig[order.status].color} font-semibold px-3 py-1`}>
                        {statusConfig[order.status].label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                )
              })}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Loading more orders...
                      </>
                    ) : (
                      'Load More Orders'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Complete information about your order and transactions
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="overflow-y-auto max-h-[80vh] pr-2">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl border">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Order ID</p>
                    <p className="text-sm font-mono text-gray-900 font-semibold">{selectedOrder.id}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Status</p>
                    <Badge className={`${statusConfig[selectedOrder.status].color} font-semibold px-3 py-1`}>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Order Date</p>
                    <p className="text-sm text-gray-900 font-medium">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl border">
                    <div className="p-3 bg-gray-200 rounded-full w-fit mx-auto mb-3">
                      <ShoppingCart className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{selectedOrder.items.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Items</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl border">
                    <div className="p-3 bg-gray-200 rounded-full w-fit mx-auto mb-3">
                      <Receipt className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{selectedOrder.transactions.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Transactions</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl border">
                    <div className="p-3 bg-gray-200 rounded-full w-fit mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {selectedOrder.transactions.filter(t => t.status === 'SUCCESS').length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Successful</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="border rounded-xl overflow-hidden bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">Site Name</TableHead>
                          <TableHead className="font-semibold text-gray-900">Site ID</TableHead>
                          <TableHead className="text-right font-semibold text-gray-900">Unit Price</TableHead>
                          <TableHead className="text-center font-semibold text-gray-900">Quantity</TableHead>
                          <TableHead className="text-right font-semibold text-gray-900">Total</TableHead>
                          <TableHead className="text-center font-semibold text-gray-900">With Content</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => {
                          const itemTotal = item.priceCents * item.quantity
                          return (
                            <TableRow key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                              <TableCell className="font-semibold text-gray-900">{item.siteName}</TableCell>
                              <TableCell className="text-gray-600 font-mono text-sm">{item.siteId}</TableCell>
                              <TableCell className="text-right font-medium text-gray-900">{formatCurrency(item.priceCents, selectedOrder.currency)}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                                  {item.quantity}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold text-gray-900">{formatCurrency(itemTotal, selectedOrder.currency)}</TableCell>
                              <TableCell className="text-center">
                                <Badge 
                                  variant={item.withContent ? "default" : "secondary"} 
                                  className={`text-xs font-medium ${item.withContent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                  {item.withContent ? "Yes" : "No"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-end mt-6 p-6 bg-gray-50 rounded-xl border">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 font-medium mb-2">Order Total</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}</p>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                {selectedOrder.transactions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <ExternalLink className="h-6 w-6" />
                      </div>
                      Transaction History ({selectedOrder.transactions.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.transactions
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((transaction) => {
                          const TransactionIcon = transactionStatusConfig[transaction.status].icon
                          return (
                            <div key={transaction.id} className="group flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-shrink-0 p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                                  <TransactionIcon className="h-6 w-6 text-gray-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <p className="font-bold text-xl text-gray-900">{formatCurrency(transaction.amount, transaction.currency)}</p>
                                    <Badge className={`${transactionStatusConfig[transaction.status].color} font-semibold px-3 py-1`}>
                                      {transactionStatusConfig[transaction.status].label}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    {transaction.provider && (
                                      <span className="font-medium">via {transaction.provider}</span>
                                    )}
                                    {transaction.reference && (
                                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">Ref: {transaction.reference}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right p-4 bg-gray-50 rounded-lg border">
                                <p className="text-xs text-gray-600 font-medium mb-1">Transaction ID</p>
                                <p className="text-xs font-mono text-gray-900 font-semibold">{transaction.id.slice(-8)}</p>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {/* No Transactions Message */}
                {selectedOrder.transactions.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
                    <p className="text-gray-500">Payment transactions will appear here once initiated.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
