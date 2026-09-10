import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
      <nav className="border-b border-blue-400 bg-blue-600/50 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-white">PayFlow</div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-white hover:text-blue-100 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Invoicing Made Simple
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create, send, and manage invoices with powerful payment tracking.
            Get paid faster with PayFlow.
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="py-16 grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white border border-white/20">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-3">Create Invoices</h3>
            <p className="text-blue-100">
              Create professional invoices in seconds with customizable templates
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white border border-white/20">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-3">Accept Payments</h3>
            <p className="text-blue-100">
              Get paid via card, bank transfer, or check with Stripe integration
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white border border-white/20">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Track Everything</h3>
            <p className="text-blue-100">
              Real-time analytics on revenue, pending invoices, and overdue payments
            </p>
          </div>
        </section>

        <section className="py-16 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-8 text-white text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Trusted by Businesses</h2>
          <p className="text-blue-100 mb-8">
            From freelancers to agencies, thousands use PayFlow to manage their invoices
          </p>
        </section>
      </main>

      <footer className="border-t border-blue-400 bg-blue-600/50 backdrop-blur-md py-8 text-center text-blue-100">
        <p>&copy; 2024 PayFlow. All rights reserved.</p>
      </footer>
    </div>
  )
}
