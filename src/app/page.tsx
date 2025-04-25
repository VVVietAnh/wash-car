import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="/images/car-wash-hero.jpg"
            alt="Car wash service"
          />
          <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Dịch vụ rửa xe chuyên nghiệp
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Chúng tôi cung cấp dịch vụ rửa xe chất lượng cao với đội ngũ nhân viên chuyên nghiệp và trang thiết bị hiện đại.
          </p>
          <div className="mt-10">
            <Link href="/booking">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Đặt lịch ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Dịch vụ của chúng tôi
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Chúng tôi cung cấp nhiều gói dịch vụ rửa xe phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Service Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-xl font-semibold text-gray-900">Rửa xe cơ bản</h3>
              <p className="mt-4 text-gray-500">
                Rửa ngoài, hút bụi nội thất, lau kính và làm sạch lốp
              </p>
              <p className="mt-4 text-2xl font-bold text-gray-900">150.000đ</p>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-xl font-semibold text-gray-900">Rửa xe tiêu chuẩn</h3>
              <p className="mt-4 text-gray-500">
                Rửa ngoài, hút bụi nội thất, lau kính, làm sạch lốp và đánh bóng
              </p>
              <p className="mt-4 text-2xl font-bold text-gray-900">250.000đ</p>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-xl font-semibold text-gray-900">Rửa xe cao cấp</h3>
              <p className="mt-4 text-gray-500">
                Rửa ngoài, hút bụi nội thất, lau kính, làm sạch lốp, đánh bóng và phủ ceramic
              </p>
              <p className="mt-4 text-2xl font-bold text-gray-900">500.000đ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
