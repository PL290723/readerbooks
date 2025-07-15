'use client'

import { Star, Edit, Trash2, Calendar, BookOpen } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  status: 'READING' | 'FINISHED' | 'WISHLIST'
  type?: 'BOOK' | 'MANGA'
  currentPage?: number
  totalPages?: number
  currentVolume?: number
  totalVolumes?: number
  rating?: number
  review?: string
  startDate?: string
  finishDate?: string
  createdAt: string
  updatedAt: string
}

interface BookCardProps {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (bookId: string) => void
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FINISHED':
        return 'bg-green-100 text-green-800'
      case 'WISHLIST':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'READING':
        return 'Leyendo'
      case 'FINISHED':
        return 'Terminado'
      case 'WISHLIST':
        return 'Lista de deseos'
      default:
        return status
    }
  }

  const getProgressPercentage = () => {
    if (!book.currentPage || !book.totalPages) return 0
    return Math.round((book.currentPage / book.totalPages) * 100)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {book.title}
              </h3>
              <span className="text-lg" title={book.type === 'MANGA' ? 'Manga' : 'Libro'}>
                {book.type === 'MANGA' ? '🎌' : '📚'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                book.status
              )}`}
            >
              {getStatusText(book.status)}
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(book)}
              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar for reading books */}
        {book.status === 'READING' && book.currentPage && book.totalPages && (
          <div className="mb-4 space-y-2">
            {/* Page Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  Página {book.currentPage} de {book.totalPages}
                </span>
                <span className="text-xs text-gray-600">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
            
            {/* Volume Progress for Manga */}
            {book.type === 'MANGA' && book.currentVolume && book.totalVolumes && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">
                    Volumen {book.currentVolume} de {book.totalVolumes}
                  </span>
                  <span className="text-xs text-gray-600">
                    {Math.round((book.currentVolume / book.totalVolumes) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(book.currentVolume / book.totalVolumes) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        {book.rating && renderStars(book.rating)}

        {/* Review snippet */}
        {book.review && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-3">
              "{book.review}"
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {book.startDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Inicio: {formatDate(book.startDate)}</span>
              </div>
            )}
            {book.finishDate && (
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>Fin: {formatDate(book.finishDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}