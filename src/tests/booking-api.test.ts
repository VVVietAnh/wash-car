import { PrismaClient } from '@prisma/client'
// @ts-ignore
import fetch from 'node-fetch'
global.fetch = fetch

const prisma = new PrismaClient()

describe('Booking API', () => {
  let serviceId: string

  beforeAll(async () => {
    // Lấy 1 serviceId hợp lệ từ database
    const service = await prisma.service.findFirst()
    if (!service) throw new Error('No service found in database')
    serviceId = service.id

    console.log('serviceId nhận được:', serviceId);

    // In ra tất cả serviceId hiện có (chỉ nên làm ở môi trường dev)
    const allServices = await prisma.service.findMany({ select: { id: true, name: true } });
    console.log('Danh sách serviceId hiện có:', allServices);
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a booking successfully', async () => {
    const bookingDate = new Date().toISOString()
    const timeSlot = '08:00'

    const res = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceId,
        bookingDate,
        timeSlot
      })
    })

    const data = await res.json()
    console.log('API response:', data)
    expect(res.status).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.serviceId).toBe(serviceId)
  })
})
