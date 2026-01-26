'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { userAPI } from '@/lib/api'
import { auth, User } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.isAuthenticated()) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await userAPI.getProfile()
        const userData = response.data
        setUser(userData)
        setFormData({
          full_name: userData.full_name || '',
          phone: userData.phone || '',
          address: userData.address || '',
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await userAPI.updateProfile(formData)
      const updatedUser = response.data
      setUser(updatedUser)
      auth.setUser(updatedUser)
      setEditing(false)
      setMessage('✓ Profile updated successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage('✗ Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Failed to load profile</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">My Profile</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.startsWith('✓')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          {!editing ? (
            <div className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Email
                </label>
                <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded">
                  {user.email}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Full Name
                </label>
                <p className="text-lg text-gray-900">
                  {user.full_name || 'Not provided'}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Phone
                </label>
                <p className="text-lg text-gray-900">
                  {user.phone || 'Not provided'}
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Address
                </label>
                <p className="text-lg text-gray-900 whitespace-pre-wrap">
                  {user.address || 'Not provided'}
                </p>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Member Since
                </label>
                <p className="text-lg text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Account Status
                </label>
                <p className="text-lg text-gray-900">
                  {user.is_active ? (
                    <span className="text-green-600 font-semibold">✓ Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">✗ Inactive</span>
                  )}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition mt-8"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Enter your address"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 transition"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
