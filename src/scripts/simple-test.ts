import { PrismaClient } from '../generated/prisma'

async function main() {
  console.log('Creating Prisma Client...')
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
  
  console.log('Testing connection...')
  try {
    const result = await prisma.$queryRaw`SELECT 1`
    console.log('Connection successful!', result)
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 