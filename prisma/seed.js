const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...')

  // Crear usuario de ejemplo
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@ejemplo.com' },
    update: {},
    create: {
      email: 'demo@ejemplo.com',
      password: hashedPassword,
      name: 'Usuario Demo',
    },
  })

  // Libros de ejemplo
  const books = [
    {
      title: 'El Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      status: 'FINISHED',
      totalPages: 863,
      rating: 5,
      review: 'Una obra maestra de la literatura española. Cervantes creó una historia que trasciende el tiempo.',
      startDate: new Date('2024-01-15'),
      finishDate: new Date('2024-02-28'),
      userId: user.id,
    },
    {
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      status: 'READING',
      currentPage: 120,
      totalPages: 471,
      startDate: new Date('2024-06-01'),
      userId: user.id,
    },
    {
      title: 'La sombra del viento',
      author: 'Carlos Ruiz Zafón',
      status: 'WISHLIST',
      totalPages: 576,
      userId: user.id,
    },
    {
      title: '1984',
      author: 'George Orwell',
      status: 'FINISHED',
      totalPages: 328,
      rating: 4,
      review: 'Una distopía fascinante y aterradora. Orwell anticipó muchos aspectos de nuestra sociedad actual.',
      startDate: new Date('2024-03-01'),
      finishDate: new Date('2024-03-15'),
      userId: user.id,
    },
    {
      title: 'El nombre del viento',
      author: 'Patrick Rothfuss',
      status: 'READING',
      currentPage: 45,
      totalPages: 662,
      startDate: new Date('2024-07-01'),
      userId: user.id,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      status: 'FINISHED',
      totalPages: 466,
      rating: 5,
      review: 'Un libro fascinante sobre la historia de la humanidad. Harari presenta ideas complejas de manera accesible.',
      startDate: new Date('2024-04-01'),
      finishDate: new Date('2024-04-20'),
      userId: user.id,
    },
    {
      title: 'El Hobbit',
      author: 'J.R.R. Tolkien',
      status: 'WISHLIST',
      totalPages: 310,
      userId: user.id,
    },
    {
      title: 'Orgullo y prejuicio',
      author: 'Jane Austen',
      status: 'FINISHED',
      totalPages: 432,
      rating: 4,
      review: 'Una novela romántica clásica con personajes memorables y diálogos brillantes.',
      startDate: new Date('2024-05-01'),
      finishDate: new Date('2024-05-18'),
      userId: user.id,
    },
  ]

  for (const book of books) {
    await prisma.book.create({
      data: book,
    })
  }

  console.log('✅ Seeding completado!')
  console.log(`📚 Creados ${books.length} libros para el usuario: ${user.email}`)
  console.log('🔑 Credenciales de acceso:')
  console.log('   Email: demo@ejemplo.com')
  console.log('   Contraseña: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
