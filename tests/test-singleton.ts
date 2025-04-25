import { PrismaClient } from '../src/generated/prisma'

declare global {
  var prisma: undefined | PrismaClient
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

async function runTests() {
  // Test 1: Tạo PrismaClient trực tiếp
  console.log('\nTest 1: Creating PrismaClient directly')
  try {
    const prisma1 = new PrismaClient()
    console.log('✓ Successfully created PrismaClient directly')
    await prisma1.$disconnect()
  } catch (error) {
    console.error('✗ Failed to create PrismaClient directly:', error)
  }

  // Test 2: Tạo PrismaClient qua singleton pattern
  console.log('\nTest 2: Creating PrismaClient via singleton')
  try {
    const prismaClientSingleton = () => {
      return new PrismaClient()
    }
    const prisma2 = prismaClientSingleton()
    console.log('✓ Successfully created PrismaClient via singleton')
    await prisma2.$disconnect()
  } catch (error) {
    console.error('✗ Failed to create PrismaClient via singleton:', error)
  }

  // Test 3: Tạo PrismaClient với cấu hình rõ ràng
  console.log('\nTest 3: Creating PrismaClient with explicit config')
  try {
    const prisma3 = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    console.log('✓ Successfully created PrismaClient with config')
    await prisma3.$disconnect()
  } catch (error) {
    console.error('✗ Failed to create PrismaClient with config:', error)
  }

  // Test 4: Test global singleton như trong lib/prisma.ts
  console.log('\nTest 4: Testing global singleton pattern')
  try {
    const prismaClientSingleton = () => {
      return new PrismaClient()
    }
    const prisma4 = globalThis.prisma ?? prismaClientSingleton()
    console.log('✓ Successfully created PrismaClient via global singleton')
    await prisma4.$disconnect()
  } catch (error) {
    console.error('✗ Failed to create PrismaClient via global singleton:', error)
  }
}

runTests().catch(console.error) 