'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { productAPI, orderAPI } from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { auth } from '@/lib/auth'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  category_id?: number
  category?: { id: number; name: string }
  image_url?: string
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const productId = parseInt(params.id)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProduct(productId)
        setProduct(response.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!auth.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    setAdding(true)
    try {
      await orderAPI.addToCart(productId, quantity, product!.price)
      addItem({
        product_id: productId,
        product_name: product!.name,
        quantity,
        price: product!.price,
      })
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Product not found</p>
            <Link
              href="/products"
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              Back to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/products" className="hover:text-pink-600">
            Products
          </Link>
          <span>›</span>
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.id}`}
                className="hover:text-pink-600"
              >
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Title & Category */}
            <h1 className="text-4xl font-serif font-bold mb-2">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-gray-600 mb-4">
                Category:{' '}
                <Link
                  href={`/products?category=${product.category.id}`}
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  {product.category.name}
                </Link>
              </p>
            )}

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <p className="text-4xl font-bold text-pink-600">
                Rs. {product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : 'Out of stock'}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {product.stock_quantity > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() =>
                          setQuantity(Math.max(1, quantity - 1))
                        }
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.min(
                              product.stock_quantity,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          )
                        }
                        className="w-16 text-center border-0 focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock_quantity, quantity + 1)
                          )
                        }
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 transition text-lg"
                    >
                      {adding ? 'Adding...' : 'Add to Cart'}
                    </button>
                    {showMessage && (
                      <div className="mt-2 text-sm text-green-600 font-semibold text-center">
                        ✓ Added to cart
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-100 p-6 rounded-lg space-y-4">
              <div>
                <p className="text-sm text-gray-600">SKU</p>
                <p className="font-semibold">PROD-{product.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Added</p>
                <p className="font-semibold">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">
                  {product.is_active ? '✓ Available' : 'Unavailable'}
                </p>
              </div>
            </div>

            {/* Related Products Link */}
            <div className="mt-8 pt-8 border-t">
              <Link
                href={
                  product.category
                    ? `/products?category=${product.category.id}`
                    : '/products'
                }
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                ← Back to {product.category ? product.category.name : 'Products'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
