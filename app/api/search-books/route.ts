import { NextRequest, NextResponse } from "next/server"
import { googleBooksService } from "@/lib/googleBooks"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'general'
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }
    
    let books = []
    
    switch (type) {
      case 'author':
        books = await googleBooksService.searchByAuthor(query, limit)
        break
      case 'title':
        books = await googleBooksService.searchByTitle(query, limit)
        break
      case 'popular':
        books = await googleBooksService.getPopularBooks(query)
        break
      default:
        books = await googleBooksService.searchBooks(query, limit)
    }
    
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error searching books:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
