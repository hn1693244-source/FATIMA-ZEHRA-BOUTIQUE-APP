'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { productAPI } from '@/lib/api'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image_url?: string
  stock_quantity: number
}

interface Category {
  id: number
  name: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
  )
  const [search, setSearch] = useState('')
  const [skip, setSkip] = useState(0)
  const limit = 12

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.listCategories()
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await productAPI.listProducts({
          skip,
          limit,
          category_id: selectedCategory || undefined,
          search: search || undefined,
        })
        setProducts(response.data.products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [selectedCategory, search, skip])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-serif text-lg font-bold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setSkip(0)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold mb-3">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setSkip(0)
                    }}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === null
                        ? 'bg-pink-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setSkip(0)
                      }}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === cat.id
                          ? 'bg-pink-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">No products found</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - limit))}
                    disabled={skip === 0}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-300 transition"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {Math.floor(skip / limit) + 1}
                  </span>
                  <button
                    onClick={() => setSkip(skip + limit)}
                    disabled={products.length < limit}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-300 transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
