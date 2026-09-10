import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pendingInvoices = await db.invoice.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['SENT', 'VIEWED'],
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    const totalPending = await db.invoice.aggregate({
      where: {
        userId: session.user.id,
        status: {
          in: ['SENT', 'VIEWED'],
        },
      },
      _sum: {
        amount: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        invoices: pendingInvoices,
        total: totalPending._sum.amount || 0,
        count: pendingInvoices.length,
      },
    })
  } catch (error) {
    console.error('Get pending invoices error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending invoices' },
      { status: 500 }
    )
  }
}
