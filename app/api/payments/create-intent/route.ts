import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPaymentIntent } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { invoiceId, amount } = body

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { error: 'Invoice ID and amount are required' },
        { status: 400 }
      )
    }

    // Verify invoice belongs to user
    const invoice = await db.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(amount, 'usd', {
      invoiceId,
      userId: session.user.id,
    })

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        invoiceId,
        amount,
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
      },
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
