const { PrismaClient } = require('../generated/prisma')

async function main() {
  try {
    console.log('Creating PrismaClient...')
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    console.log('Testing connection...')
    const users = await prisma.user.findMany()
    console.log('Connection successful! Found', users.length, 'users')
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main() 