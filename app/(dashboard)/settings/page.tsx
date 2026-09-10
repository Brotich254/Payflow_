'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your account and preferences</p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Profile Settings */}
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={session?.user?.name || ''}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={session?.user?.email || ''}
                  disabled
                  className="input bg-gray-50"
                />
              </div>

              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save Changes
              </button>
              {saved && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  ✓ Changes saved successfully
                </div>
              )}
            </div>
          </div>

          {/* Payment Settings */}
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Account
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  📝 Connect your Stripe account to accept payments
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Invoice Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Auto-send payment reminders</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Send overdue notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Settings Menu</h3>
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                Security
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                Integrations
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                Billing
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
