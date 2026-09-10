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

    const paidInvoices = await db.invoice.aggregate({
      where: {
        userId: session.user.id,
        status: 'PAID',
      },
      _sum: {
        amount: true,
      },
    })

    const totalInvoices = await db.invoice.aggregate({
      where: {
        userId: session.user.id,
      },
      _sum: {
        amount: true,
      },
    })

    const invoiceCount = await db.invoice.count({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: paidInvoices._sum.amount || 0,
        totalOutstanding: (totalInvoices._sum.amount || 0) - (paidInvoices._sum.amount || 0),
        invoiceCount,
        paidPercentage: invoiceCount > 0
          ? Math.round(
              (await db.invoice.count({
                where: {
                  userId: session.user.id,
                  status: 'PAID',
                },
              }) / invoiceCount) * 100
            )
          : 0,
      },
    })
  } catch (error) {
    console.error('Get revenue error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}
