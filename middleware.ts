import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Permitir todas las rutas API sin restricciones
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Permitir páginas de autenticación
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }
  
  // Permitir la página principal
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }
  
  // Para otras rutas, continuar normalmente (se manejará por NextAuth en las páginas)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
