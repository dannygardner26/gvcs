import { NextRequest, NextResponse } from 'next/server'
import { PostType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// GET /api/posts
// Returns all posts newest-first. Optional ?type=MEETING|EVENT|VOLUNTEER filter.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const type = searchParams.get('type')

    const posts = await prisma.post.findMany({
      where: type ? { postType: type as PostType } : undefined,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/posts
// Creates a new post. Uses the admin user as author until Phase 2 auth is added.
// Body: { title, content, postType, eventDate? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, postType, eventDate } = body

    if (!title || !content || !postType) {
      return NextResponse.json(
        { error: 'title, content, and postType are required' },
        { status: 400 }
      )
    }

    const admin = await prisma.user.findUnique({
      where: { email: 'gvcs.gvsd@gmail.com' },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin user not found — run the seed script first' },
        { status: 500 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        postType: postType as PostType,
        eventDate: eventDate ? new Date(eventDate) : null,
        authorId: admin.id,
      },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
