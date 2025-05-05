import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  const email = 'admin@example.com'
  const password = 'admin123'
  const name = 'Admin User'

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) throw authError

    if (authData.user) {
      // Create user profile with admin role
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            role: 'ADMIN',
          },
        ])

      if (profileError) throw profileError

      console.log('Admin user created successfully!')
      console.log('Email:', email)
      console.log('Password:', password)
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser() 