'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PRODUCTS } from '@/lib/products'
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  description: string
  details: string
  sizes: string[]
  colors: string[]
  material: string
  rating: number
  reviews: number
  inStock: boolean
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const productId = parseInt(params.id)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const [loading, setLoading] = useState(true)

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  })

  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    const foundProduct = PRODUCTS.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      if (foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0])
      }
      if (foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0])
      }
    }
    setLoading(false)
  }, [productId])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('لطفاً سائز منتخب کریں')
      return
    }
    setShowPaymentForm(true)
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!paymentData.fullName || !paymentData.email || !paymentData.phone ||
        !paymentData.address || !paymentData.city || !paymentData.zipCode ||
        !paymentData.cardNumber || !paymentData.cardExpiry || !paymentData.cardCVV) {
      alert('تمام معلومات درج کریں')
      return
    }

    // Simulate order placement
    setOrderPlaced(true)
    setTimeout(() => {
      alert(`✅ آرڈر کامیاب!\n\nآپ کا آرڈر #${Math.random().toString(36).substr(2, 9).toUpperCase()} تخلیق ہو گیا ہے۔`)
      router.push('/orders')
    }, 2000)
  }

  if (loading) {
    return <div className="text-center py-20">لوڈ ہو رہا ہے...</div>
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">پروڈکٹ نہیں ملا</h1>
        <Link href="/products" className="text-pink-600 hover:text-pink-700">
          واپس جائیں
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-pink-600">ہوم</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-pink-600">پروڈکٹس</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-sm text-gray-500 text-center">
              پروڈکٹ کی تصویر
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Product Title & Rating */}
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">Rs {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">Rs {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">تفصیل</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <p className="text-gray-600 leading-relaxed mt-2">{product.details}</p>
            </div>

            {/* Material & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">مواد</p>
                <p className="font-semibold text-gray-900">{product.material}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">دستیابی</p>
                <p className="font-semibold text-gray-900">
                  {product.inStock ? '✅ اسٹاک میں ہے' : '❌ اسٹاک سے باہر'}
                </p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">سائز منتخب کریں</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border-2 rounded-lg font-semibold transition ${
                        selectedSize === size
                          ? 'border-pink-600 bg-pink-50 text-pink-600'
                          : 'border-gray-200 text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">رنگ منتخب کریں</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 border-2 rounded-lg font-semibold transition ${
                        selectedColor === color
                          ? 'border-pink-600 bg-pink-50 text-pink-600'
                          : 'border-gray-200 text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900"
                >
                  −
                </button>
                <span className="px-6 py-3 border-l border-r border-gray-200 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                  product.inStock
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                کارٹ میں شامل کریں
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className={`px-6 py-3 border-2 rounded-lg transition ${
                  wishlist
                    ? 'bg-pink-50 border-pink-600 text-pink-600'
                    : 'border-gray-200 text-gray-600 hover:border-pink-300'
                }`}
              >
                <Heart size={20} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t-2">
              <div className="flex gap-3">
                <div className="text-2xl">🚚</div>
                <div>
                  <p className="font-semibold text-gray-900">مفت ڈیلیوری</p>
                  <p className="text-sm text-gray-600">Rs 3000 سے زیادہ</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <p className="font-semibold text-gray-900">محفوظ ادائیگی</p>
                  <p className="text-sm text-gray-600">100% محفوظ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">چیک آؤٹ</h2>
              <button
                onClick={() => !orderPlaced && setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {orderPlaced ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">آرڈر کامیاب!</h3>
                <p className="text-gray-600 mb-4">آپ کا آرڈر تخلیق ہو گیا ہے۔</p>
                <p className="text-gray-600">جلد ہی آپ کو تصدیقی ای میل موصول ہوگی۔</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-6">

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">آرڈر کا خلاصہ</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{product.name}</span>
                      <span className="font-semibold">Rs {product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مقدار: {quantity}</span>
                      <span className="font-semibold">Rs {(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-semibold">کل</span>
                      <span className="font-bold text-lg text-pink-600">Rs {(product.price * quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">ڈیلیوری کی معلومات</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="مکمل نام"
                      value={paymentData.fullName}
                      onChange={handlePaymentChange}
                      className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="ای میل"
                      value={paymentData.email}
                      onChange={handlePaymentChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="فون نمبر"
                      value={paymentData.phone}
                      onChange={handlePaymentChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="پتہ"
                      value={paymentData.address}
                      onChange={handlePaymentChange}
                      className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="شہر"
                      value={paymentData.city}
                      onChange={handlePaymentChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="زپ کوڈ"
                      value={paymentData.zipCode}
                      onChange={handlePaymentChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">پیمنٹ کی معلومات</h3>

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="کریڈٹ کارڈ نمبر (16 ہندسے)"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    maxLength={16}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={paymentData.cardExpiry}
                      onChange={handlePaymentChange}
                      maxLength={5}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="cardCVV"
                      placeholder="CVV (3 ہندسے)"
                      value={paymentData.cardCVV}
                      onChange={handlePaymentChange}
                      maxLength={3}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    منسوخ کریں
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
                  >
                    آرڈر مکمل کریں
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
