import { PrismaClient } from '@prisma/client'

async function testQueries() {
  try {
    console.log('Creating PrismaClient...')
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    // Test 1: Đếm số lượng records trong mỗi bảng
    console.log('\n=== Test 1: Counting Records ===')
    const userCount = await prisma.user.count()
    const serviceCount = await prisma.service.count()
    const bookingCount = await prisma.booking.count()
    const timeSlotCount = await prisma.timeSlot.count()
    
    console.log('Users:', userCount)
    console.log('Services:', serviceCount)
    console.log('Bookings:', bookingCount)
    console.log('Time Slots:', timeSlotCount)

    // Test 2: Lấy tất cả services và sắp xếp theo giá
    console.log('\n=== Test 2: Services Sorted by Price ===')
    const services = await prisma.service.findMany({
      orderBy: {
        price: 'asc'
      }
    })
    console.log('Services:', JSON.stringify(services, null, 2))

    // Test 3: Lấy bookings với thông tin user và service
    console.log('\n=== Test 3: Bookings with Relations ===')
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        service: true
      },
      orderBy: {
        bookingDate: 'asc'
      }
    })
    console.log('Bookings:', JSON.stringify(bookings, null, 2))

    // Test 4: Đếm số booking theo trạng thái
    console.log('\n=== Test 4: Bookings by Status ===')
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: true
    })
    console.log('Bookings by status:', JSON.stringify(bookingsByStatus, null, 2))

    // Test 5: Tìm các time slots còn trống
    console.log('\n=== Test 5: Available Time Slots ===')
    const availableSlots = await prisma.timeSlot.findMany({
      where: {
        isAvailable: true
      },
      orderBy: {
        startTime: 'asc'
      }
    })
    console.log('Available slots:', JSON.stringify(availableSlots, null, 2))

    // Test 6: Tổng doanh thu từ các booking đã confirmed
    console.log('\n=== Test 6: Total Revenue from Confirmed Bookings ===')
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED'
      },
      include: {
        service: true
      }
    })
    const totalRevenue = confirmedBookings.reduce((sum: number, booking: any) => sum + booking.service.price, 0)
    console.log('Total revenue:', totalRevenue.toLocaleString('vi-VN'), 'VND')

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testQueries() 