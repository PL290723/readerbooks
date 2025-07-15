'use client'

import { BookOpen, TrendingUp, Calendar, Star } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  status: string
  currentPage?: number
  totalPages?: number
  rating?: number
  review?: string
  startDate?: string
  finishDate?: string
  createdAt: string
  updatedAt: string
}

interface StatisticsProps {
  books: Book[]
}

export default function Statistics({ books }: StatisticsProps) {
  const stats = {
    total: books.length,
    reading: books.filter(book => book.status === 'READING').length,
    finished: books.filter(book => book.status === 'FINISHED').length,
    wishlist: books.filter(book => book.status === 'WISHLIST').length,
    averageRating: books.filter(book => book.rating).reduce((acc, book) => acc + (book.rating || 0), 0) / books.filter(book => book.rating).length || 0,
    totalPages: books.filter(book => book.totalPages).reduce((acc, book) => acc + (book.totalPages || 0), 0),
    currentProgress: books.filter(book => book.status === 'READING' && book.currentPage && book.totalPages).reduce((acc, book) => {
      const progress = (book.currentPage || 0) / (book.totalPages || 1)
      return acc + progress
    }, 0)
  }

  const getThisYearBooks = () => {
    const currentYear = new Date().getFullYear()
    return books.filter(book => {
      if (!book.finishDate) return false
      return new Date(book.finishDate).getFullYear() === currentYear
    }).length
  }

  const getThisMonthBooks = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return books.filter(book => {
      if (!book.finishDate) return false
      const finishDate = new Date(book.finishDate)
      return finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear
    }).length
  }

  const statCards = [
    {
      title: 'Total de libros',
      value: stats.total.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Leyendo actualmente',
      value: stats.reading.toString(),
      icon: BookOpen,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Libros terminados',
      value: stats.finished.toString(),
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Lista de deseos',
      value: stats.wishlist.toString(),
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Terminados este año',
      value: getThisYearBooks().toString(),
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Terminados este mes',
      value: getThisMonthBooks().toString(),
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Calificación promedio',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total de páginas',
      value: stats.totalPages.toString(),
      icon: BookOpen,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
