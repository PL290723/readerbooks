import { PrismaClient } from '@prisma/client'

// Debug de variables de entorno
console.log('🔍 Prisma Client Init - DATABASE_URL presente:', !!process.env.DATABASE_URL)
console.log('🔍 DATABASE_URL starts with postgres:', process.env.DATABASE_URL?.startsWith('postgres'))

// Forzar variables si no están presentes
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
  console.log('⚠️ Forzando DATABASE_URL de Supabase')
  process.env.DATABASE_URL = 'postgres://postgres.qyvsxrqmtscujvapuowj:IiLwHrBsvJhBh9ix@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'
  process.env.DIRECT_URL = 'postgres://postgres.qyvsxrqmtscujvapuowj:IiLwHrBsvJhBh9ix@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
