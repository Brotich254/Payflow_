import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateInvoiceNumber } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const status = searchParams.get('status')

    const where: any = { userId: session.user.id }
    if (status) {
      where.status = status
    }

    const invoices = await db.invoice.findMany({
      where,
      include: {
        customer: true,
        items: true,
        payments: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })

    const total = await db.invoice.count({ where })

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        skip,
        take,
        total,
      },
    })
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
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
    const { customerId, description, amount, dueDate, items, notes, terms } =
      body

    if (!customerId || !amount || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify customer belongs to user
    const customer = await db.customer.findFirst({
      where: {
        id: customerId,
        userId: session.user.id,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const invoiceNumber = generateInvoiceNumber()

    const invoice = await db.invoice.create({
      data: {
        userId: session.user.id,
        customerId,
        invoiceNumber,
        description,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        terms,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: invoice,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
