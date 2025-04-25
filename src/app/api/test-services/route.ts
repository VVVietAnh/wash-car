import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  try {
    console.log('=== TESTING SERVICES ===')
    
    // Lấy tất cả services
    console.log('\n1. Fetching all services...')
    const services = await prisma.service.findMany()
    console.log('Found services:', services.length)
    services.forEach(service => {
      console.log(`- ${service.name}: ${service.price.toLocaleString('vi-VN')}đ (${service.duration} phút)`)
    })

    // Test tìm service theo ID
    if (services.length > 0) {
      const testId = services[0].id
      console.log(`\n2. Finding service by ID: ${testId}`)
      const service = await prisma.service.findUnique({
        where: { id: testId }
      })
      console.log('Found service:', service)
    }

    // Test tìm service không tồn tại
    console.log('\n3. Finding non-existent service...')
    const nonExistentService = await prisma.service.findUnique({
      where: { id: 'non-existent-id' }
    })
    console.log('Result:', nonExistentService)

    // Test đếm số lượng services
    console.log('\n4. Counting services...')
    const count = await prisma.service.count()
    console.log('Total services:', count)

    // Test tìm service theo giá
    console.log('\n5. Finding services by price range...')
    const affordableServices = await prisma.service.findMany({
      where: {
        price: {
          lte: 200000 // Dưới hoặc bằng 200,000đ
        }
      },
      orderBy: {
        price: 'asc'
      }
    })
    console.log('Affordable services:')
    affordableServices.forEach(service => {
      console.log(`- ${service.name}: ${service.price.toLocaleString('vi-VN')}đ`)
    })

    return NextResponse.json({
      success: true,
      services,
      count,
      affordableServices
    })
  } catch (error) {
    console.error('Error testing services:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 