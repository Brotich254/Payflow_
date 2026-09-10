import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
) {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    })
    return intent
  } catch (error) {
    throw new Error(`Failed to create payment intent: ${error}`)
  }
}

export async function retrievePaymentIntent(intentId: string) {
  try {
    const intent = await stripe.paymentIntents.retrieve(intentId)
    return intent
  } catch (error) {
    throw new Error(`Failed to retrieve payment intent: ${error}`)
  }
}

export async function verifyWebhookSignature(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
    return event
  } catch (error) {
    throw new Error(`Webhook verification failed: ${error}`)
  }
}
