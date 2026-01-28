'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { productAPI, orderAPI } from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { auth } from '@/lib/auth'
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'

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

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
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
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const { addItem } = useCartStore()

  // Sample reviews data
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Ayesha Khan',
      rating: 5,
      comment: 'Beautiful quality and excellent fit! Highly recommended.',
      date: '2026-01-20',
    },
    {
      id: 2,
      name: 'Fatima Ali',
      rating: 4,
      comment: 'Great design. Delivery was a bit late but product is amazing.',
      date: '2026-01-15',
    },
    {
      id: 3,
      name: 'Maria Hassan',
      rating: 5,
      comment: 'Perfect for special occasions. The fabric is premium quality.',
      date: '2026-01-10',
    },
  ]

  // Product image gallery
  const productImages = [
    product?.image_url || 'https://images.unsplash.com/photo-1595652877803-a51fb0ddc4c0?w=800',
    'https://images.unsplash.com/photo-1578849278619-3f286f327f5f?w=800',
    'https://images.unsplash.com/photo-1595777707802-221658c2e8e6?w=800',
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Pink', 'Red', 'Purple', 'Blue', 'Green', 'Black']

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
      const token = auth.getToken()
      await orderAPI.addToCart(token || "", productId, quantity)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-lg">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container-wide py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
            <Link
              href="/products"
              className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-semibold"
            >
              Back to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container-wide py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/products" className="hover:text-pink-600 dark:hover:text-pink-400">
            Products
          </Link>
          <span>›</span>
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.id}`}
                className="hover:text-pink-600 dark:hover:text-pink-400"
              >
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-slate-900 dark:text-white font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image Gallery */}
          <div>
            <div className="relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden aspect-square shadow-lg mb-6">
              {product.image_url ? (
                <>
                  <img
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">Out of Stock</span>
                    </div>
                  )}
                  {/* Image Navigation */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} className="text-slate-900 dark:text-white" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === productImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition"
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} className="text-slate-900 dark:text-white" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex
                        ? 'border-pink-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-pink-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Title & Category */}
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-white">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                <span className="font-semibold">Category:</span>{' '}
                <Link
                  href={`/products?category=${product.category.id}`}
                  className="text-pink-600 dark:text-pink-400 hover:underline"
                >
                  {product.category.name}
                </Link>
              </p>
            )}

            {/* Rating & Stock */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}
                  />
                ))}
                <span className="ml-2 text-slate-600 dark:text-slate-400">(42 reviews)</span>
              </div>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`p-2 rounded-full transition ${
                  wishlist ? 'bg-pink-100 dark:bg-pink-900' : 'bg-slate-100 dark:bg-slate-800'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={24} className={wishlist ? 'fill-pink-500 text-pink-500' : 'text-slate-600 dark:text-slate-400'} />
              </button>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                Rs. {product.price.toLocaleString()}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} items in stock`
                  : 'Out of stock'}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Description</h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size & Color Selection */}
            {product.stock_quantity > 0 && (
              <div className="mb-8 space-y-6">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-white">
                    Select Size
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 rounded-lg font-semibold transition border-2 ${
                          selectedSize === size
                            ? 'bg-pink-600 dark:bg-pink-500 text-white border-pink-600 dark:border-pink-500'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-pink-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-white">
                    Select Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`py-2 px-3 rounded-lg font-semibold transition border-2 ${
                          selectedColor === color
                            ? 'bg-pink-600 dark:bg-pink-500 text-white border-pink-600 dark:border-pink-500'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-pink-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-white">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
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
                      className="w-16 text-center border-0 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock_quantity, quantity + 1))
                      }
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding || !selectedSize || !selectedColor}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-4 px-6 rounded-lg transition duration-300 text-lg"
                >
                  {adding ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                {showMessage && (
                  <div className="text-center text-green-600 dark:text-green-400 font-semibold animate-pulse">
                    ✓ Added to cart successfully!
                  </div>
                )}
                {!selectedSize && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">Please select size and color</p>
                )}
              </div>
            )}

            {/* Specifications */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4 mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">SKU</p>
                  <p className="font-semibold text-slate-900 dark:text-white">PROD-{product.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Material</p>
                  <p className="font-semibold text-slate-900 dark:text-white">Premium Cotton</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Care</p>
                  <p className="font-semibold text-slate-900 dark:text-white">Hand Wash</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {product.is_active ? '✓ Available' : 'Unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-l-4 border-pink-500 pl-4 py-2">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'
                      }
                    />
                  ))}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{review.name}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{review.comment}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{review.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Link */}
        <div className="text-center">
          <Link
            href={
              product.category ? `/products?category=${product.category.id}` : '/products'
            }
            className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-bold text-lg"
          >
            ← Back to {product.category ? product.category.name : 'Products'}
          </Link>
        </div>
      </div>
    </div>
  )
}
