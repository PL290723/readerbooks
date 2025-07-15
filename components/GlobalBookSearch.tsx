'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Book, Plus, Loader2, Globe } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BookSearchResult {
  id: string
  title: string
  authors: string
  description?: string
  pageCount?: number
  publishedDate?: string
  thumbnail?: string
  categories?: string[]
}

interface GlobalBookSearchProps {
  onBookSelect: (book: BookSearchResult) => void
  onClose: () => void
}

export default function GlobalBookSearch({ onBookSelect, onClose }: GlobalBookSearchProps) {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<BookSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'general' | 'title' | 'author'>('general')
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const searchBooks = async (searchQuery: string, type: string = 'general') => {
    if (!searchQuery.trim()) {
      setBooks([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search-books?q=${encodeURIComponent(searchQuery)}&type=${type}&limit=30`)
      
      if (response.ok) {
        const results = await response.json()
        setBooks(results)
      } else {
        toast.error('Error al buscar libros')
        setBooks([])
      }
    } catch (error) {
      toast.error('Error al buscar libros')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const loadPopularBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/search-books?q=fiction&type=popular&limit=30')
      if (response.ok) {
        const results = await response.json()
        setBooks(results)
      }
    } catch (error) {
      console.error('Error loading popular books:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Cargar libros populares al inicio
    loadPopularBooks()
  }, [])

  useEffect(() => {
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        searchBooks(query, searchType)
      } else {
        loadPopularBooks()
      }
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, searchType])

  const handleBookSelect = (book: BookSearchResult) => {
    onBookSelect(book)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Buscar Libros en el Mundo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Search Controls */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar por título, autor o palabra clave..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">Búsqueda general</option>
              <option value="title">Por título</option>
              <option value="author">Por autor</option>
            </select>
          </div>
          
          {!query && (
            <p className="text-sm text-gray-600 flex items-center">
              <Book className="h-4 w-4 mr-1" />
              Mostrando libros populares. Escribe para buscar libros específicos.
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Buscando libros...</span>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!loading && books.length === 0 && query && (
            <div className="text-center py-8">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No se encontraron libros con "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">Prueba con otros términos de búsqueda</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleBookSelect(book)}
              >
                <div className="flex space-x-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <Book className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {book.authors}
                    </p>
                    
                    {book.publishedDate && (
                      <p className="text-xs text-gray-500">
                        Publicado: {new Date(book.publishedDate).getFullYear()}
                      </p>
                    )}
                    
                    {book.pageCount && (
                      <p className="text-xs text-gray-500">
                        {book.pageCount} páginas
                      </p>
                    )}
                    
                    {book.categories && book.categories.length > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {book.categories[0]}
                        </span>
                      </div>
                    )}
                    
                    {book.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {book.description.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                  
                  {/* Add Button */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="bg-blue-100 hover:bg-blue-200 rounded-full p-2 transition-colors">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Datos proporcionados por Google Books API. Selecciona un libro para agregarlo a tu biblioteca.
          </p>
        </div>
      </div>
    </div>
  )
}
