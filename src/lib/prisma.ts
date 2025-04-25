import { PrismaClient } from '../generated/prisma'

// Khởi tạo PrismaClient với log để debug
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Khởi tạo prisma instance
const prisma = globalThis.prisma ?? prismaClientSingleton()

// Thử kết nối để kiểm tra
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((e) => {
    console.error('Failed to connect to database:', e)
  })

// Lưu instance trong development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma 