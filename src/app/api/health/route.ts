import { NextResponse } from 'next/server'

// GET /api/health
// Lightweight liveness check — no DB queries, just confirms the API layer is responding.
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'GVCS backend is running',
  })
}
