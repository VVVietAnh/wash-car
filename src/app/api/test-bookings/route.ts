import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export async function GET() {
  try {
    console.log('=== CHECKING ALL BOOKINGS ===')

    // 1. Lấy tất cả bookings
    console.log('\n1. Fetching all bookings...')
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        user: {
          select: { id: true, email: true, name: true }
        }
      },
      orderBy: [
        { bookingDate: 'asc' },
        { timeSlot: 'asc' }
      ]
    })

    console.log(`Found ${bookings.length} bookings\n`)

    // 2. Log chi tiết từng booking
    bookings.forEach((booking, index) => {
      console.log(`--- Booking #${index + 1} ---`)
      console.log('ID:', booking.id)
      console.log('Ngày:', format(booking.bookingDate, 'dd/MM/yyyy', { locale: vi }))
      console.log('Giờ:', booking.timeSlot)
      console.log('Dịch vụ:', booking.service.name)
      console.log('Giá:', booking.service.price.toLocaleString('vi-VN'), 'đ')
      console.log('Thời gian thực hiện:', booking.service.duration, 'phút')
      console.log('Khách hàng:', booking.user.name)
      console.log('Trạng thái:', booking.status)
      console.log('Ngày tạo:', format(booking.createdAt, 'HH:mm dd/MM/yyyy', { locale: vi }))
      console.log('-------------------\n')
    })

    // 3. Thống kê theo trạng thái
    const bookingStats = await prisma.booking.groupBy({
      by: ['status'],
      _count: true
    })

    console.log('=== THỐNG KÊ THEO TRẠNG THÁI ===')
    bookingStats.forEach(stat => {
      console.log(`${stat.status}: ${stat._count} booking(s)`)
    })

    // 4. Tính tổng doanh thu
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + booking.service.price
    }, 0)

    console.log('\n=== THỐNG KÊ DOANH THU ===')
    console.log('Tổng số booking:', bookings.length)
    console.log('Tổng doanh thu:', totalRevenue.toLocaleString('vi-VN'), 'đ')
    console.log('========================')

    return NextResponse.json({
      success: true,
      bookings,
      stats: {
        total: bookings.length,
        byStatus: bookingStats,
        totalRevenue
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 