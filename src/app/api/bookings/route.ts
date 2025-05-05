import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { createClient } from '../../../lib/supabase/server'
import { cookies } from 'next/headers'
import { Prisma } from '../../../generated/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // // TẠM TẮT XÁC THỰC: Gán user giả lập
  // const user = {
  //   id: 'test-user-id',
  //   email: 'testuser@example.com',
  //   user_metadata: {
  //     full_name: 'Test User',
  //     phone: '0123456789'
  //   }
  // }
  // Bỏ qua mọi kiểm tra xác thực khác

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth Error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { serviceId, bookingDate, timeSlot } = body

    if (!serviceId || !bookingDate || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Kiểm tra service có tồn tại không
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      })

      if (!service) {
        console.error('Service not found:', serviceId)
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      // Tìm hoặc tạo user trong database
      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: user.id },
            { email: user.email }
          ]
        }
      })

      if (!dbUser) {
        // Nếu user chưa tồn tại trong database, tạo mới
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || null,
            phone: user.user_metadata?.phone || null
          }
        })
      }

      // Tạo booking với user đã được đồng bộ
      const booking = await prisma.booking.create({
        data: {
          userId: dbUser.id,
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

      return NextResponse.json(booking)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Xử lý các lỗi cụ thể của Prisma
        if (error.code === 'P2002') {
          return NextResponse.json(
            { error: 'Booking already exists' },
            { status: 409 }
          )
        }
        console.error('Prisma Error:', error.code, error.message)
        return NextResponse.json(
          { error: 'Database operation failed' },
          { status: 500 }
        )
      }
      throw error
    }
  } catch (error) {
    // In chi tiết lỗi và stack trace
    console.error('Error creating booking:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }

    // Trả về lỗi chi tiết hơn khi ở môi trường dev
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      isDev
        ? { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }
        : { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth Error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    try {
      const bookings = await prisma.booking.findMany({
        where: {
          ...(date && {
            bookingDate: {
              gte: new Date(date),
              lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
            },
          }),
        },
        include: {
          service: true,
          user: {
            select: { id: true, email: true, name: true }
          },
        },
        orderBy: {
          bookingDate: 'asc',
        },
      })

      return NextResponse.json(bookings)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma Error:', error.code, error.message)
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 