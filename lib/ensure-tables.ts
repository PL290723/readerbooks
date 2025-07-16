import { prisma } from './prisma'

export async function ensureTablesExist() {
  try {
    // Verificar si la tabla users existe
    await prisma.user.findFirst()
    console.log('✅ Tablas ya existen')
    return true
  } catch (error: any) {
    if (error.code === 'P2021') {
      console.log('⚠️ Tablas no existen, creando...')
      try {
        // Crear tablas usando SQL directo
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT PRIMARY KEY,
            "name" TEXT,
            "email" TEXT UNIQUE NOT NULL,
            "emailVerified" TIMESTAMP,
            "image" TEXT,
            "password" TEXT,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "accounts" (
            "id" TEXT PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "provider" TEXT NOT NULL,
            "providerAccountId" TEXT NOT NULL,
            "refresh_token" TEXT,
            "access_token" TEXT,
            "expires_at" INTEGER,
            "token_type" TEXT,
            "scope" TEXT,
            "id_token" TEXT,
            "session_state" TEXT,
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
            UNIQUE("provider", "providerAccountId")
          );
        `
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "sessions" (
            "id" TEXT PRIMARY KEY,
            "sessionToken" TEXT UNIQUE NOT NULL,
            "userId" TEXT NOT NULL,
            "expires" TIMESTAMP NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
          );
        `
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "verificationtokens" (
            "identifier" TEXT NOT NULL,
            "token" TEXT UNIQUE NOT NULL,
            "expires" TIMESTAMP NOT NULL,
            UNIQUE("identifier", "token")
          );
        `
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "books" (
            "id" TEXT PRIMARY KEY,
            "title" TEXT NOT NULL,
            "author" TEXT NOT NULL,
            "status" TEXT DEFAULT 'READING',
            "type" TEXT DEFAULT 'BOOK',
            "currentPage" INTEGER,
            "totalPages" INTEGER,
            "currentVolume" INTEGER,
            "totalVolumes" INTEGER,
            "rating" INTEGER,
            "review" TEXT,
            "startDate" TIMESTAMP,
            "finishDate" TIMESTAMP,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "userId" TEXT NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
          );
        `
        
        console.log('✅ Tablas creadas exitosamente')
        return true
      } catch (createError) {
        console.error('❌ Error creando tablas:', createError)
        return false
      }
    } else {
      console.error('❌ Error verificando tablas:', error)
      return false
    }
  }
}
