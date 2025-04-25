import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export async function POST(request: Request) {
  try {
    console.log('=== TESTING BOOKING CREATION ===')
    
    // 1. Lấy dữ liệu từ request
    const body = await request.json()
    const { serviceId, bookingDate, timeSlot } = body
    
    console.log('\n1. Request data:')
    console.log('- Service ID:', serviceId)
    console.log('- Booking date:', format(new Date(bookingDate), 'dd/MM/yyyy', { locale: vi }))
    console.log('- Time slot:', timeSlot)

    // 2. Kiểm tra service tồn tại
    console.log('\n2. Checking service...')
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })
    
    if (!service) {
      console.log('Service not found!')
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    console.log('Found service:', service.name)

    // 3. Tạo hoặc lấy test user
    console.log('\n3. Creating/getting test user...')
    let testUser = await prisma.user.findUnique({
      where: { id: 'test-user' }
    })

    if (!testUser) {
      console.log('Creating new test user...')
      testUser = await prisma.user.create({
        data: {
          id: 'test-user',
          email: 'test@example.com',
          name: 'Test User'
        }
      })
    }
    
    console.log('Test user:', testUser.name)

    // 4. Kiểm tra booking trùng
    console.log('\n4. Checking for duplicate bookings...')
    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        bookingDate: new Date(bookingDate),
        timeSlot,
        NOT: {
          status: 'CANCELLED'
        }
      }
    })

    if (existingBooking) {
      console.log('Found duplicate booking!')
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    console.log('No duplicate bookings found')

    // 5. Tạo booking mới
    console.log('\n5. Creating new booking...')
    const booking = await prisma.booking.create({
      data: {
        userId: testUser.id,
        serviceId,
        bookingDate: new Date(bookingDate),
        timeSlot,
        status: 'PENDING',
      },
      include: {
        service: true,
        user: {
          select: { id: true, email: true, name: true }
        },
      },
    })

    console.log('\n=== BOOKING CREATED SUCCESSFULLY ===')
    console.log('Booking ID:', booking.id)
    console.log('Service:', booking.service.name)
    console.log('Date:', format(booking.bookingDate, 'dd/MM/yyyy', { locale: vi }))
    console.log('Time:', booking.timeSlot)
    console.log('Status:', booking.status)
    console.log('Customer:', booking.user.name)
    console.log('Total price:', booking.service.price.toLocaleString('vi-VN'), 'đ')
    console.log('================================')

    return NextResponse.json(booking)
  } catch (error) {
    console.error('\nError creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 