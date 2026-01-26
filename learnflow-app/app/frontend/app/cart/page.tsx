'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { orderAPI } from '@/lib/api'
import { auth } from '@/lib/auth'

export default function CartPage() {
  const router = useRouter()
  const { items, setCart, removeItem, clear } = useCartStore()
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    const fetchCart = async () => {
      if (!auth.isAuthenticated()) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await orderAPI.getCart()
        setCart(response.data.items, response.data.total_amount)
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const total = items.reduce(
    (sum, item) => sum + parseFloat(String(item.price)) * item.quantity,
    0
  )

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      // For demo, use default address
      const response = await orderAPI.checkout('123 Main Street, City, Country')
      clear()
      router.push(`/orders/${response.data.id}`)
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading cart...</div>
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Product</th>
                    <th className="px-6 py-4 text-center font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-right font-semibold">Price</th>
                    <th className="px-6 py-4 text-right font-semibold">Total</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.product_id} className="border-t">
                      <td className="px-6 py-4">{item.product_name}</td>
                      <td className="px-6 py-4 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">
                        Rs. {parseFloat(String(item.price)).toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        Rs. {(parseFloat(String(item.price)) * item.quantity).toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Rs. 0</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>Rs. {total.toFixed(0)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-pink-600 text-white py-3 rounded font-semibold hover:bg-pink-700 disabled:bg-gray-300 transition"
              >
                {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link
                href="/products"
                className="block text-center mt-4 text-pink-600 hover:text-pink-700 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
