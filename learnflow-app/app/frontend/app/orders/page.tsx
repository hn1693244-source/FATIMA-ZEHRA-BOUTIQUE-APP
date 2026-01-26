'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { orderAPI } from '@/lib/api'
import { auth } from '@/lib/auth'

interface OrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  price: string | number
}

interface Order {
  id: number
  user_id: number
  status: string
  total_amount: string | number
  shipping_address: string
  payment_status: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.isAuthenticated()) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await orderAPI.listOrders()
        setOrders(response.data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
            <Link
              href="/products"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow">
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-lg">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status.charAt(0).toUpperCase() +
                          order.payment_status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p>
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-semibold text-gray-900">
                          Rs.{' '}
                          {parseFloat(String(order.total_amount)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400">
                    {expandedOrder === order.id ? '▼' : '▶'}
                  </div>
                </button>

                {/* Order Details (Expanded) */}
                {expandedOrder === order.id && (
                  <div className="border-t px-6 py-4 space-y-4">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold mb-3">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm py-2 border-b border-gray-200"
                          >
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              Rs.{' '}
                              {(
                                parseFloat(String(item.price)) *
                                item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {order.shipping_address}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>
                          Rs.{' '}
                          {parseFloat(String(order.total_amount)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>
                          Rs.{' '}
                          {parseFloat(String(order.total_amount)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href="/products"
                        className="flex-1 text-center bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
                      >
                        Continue Shopping
                      </Link>
                      {order.status.toLowerCase() === 'pending' && (
                        <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
