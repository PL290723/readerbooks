// Servicio para interactuar con Google Books API
export interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    pageCount?: number
    publishedDate?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    categories?: string[]
    language?: string
    publisher?: string
  }
}

export interface BookSearchResult {
  id: string
  title: string
  authors: string
  description?: string
  pageCount?: number
  publishedDate?: string
  thumbnail?: string
  categories?: string[]
}

class GoogleBooksService {
  private baseUrl = 'https://www.googleapis.com/books/v1/volumes'
  
  async searchBooks(query: string, maxResults: number = 20): Promise<BookSearchResult[]> {
    try {
      const searchQuery = encodeURIComponent(query)
      const url = `${this.baseUrl}?q=${searchQuery}&maxResults=${maxResults}&langRestrict=es,en`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Error al buscar libros')
      }
      
      const data = await response.json()
      
      if (!data.items) {
        return []
      }
      
      return data.items.map((item: GoogleBook) => ({
        id: item.id,
        title: item.volumeInfo.title || 'Título no disponible',
        authors: item.volumeInfo.authors?.join(', ') || 'Autor desconocido',
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
        publishedDate: item.volumeInfo.publishedDate,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        categories: item.volumeInfo.categories
      }))
    } catch (error) {
      console.error('Error searching books:', error)
      return []
    }
  }
  
  async getBookById(bookId: string): Promise<BookSearchResult | null> {
    try {
      const url = `${this.baseUrl}/${bookId}`
      const response = await fetch(url)
      
      if (!response.ok) {
        return null
      }
      
      const item: GoogleBook = await response.json()
      
      return {
        id: item.id,
        title: item.volumeInfo.title || 'Título no disponible',
        authors: item.volumeInfo.authors?.join(', ') || 'Autor desconocido',
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
        publishedDate: item.volumeInfo.publishedDate,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        categories: item.volumeInfo.categories
      }
    } catch (error) {
      console.error('Error getting book:', error)
      return null
    }
  }
  
  async searchByAuthor(author: string, maxResults: number = 20): Promise<BookSearchResult[]> {
    return this.searchBooks(`inauthor:"${author}"`, maxResults)
  }
  
  async searchByTitle(title: string, maxResults: number = 20): Promise<BookSearchResult[]> {
    return this.searchBooks(`intitle:"${title}"`, maxResults)
  }
  
  async getPopularBooks(category?: string): Promise<BookSearchResult[]> {
    const query = category ? `subject:${category}` : 'bestseller'
    return this.searchBooks(query, 40)
  }
}

export const googleBooksService = new GoogleBooksService()
