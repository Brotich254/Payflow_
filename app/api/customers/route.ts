import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isValidEmail } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customers = await db.customer.findMany({
      where: { userId: session.user.id },
      include: {
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: customers,
    })
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, address, taxId } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if customer with same email already exists
    const existingCustomer = await db.customer.findFirst({
      where: {
        userId: session.user.id,
        email,
      },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409 }
      )
    }

    const customer = await db.customer.create({
      data: {
        userId: session.user.id,
        name,
        email,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
