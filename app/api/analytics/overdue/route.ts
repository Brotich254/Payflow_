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

    const now = new Date()

    const overdueInvoices = await db.invoice.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['SENT', 'VIEWED', 'PARTIALLY_PAID'],
        },
        dueDate: {
          lt: now,
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    const totalOverdue = await db.invoice.aggregate({
      where: {
        userId: session.user.id,
        status: {
          in: ['SENT', 'VIEWED', 'PARTIALLY_PAID'],
        },
        dueDate: {
          lt: now,
        },
      },
      _sum: {
        amount: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        invoices: overdueInvoices,
        total: totalOverdue._sum.amount || 0,
        count: overdueInvoices.length,
      },
    })
  } catch (error) {
    console.error('Get overdue invoices error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overdue invoices' },
      { status: 500 }
    )
  }
}
