import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES')
}

export function getBookStatusText(status: string) {
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

export function getBookStatusColor(status: string) {
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

export function calculateReadingProgress(currentPage?: number, totalPages?: number) {
  if (!currentPage || !totalPages || totalPages === 0) return 0
  return Math.round((currentPage / totalPages) * 100)
}

export function validateBookData(data: any) {
  const errors: string[] = []
  
  if (!data.title?.trim()) {
    errors.push('El título es requerido')
  }
  
  if (!data.author?.trim()) {
    errors.push('El autor es requerido')
  }
  
  if (data.currentPage && data.totalPages && data.currentPage > data.totalPages) {
    errors.push('La página actual no puede ser mayor al total de páginas')
  }
  
  if (data.rating && (data.rating < 0 || data.rating > 5)) {
    errors.push('La calificación debe estar entre 0 y 5')
  }
  
  return errors
}
