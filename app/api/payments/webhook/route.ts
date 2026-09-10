import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyWebhookSignature, stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  try {
    const event = verifyWebhookSignature(body, signature)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        const payment = await db.payment.findFirst({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
        })

        if (payment) {
          await db.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              stripeChargeId: paymentIntent.charges.data[0]?.id,
            },
          })

          // Update invoice status
          await db.invoice.update({
            where: { id: payment.invoiceId },
            data: {
              status: 'PAID',
              paidDate: new Date(),
            },
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        const payment = await db.payment.findFirst({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
        })

        if (payment) {
          await db.payment.update({
            where: { id: payment.id },
            data: {
              status: 'FAILED',
            },
          })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as any
        const payment = await db.payment.findFirst({
          where: {
            stripeChargeId: charge.id,
          },
        })

        if (payment) {
          await db.payment.update({
            where: { id: payment.id },
            data: {
              status: 'REFUNDED',
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}
