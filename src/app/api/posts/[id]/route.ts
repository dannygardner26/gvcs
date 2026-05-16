import { NextRequest, NextResponse } from 'next/server'
import { PostType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

// GET /api/posts/[id]
// Returns a single post with author name, or 404 if not found.
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/posts/[id]
// Updates any combination of fields on an existing post.
// Body: { title?, content?, postType?, eventDate? }
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, content, postType, eventDate } = body

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(postType !== undefined && { postType: postType as PostType }),
        ...(eventDate !== undefined && { eventDate: eventDate ? new Date(eventDate) : null }),
      },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/posts/[id]
// Deletes a post by id, or 404 if it doesn't exist.
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.post.delete({ where: { id } })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
