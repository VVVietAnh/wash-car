import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listServices() {
  try {
    const services = await prisma.service.findMany()
    console.log('Services:', services)
  } catch (error) {
    console.error('Error listing services:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listServices() 