"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Mail, Calendar, Shield, Filter, ShoppingCart, Receipt, Clock, CheckCircle, XCircle, AlertCircle, Eye, ExternalLink } from "lucide-react"
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

type User = {
  id: string
  name?: string
  email: string
  image?: string
}

interface DashboardContentProps {
  user: User
  userRole?: string
}

const statusConfig = {
  PENDING: { icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300", label: "Pending" },
  PAID: { icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300", label: "Paid" },
  FAILED: { icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300", label: "Failed" },
  CANCELLED: { icon: AlertCircle, color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300", label: "Cancelled" },
}

const transactionStatusConfig = {
  INITIATED: { icon: Clock, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300", label: "Initiated" },
  SUCCESS: { icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300", label: "Success" },
  FAILED: { icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300", label: "Failed" },
}

export function DashboardContent({ user, userRole }: DashboardContentProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/user/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatCurrency = (cents: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(cents / 100)
  }

  const getTotalSpent = () => {
    return orders
      .filter(order => order.status === 'PAID')
      .reduce((total, order) => total + order.totalAmount, 0)
  }

  const getTotalOrders = () => {
    return orders.length
  }

  const getPendingOrders = () => {
    return orders.filter(order => order.status === 'PENDING').length
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Welcome back, {user.name || user.email}!</h2>
        <p className="text-muted-foreground">Here's what's happening with your account.</p>
      </div>
      
      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/data">
            <Filter className="mr-2 h-4 w-4" />
            Browse Publishers
          </Link>
        </Button>
        {userRole === "ADMIN" && (
          <Button variant="outline" asChild>
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalSpent())}</div>
            <p className="text-xs text-muted-foreground">
              Across all paid orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalOrders()}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingOrders()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-bold">{user.name || "No name"}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
              {userRole && (
                <Badge variant={userRole === "ADMIN" ? "default" : "secondary"}>
                  {userRole}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Your latest purchases and their status
          </CardDescription>
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
                  <Filter className="mr-2 h-4 w-4" />
                  Browse Publishers
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatCurrency(order.totalAmount, order.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                )
              })}
              {orders.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    View All Orders ({orders.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about your order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Order ID</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={statusConfig[selectedOrder.status].color}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Order Date</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site Name</TableHead>
                      <TableHead>Site ID</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>With Content</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.siteName}</TableCell>
                        <TableCell className="text-muted-foreground">{item.siteId}</TableCell>
                        <TableCell>{formatCurrency(item.priceCents, selectedOrder.currency)}</TableCell>
                        <TableCell>
                          <Badge variant={item.withContent ? "default" : "secondary"}>
                            {item.withContent ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Transactions */}
              {selectedOrder.transactions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                  <div className="space-y-3">
                    {selectedOrder.transactions.map((transaction) => {
                      const TransactionIcon = transactionStatusConfig[transaction.status].icon
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <TransactionIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.provider && `via ${transaction.provider}`}
                                {transaction.reference && ` • Ref: ${transaction.reference}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          </div>
                          <Badge className={transactionStatusConfig[transaction.status].color}>
                            {transactionStatusConfig[transaction.status].label}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
