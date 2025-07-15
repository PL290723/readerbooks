import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const books = await prisma.book.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error al obtener libros:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const {
      title,
      author,
      status,
      type,
      currentPage,
      totalPages,
      currentVolume,
      totalVolumes,
      rating,
      review,
      startDate,
      finishDate
    } = await request.json()

    if (!title || !author) {
      return NextResponse.json(
        { error: "Título y autor son requeridos" },
        { status: 400 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        status: status || "READING",
        type: type || "BOOK",
        currentPage,
        totalPages,
        currentVolume,
        totalVolumes,
        rating,
        review,
        startDate: startDate ? new Date(startDate) : null,
        finishDate: finishDate ? new Date(finishDate) : null,
        userId: session.user.id
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error al crear libro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
