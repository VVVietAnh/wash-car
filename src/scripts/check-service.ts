import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkService(serviceId: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })
    console.log('Service:', service)
  } catch (error) {
    console.error('Error checking service:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Check the service ID from the error log
checkService('cm9w4sg4h0002onw9vf3x8ogw') 