import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoice = await db.invoice.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        customer: true,
        items: true,
        payments: true,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error) {
    console.error('Get invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { description, amount, dueDate, status, notes, terms, items } = body

    // Verify invoice belongs to user
    const invoice = await db.invoice.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Delete old items if new items provided
    if (items) {
      await db.invoiceItem.deleteMany({
        where: { invoiceId: params.id },
      })
    }

    const updatedInvoice = await db.invoice.update({
      where: { id: params.id },
      data: {
        description,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
        notes,
        terms,
        items: items
          ? {
              create: items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        items: true,
        payments: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedInvoice,
    })
  } catch (error) {
    console.error('Update invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify invoice belongs to user
    const invoice = await db.invoice.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    await db.invoice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted',
    })
  } catch (error) {
    console.error('Delete invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
