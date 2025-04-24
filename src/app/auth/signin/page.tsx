'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập hoặc Đăng ký
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <Button
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            Tiếp tục với Google
          </Button>
        </div>
      </div>
    </div>
  )
} 