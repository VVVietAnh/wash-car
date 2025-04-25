import { PrismaClient } from '@prisma/client'

async function testServices() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  try {
    console.log('Testing services in database...')

    // Kiểm tra tất cả services
    console.log('Fetching all services...')
    const services = await prisma.service.findMany()
    console.log('\nAll services:', JSON.stringify(services, null, 2))

    if (services.length === 0) {
      console.log('\nNo services found in database. Please run `npm run seed` first.')
      return
    }

    // Thử tạo một booking với service ID không tồn tại
    console.log('\nTesting booking creation with non-existent service ID...')
    try {
      const booking = await prisma.booking.create({
        data: {
          userId: 'test-user',
          serviceId: 'non-existent-service',
          bookingDate: new Date(),
          timeSlot: '09:00',
          status: 'PENDING'
        }
      })
      console.log('Booking created (unexpected):', booking)
    } catch (e) {
      const error = e as Error
      console.log('Expected error occurred:', error.message)
    }

    // Thử tạo một booking với service ID hợp lệ
    console.log('\nTesting booking creation with valid service ID...')
    try {
      const booking = await prisma.booking.create({
        data: {
          userId: 'test-user',
          serviceId: services[0].id,
          bookingDate: new Date('2024-04-25'),
          timeSlot: '10:00',
          status: 'PENDING'
        },
        include: {
          service: true,
          user: true
        }
      })
      console.log('Booking created:', JSON.stringify(booking, null, 2))
    } catch (e) {
      const error = e as Error
      console.error('Error creating booking with valid service:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testServices().catch(console.error) 