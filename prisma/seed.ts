import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed Service
  const service1 = await prisma.service.create({
    data: {
      name: 'Rửa xe cơ bản',
      description: 'Rửa ngoài xe, hút bụi nội thất',
      price: 100000,
      duration: 30,
    },
  })
  const service2 = await prisma.service.create({
    data: {
      name: 'Rửa xe cao cấp',
      description: 'Rửa ngoài, vệ sinh nội thất, đánh bóng',
      price: 200000,
      duration: 60,
    },
  })

  // Seed TimeSlot
  await prisma.timeSlot.createMany({
    data: [
      { startTime: '08:00', endTime: '09:00', maxCapacity: 2 },
      { startTime: '09:00', endTime: '10:00', maxCapacity: 2 },
      { startTime: '10:00', endTime: '11:00', maxCapacity: 2 },
      { startTime: '13:00', endTime: '14:00', maxCapacity: 2 },
      { startTime: '15:00', endTime: '16:00', maxCapacity: 2 },
    ],
    skipDuplicates: true,
  })

  // Seed User (tùy chọn, có thể bỏ qua nếu dùng auth Supabase)
  await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      name: 'Test User',
      phone: '0123456789',
    },
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 