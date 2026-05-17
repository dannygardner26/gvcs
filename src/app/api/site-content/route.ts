import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/site-content
// Returns all site content as a flat key-value object, same shape as the Flask endpoint.
export async function GET() {
  try {
    const content = await prisma.siteContent.findMany()

    const result: Record<string, string> = {}
    for (const item of content) {
      result[item.key] = item.value
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/site-content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/site-content
// Accepts a JSON body of key-value pairs and upserts each one.
// Body: { "hero_title": "New title", "meeting_time": "Fridays at 4 PM" }
export async function PUT(request: NextRequest) {
  try {
    const body: Record<string, string> = await request.json()
    const keys = Object.keys(body)

    await Promise.all(
      keys.map((key) =>
        prisma.siteContent.upsert({
          where: { key },
          update: { value: body[key] },
          create: { key, value: body[key] },
        })
      )
    )

    return NextResponse.json({ message: 'Content updated', updated: keys })
  } catch (error) {
    console.error('PUT /api/site-content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
