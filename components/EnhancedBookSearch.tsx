'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Book, Plus, Loader2, Globe, BookOpen, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BookSearchResult {
  id: string
  title: string
  authors: string
  description?: string
  pageCount?: number
  volumeCount?: number
  publishedDate?: string
  thumbnail?: string
  categories?: string[]
  type: 'BOOK' | 'MANGA'
  source: 'GOOGLE' | 'APPLE' | 'MYANIMELIST'
}

interface EnhancedBookSearchProps {
  onBookSelect: (book: BookSearchResult) => void
  onClose: () => void
}

export default function EnhancedBookSearch({ onBookSelect, onClose }: EnhancedBookSearchProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'ALL' | 'BOOK' | 'MANGA'>('ALL')
  const [results, setResults] = useState<BookSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Por favor ingresa un término de búsqueda')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const searchParams = new URLSearchParams({
        q: query.trim(),
        type: searchType
      })
      
      const response = await fetch(`/api/search-enhanced?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }
      
      const data = await response.json()
      setResults(data.books || [])
      
      if (data.books?.length === 0) {
        setError('No se encontraron resultados. Intenta con otros términos.')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Error al realizar la búsqueda. Inténtalo de nuevo.')
      toast.error('Error al buscar')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSelectBook = (book: BookSearchResult) => {
    onBookSelect(book)
    toast.success(`${book.type === 'MANGA' ? 'Manga' : 'Libro'} seleccionado: ${book.title}`)
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'GOOGLE': return '📚'
      case 'APPLE': return '🍎'
      case 'MYANIMELIST': return '🎌'
      default: return '📖'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'MANGA' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
  }

  const formatDescription = (description?: string) => {
    if (!description) return 'Sin descripción disponible'
    return description.length > 150 ? description.substring(0, 150) + '...' : description
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-600" />
              Biblioteca Global
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search Controls */}
          <div className="space-y-4">
            {/* Type Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType('ALL')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  searchType === 'ALL' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setSearchType('BOOK')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  searchType === 'BOOK' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Libros
              </button>
              <button
                onClick={() => setSearchType('MANGA')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  searchType === 'MANGA' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-sm">🎌</span>
                Mangas
              </button>
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Buscar ${searchType === 'ALL' ? 'libros y mangas' : searchType === 'BOOK' ? 'libros' : 'mangas'}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="text-center py-8">
              <p className="text-gray-500">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-500 mt-2">Buscando en bibliotecas globales...</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-8">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Realiza una búsqueda para ver resultados</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-4">
              {results.map((book) => (
                <div
                  key={`${book.source}-${book.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {book.thumbnail ? (
                        <img
                          src={book.thumbnail}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-md shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                          {book.type === 'MANGA' ? '🎌' : '📚'}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {book.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(book.type)}`}>
                            {book.type}
                          </span>
                          <span className="text-lg" title={`Fuente: ${book.source}`}>
                            {getSourceIcon(book.source)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Autor:</strong> {book.authors}
                      </p>
                      
                      {book.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDescription(book.description)}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        {book.publishedDate && (
                          <span>📅 {new Date(book.publishedDate).getFullYear()}</span>
                        )}
                        {book.pageCount && (
                          <span>📄 {book.pageCount} páginas</span>
                        )}
                        {book.volumeCount && (
                          <span>📚 {book.volumeCount} volúmenes</span>
                        )}
                        {book.categories && book.categories.length > 0 && (
                          <span>🏷️ {book.categories[0]}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectBook(book)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Seleccionar {book.type === 'MANGA' ? 'Manga' : 'Libro'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
