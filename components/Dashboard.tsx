'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Plus, LogOut, Search, Filter } from 'lucide-react'
import BookCard from './BookCard'
import BookForm from './BookForm'
import Header from './Header'
import Statistics from './Statistics'

interface Book {
  id: string
  title: string
  author: string
  status: 'READING' | 'FINISHED' | 'WISHLIST'
  currentPage?: number
  totalPages?: number
  rating?: number
  review?: string
  startDate?: string
  finishDate?: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books')
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        toast.error('Error al cargar los libros')
      }
    } catch (error) {
      toast.error('Error al cargar los libros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = books

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => book.status === statusFilter)
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, statusFilter])

  const handleCreateBook = (newBook: Book) => {
    setBooks([newBook, ...books])
    setShowForm(false)
    toast.success('Libro agregado exitosamente')
  }

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(books.map(book => book.id === updatedBook.id ? updatedBook : book))
    setEditingBook(null)
    toast.success('Libro actualizado exitosamente')
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBooks(books.filter(book => book.id !== bookId))
        toast.success('Libro eliminado exitosamente')
      } else {
        toast.error('Error al eliminar el libro')
      }
    } catch (error) {
      toast.error('Error al eliminar el libro')
    }
  }

  const getStatusStats = () => {
    const reading = books.filter(book => book.status === 'READING').length
    const finished = books.filter(book => book.status === 'FINISHED').length
    const wishlist = books.filter(book => book.status === 'WISHLIST').length
    return { reading, finished, wishlist, total: books.length }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <Statistics books={books} />

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                    placeholder="Buscar por título o autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="READING">Leyendo</option>
                    <option value="FINISHED">Terminados</option>
                    <option value="WISHLIST">Lista de deseos</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Agregar libro
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <Plus className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {books.length === 0 ? 'No tienes libros todavía' : 'No se encontraron libros'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {books.length === 0 
                ? 'Comienza agregando tu primer libro a la biblioteca.'
                : 'Intenta cambiar los filtros de búsqueda.'
              }
            </p>
            {books.length === 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Agregar tu primer libro
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={setEditingBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>

      {/* Book Form Modal */}
      {(showForm || editingBook) && (
        <BookForm
          book={editingBook}
          onClose={() => {
            setShowForm(false)
            setEditingBook(null)
          }}
          onSave={editingBook ? handleUpdateBook : handleCreateBook}
        />
      )}
    </div>
  )
}
