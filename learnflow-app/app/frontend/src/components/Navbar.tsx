'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { auth } from '@/lib/auth'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const { itemCount } = useCartStore()
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const currentUser = auth.getUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    auth.logout()
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-serif font-bold text-pink-600">
              Fatima Zehra Boutique
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-pink-600 transition">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition">
              About
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <button className="text-2xl">🛒</button>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-pink-600 transition text-sm font-medium"
                >
                  👤 {user.full_name?.split(' ')[0] || user.email.split('@')[0]}
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                    <div className="px-4 py-2 border-b text-sm text-gray-600">
                      {user.email}
                    </div>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                      👤 My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                      📦 My Orders
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-pink-600 transition">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
