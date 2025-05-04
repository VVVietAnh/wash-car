import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

describe('Supabase Connection Tests', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const prisma = new PrismaClient()

  it('should connect to Supabase client', async () => {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test authentication
    const { data: { session }, error } = await supabase.auth.getSession()
    
    expect(error).toBeNull()
    expect(session).toBeDefined()
  })

  it('should connect to database through Prisma', async () => {
    try {
      // Test database connection by querying a simple table
      const services = await prisma.service.findMany({
        take: 1
      })
      
      expect(services).toBeDefined()
      expect(Array.isArray(services)).toBe(true)
    } catch (error) {
      console.error('Database connection error:', error)
      throw error
    } finally {
      await prisma.$disconnect()
    }
  })

  it('should have valid environment variables', () => {
    expect(process.env.DATABASE_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
  })
}) 