'use client'

import { useState, useEffect } from 'react'
import { X, Star, Globe, BookOpen } from 'lucide-react'
import { toast } from 'react-hot-toast'
import EnhancedBookSearch from './EnhancedBookSearch'

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

interface BookFormProps {
  book?: Book | null
  onClose: () => void
  onSave: (book: Book) => void
}

interface BookFormProps {
  book?: Book | null
  onClose: () => void
  onSave: (book: Book) => void
}

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

export default function BookForm({ book, onClose, onSave }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'READING' as 'READING' | 'FINISHED' | 'WISHLIST',
    type: 'BOOK' as 'BOOK' | 'MANGA',
    currentPage: '',
    totalPages: '',
    currentVolume: '',
    totalVolumes: '',
    rating: 0,
    review: '',
    startDate: '',
    finishDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        status: book.status as 'READING' | 'FINISHED' | 'WISHLIST',
        type: (book as any).type || 'BOOK',
        currentPage: book.currentPage?.toString() || '',
        totalPages: book.totalPages?.toString() || '',
        currentVolume: (book as any).currentVolume?.toString() || '',
        totalVolumes: (book as any).totalVolumes?.toString() || '',
        rating: book.rating || 0,
        review: book.review || '',
        startDate: book.startDate ? book.startDate.split('T')[0] : '',
        finishDate: book.finishDate ? book.finishDate.split('T')[0] : '',
      })
    }
  }, [book])

  const handleBookSelect = (selectedBook: BookSearchResult) => {
    setFormData(prev => ({
      ...prev,
      title: selectedBook.title,
      author: selectedBook.authors,
      type: selectedBook.type,
      totalPages: selectedBook.pageCount?.toString() || '',
      totalVolumes: selectedBook.volumeCount?.toString() || '',
    }))
    setShowGlobalSearch(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.title || !formData.author) {
      toast.error('Título y autor son requeridos')
      setLoading(false)
      return
    }

    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        status: formData.status,
        type: formData.type,
        currentPage: formData.currentPage ? parseInt(formData.currentPage) : null,
        totalPages: formData.totalPages ? parseInt(formData.totalPages) : null,
        currentVolume: formData.currentVolume ? parseInt(formData.currentVolume) : null,
        totalVolumes: formData.totalVolumes ? parseInt(formData.totalVolumes) : null,
        rating: formData.rating || null,
        review: formData.review || null,
        startDate: formData.startDate || null,
        finishDate: formData.finishDate || null,
      }

      const url = book ? `/api/books/${book.id}` : '/api/books'
      const method = book ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const savedBook = await response.json()
        onSave(savedBook)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al guardar el libro')
      }
    } catch (error) {
      toast.error('Error al guardar el libro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {book ? 'Editar libro' : 'Agregar nuevo libro'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="flex-1 block w-full border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGlobalSearch(true)}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors"
                  title="Buscar en biblioteca global"
                >
                  🌍
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Autor *
              </label>
              <input
                type="text"
                name="author"
                id="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Tipo de contenido */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo de contenido
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white"
            >
              <option value="BOOK">📚 Libro</option>
              <option value="MANGA">🎌 Manga</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white"
            >
              <option value="READING">Leyendo</option>
              <option value="FINISHED">Terminado</option>
              <option value="WISHLIST">Lista de deseos</option>
            </select>
          </div>

          {formData.status === 'READING' && (
            <div className="space-y-4">
              {/* Páginas */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700">
                    Página actual
                  </label>
                  <input
                    type="number"
                    name="currentPage"
                    id="currentPage"
                    min="0"
                    value={formData.currentPage}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700">
                    Total de páginas
                  </label>
                  <input
                    type="number"
                    name="totalPages"
                    id="totalPages"
                    min="1"
                    value={formData.totalPages}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>
              
              {/* Volúmenes para mangas */}
              {formData.type === 'MANGA' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="currentVolume" className="block text-sm font-medium text-gray-700">
                      Volumen actual
                    </label>
                    <input
                      type="number"
                      name="currentVolume"
                      id="currentVolume"
                      min="0"
                      value={formData.currentVolume}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="totalVolumes" className="block text-sm font-medium text-gray-700">
                      Total de volúmenes
                    </label>
                    <input
                      type="number"
                      name="totalVolumes"
                      id="totalVolumes"
                      min="1"
                      value={formData.totalVolumes}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {formData.status === 'FINISHED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">
              Reseña
            </label>
            <textarea
              name="review"
              id="review"
              rows={3}
              value={formData.review}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white placeholder-gray-500"
              placeholder="Escribe tu reseña del libro..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white"
              />
            </div>
            {formData.status === 'FINISHED' && (
              <div>
                <label htmlFor="finishDate" className="block text-sm font-medium text-gray-700">
                  Fecha de finalización
                </label>
                <input
                  type="date"
                  name="finishDate"
                  id="finishDate"
                  value={formData.finishDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border text-gray-900 bg-white"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : book ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>

      {showGlobalSearch && (
        <EnhancedBookSearch
          onBookSelect={handleBookSelect}
          onClose={() => setShowGlobalSearch(false)}
        />
      )}
    </div>
  )
}
