'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const services = [
  { id: '1', name: 'Rửa xe cơ bản', price: 150000, duration: 30 },
  { id: '2', name: 'Rửa xe tiêu chuẩn', price: 250000, duration: 45 },
  { id: '3', name: 'Rửa xe cao cấp', price: 500000, duration: 60 },
]

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00',
]

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedService, setSelectedService] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService,
          bookingDate: date,
          timeSlot: selectedTime,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      // Redirect to success page or show success message
      alert('Đặt lịch thành công!')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Đặt lịch rửa xe
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Chọn ngày, giờ và dịch vụ phù hợp với nhu cầu của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 max-w-2xl mx-auto">
        <div className="space-y-8">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chọn ngày
            </label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={vi}
              />
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chọn dịch vụ
            </label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString('vi-VN')}đ
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chọn giờ
            </label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn giờ" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={!date || !selectedService || !selectedTime}
            >
              Đặt lịch
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
} 