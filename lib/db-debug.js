console.log('🔍 Debugging DATABASE_URL:')
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...')
console.log('DIRECT_URL:', process.env.DIRECT_URL?.substring(0, 20) + '...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('VERCEL:', process.env.VERCEL)

// Si no hay DATABASE_URL válida, usar la de Supabase directamente
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
  console.log('⚠️ DATABASE_URL inválida, usando valor hardcoded')
  process.env.DATABASE_URL = 'postgres://postgres.qyvsxrqmtscujvapuowj:IiLwHrBsvJhBh9ix@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'
  process.env.DIRECT_URL = 'postgres://postgres.qyvsxrqmtscujvapuowj:IiLwHrBsvJhBh9ix@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require'
}
