import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const book = await prisma.book.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error al obtener libro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    const book = await prisma.book.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        finishDate: data.finishDate ? new Date(data.finishDate) : undefined,
      }
    })

    if (book.count === 0) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    const updatedBook = await prisma.book.findUnique({
      where: { id: params.id }
    })

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Error al actualizar libro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const deletedBook = await prisma.book.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (deletedBook.count === 0) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Libro eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar libro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
