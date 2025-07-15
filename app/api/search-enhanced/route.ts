import { NextRequest, NextResponse } from "next/server"
import { searchAllSources } from "@/lib/bookServices"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q')
    const type = searchParams.get('type') as 'BOOK' | 'MANGA' | 'ALL' || 'ALL'
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }
    
    const books = await searchAllSources(query, type)
    
    return NextResponse.json({ books })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
