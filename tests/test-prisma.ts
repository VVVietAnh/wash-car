import { PrismaClient } from '@prisma/client'

async function main() {
  console.log('Creating Prisma Client...')
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
  
  try {
    console.log('\nTesting Users:')
    const users = await prisma.user.findMany({
      include: {
        bookings: true
      }
    })
    console.log('Users:', JSON.stringify(users, null, 2))

    console.log('\nTesting Services:')
    const services = await prisma.service.findMany()
    console.log('Services:', JSON.stringify(services, null, 2))

    console.log('\nTesting Bookings:')
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        service: true
      }
    })
    console.log('Bookings:', JSON.stringify(bookings, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 