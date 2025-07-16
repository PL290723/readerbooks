const fs = require('fs')
const path = require('path')

// Detectar si estamos en producción (Vercel) o desarrollo
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production'
const hasPostgresUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')

let schemaContent = `// Auto-generated schema based on environment
generator client {
  provider = "prisma-client-js"
}

datasource db {`

if (isProduction && hasPostgresUrl) {
  // Usar PostgreSQL en producción
  schemaContent += `
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")`
} else {
  // Usar SQLite en desarrollo o cuando no hay PostgreSQL
  schemaContent += `
  provider = "sqlite"
  url      = env("DATABASE_URL")`
}

schemaContent += `
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  books    Book[]
  accounts Account[]
  sessions Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}

model Book {
  id            String    @id @default(cuid())
  title         String
  author        String
  status        String    @default("READING") // READING, FINISHED, WISHLIST
  type          String    @default("BOOK")    // BOOK, MANGA
  currentPage   Int?
  totalPages    Int?
  currentVolume Int?
  totalVolumes  Int?
  rating        Int?
  review        String?
  startDate     DateTime?
  finishDate    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  userId        String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("books")
}
`

// Escribir el schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
fs.writeFileSync(schemaPath, schemaContent)

console.log(`📦 Schema configurado para: ${isProduction && hasPostgresUrl ? 'PostgreSQL (Producción)' : 'SQLite (Desarrollo)'}`)
