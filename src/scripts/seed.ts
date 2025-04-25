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
  
  try {
    // Xóa dữ liệu cũ
    console.log('Cleaning old data...')
    await prisma.booking.deleteMany()
    await prisma.service.deleteMany()
    await prisma.user.deleteMany()
    await prisma.timeSlot.deleteMany()

    // Tạo services
    console.log('Creating services...')
    const services = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Rửa xe cơ bản',
          description: 'Rửa xe ngoài, hút bụi trong xe',
          price: 100000,
          duration: 30,
        }
      }),
      prisma.service.create({
        data: {
          name: 'Rửa xe cao cấp',
          description: 'Rửa xe ngoài, hút bụi, vệ sinh nội thất',
          price: 200000,
          duration: 60,
        }
      }),
      prisma.service.create({
        data: {
          name: 'Đánh bóng xe',
          description: 'Đánh bóng toàn bộ xe, phục hồi lớp sơn',
          price: 500000,
          duration: 120,
        }
      })
    ])
    console.log('Created services:', services)

    // Tạo users
    console.log('\nCreating users...')
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'user1@example.com',
          name: 'Nguyễn Văn A',
          phone: '0123456789'
        }
      }),
      prisma.user.create({
        data: {
          email: 'user2@example.com',
          name: 'Trần Thị B',
          phone: '0987654321'
        }
      })
    ])
    console.log('Created users:', users)

    // Tạo time slots
    console.log('\nCreating time slots...')
    const timeSlots = await Promise.all([
      prisma.timeSlot.create({
        data: {
          startTime: '09:00',
          endTime: '10:00',
          maxCapacity: 2,
        }
      }),
      prisma.timeSlot.create({
        data: {
          startTime: '10:00',
          endTime: '11:00',
          maxCapacity: 2,
        }
      }),
      prisma.timeSlot.create({
        data: {
          startTime: '14:00',
          endTime: '15:00',
          maxCapacity: 2,
        }
      })
    ])
    console.log('Created time slots:', timeSlots)

    // Tạo bookings
    console.log('\nCreating bookings...')
    const bookings = await Promise.all([
      prisma.booking.create({
        data: {
          userId: users[0].id,
          serviceId: services[0].id,
          bookingDate: new Date('2024-04-26'),
          timeSlot: '09:00-10:00',
          status: 'CONFIRMED'
        }
      }),
      prisma.booking.create({
        data: {
          userId: users[1].id,
          serviceId: services[1].id,
          bookingDate: new Date('2024-04-27'),
          timeSlot: '14:00-15:00',
          status: 'PENDING'
        }
      })
    ])
    console.log('Created bookings:', bookings)

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