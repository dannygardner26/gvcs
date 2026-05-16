import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/site-content/[key]
// Returns a single content entry by key.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const item = await prisma.siteContent.findUnique({ where: { key } })

    if (!item) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({
      key: item.key,
      value: item.value,
      type: item.contentType,
      updatedAt: item.updatedAt,
    })
  } catch (error) {
    console.error('GET /api/site-content/[key] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
