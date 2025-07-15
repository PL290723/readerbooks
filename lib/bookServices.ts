// Servicios combinados para búsqueda de libros y mangas

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

// Google Books API
export async function searchGoogleBooks(query: string, maxResults: number = 20): Promise<BookSearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=${maxResults}&orderBy=relevance`
    )
    
    if (!response.ok) {
      throw new Error('Error al buscar en Google Books')
    }

    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title || 'Título no disponible',
      authors: item.volumeInfo.authors?.join(', ') || 'Autor desconocido',
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount,
      publishedDate: item.volumeInfo.publishedDate,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      categories: item.volumeInfo.categories,
      type: 'BOOK' as const,
      source: 'GOOGLE' as const
    }))
  } catch (error) {
    console.error('Error searching Google Books:', error)
    return []
  }
}

// Apple Books API (iTunes Search API)
export async function searchAppleBooks(query: string, maxResults: number = 20): Promise<BookSearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodedQuery}&media=ebook&limit=${maxResults}&entity=ebook`
    )
    
    if (!response.ok) {
      throw new Error('Error al buscar en Apple Books')
    }

    const data = await response.json()
    
    if (!data.results) {
      return []
    }

    return data.results.map((item: any) => ({
      id: item.trackId?.toString() || Math.random().toString(),
      title: item.trackName || 'Título no disponible',
      authors: item.artistName || 'Autor desconocido',
      description: item.description,
      pageCount: undefined, // Apple no proporciona conteo de páginas
      publishedDate: item.releaseDate,
      thumbnail: item.artworkUrl100?.replace('100x100', '300x300'),
      categories: item.primaryGenreName ? [item.primaryGenreName] : [],
      type: 'BOOK' as const,
      source: 'APPLE' as const
    }))
  } catch (error) {
    console.error('Error searching Apple Books:', error)
    return []
  }
}

// MyAnimeList API para mangas (usando Jikan API no oficial)
export async function searchMangas(query: string, maxResults: number = 20): Promise<BookSearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://api.jikan.moe/v4/manga?q=${encodedQuery}&limit=${maxResults}&order_by=score&sort=desc`
    )
    
    if (!response.ok) {
      throw new Error('Error al buscar mangas')
    }

    const data = await response.json()
    
    if (!data.data) {
      return []
    }

    return data.data.map((item: any) => ({
      id: item.mal_id?.toString() || Math.random().toString(),
      title: item.title || item.title_english || 'Título no disponible',
      authors: item.authors?.map((author: any) => author.name).join(', ') || 'Autor desconocido',
      description: item.synopsis,
      pageCount: undefined,
      volumeCount: item.volumes,
      publishedDate: item.published?.from,
      thumbnail: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
      categories: item.genres?.map((genre: any) => genre.name) || [],
      type: 'MANGA' as const,
      source: 'MYANIMELIST' as const
    }))
  } catch (error) {
    console.error('Error searching manga:', error)
    return []
  }
}

// Búsqueda combinada
export async function searchAllSources(query: string, type: 'BOOK' | 'MANGA' | 'ALL' = 'ALL'): Promise<BookSearchResult[]> {
  const promises: Promise<BookSearchResult[]>[] = []
  
  if (type === 'BOOK' || type === 'ALL') {
    promises.push(searchGoogleBooks(query, 10))
    promises.push(searchAppleBooks(query, 10))
  }
  
  if (type === 'MANGA' || type === 'ALL') {
    promises.push(searchMangas(query, 10))
  }
  
  try {
    const results = await Promise.allSettled(promises)
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<BookSearchResult[]> => result.status === 'fulfilled')
      .flatMap(result => result.value)
    
    // Eliminar duplicados basados en título y autor
    const uniqueResults = successfulResults.filter((book, index, array) => 
      index === array.findIndex(b => 
        b.title.toLowerCase() === book.title.toLowerCase() && 
        b.authors.toLowerCase() === book.authors.toLowerCase()
      )
    )
    
    // Ordenar por relevancia (tipo coincidente primero)
    return uniqueResults.sort((a, b) => {
      if (type !== 'ALL') {
        return a.type === type ? -1 : b.type === type ? 1 : 0
      }
      return 0
    }).slice(0, 30) // Máximo 30 resultados
  } catch (error) {
    console.error('Error in combined search:', error)
    return []
  }
}
