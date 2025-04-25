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
import { Toaster, toast } from 'sonner'

const services = [
  { id: 'cm9w4sg4h0002onw9vf3x8ogw', name: 'Rửa xe cơ bản', price: 100000 },
  { id: 'cm9w4sg3m0001onw9s7hv1ddx', name: 'Rửa xe cao cấp', price: 200000 },
  { id: 'cm9w4sfy70000onw9ugqbfgul', name: 'Đánh bóng xe', price: 500000 }
]

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
]

export default function BookingPage() {
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState<string>()
  const [serviceId, setServiceId] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!date || !timeSlot || !serviceId) {
      toast.error('Vui lòng chọn đầy đủ thông tin')
      return
    }

    const selectedService = services.find(s => s.id === serviceId)

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          bookingDate: date,
          timeSlot
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Đặt lịch thất bại')
      }

      const booking = await response.json()
      
      // Hiển thị thông báo thành công
      toast.success(
        <div className="space-y-2">
          <h3 className="font-semibold">Đặt lịch thành công!</h3>
          <p>Dịch vụ: {selectedService?.name}</p>
          <p>Ngày: {format(date, 'dd/MM/yyyy', { locale: vi })}</p>
          <p>Giờ: {timeSlot}</p>
          <p>Giá: {selectedService?.price.toLocaleString('vi-VN')}đ</p>
        </div>
      )

      // Reset form
      setDate(undefined)
      setTimeSlot(undefined)
      setServiceId(undefined)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Toaster position="top-center" expand={true} richColors />
      
      <h1 className="text-3xl font-bold text-center mb-8">Đặt lịch rửa xe</h1>
      <p className="text-gray-600 text-center mb-8">
        Chọn ngày, giờ và dịch vụ phù hợp với nhu cầu của bạn
      </p>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Chọn ngày</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Chọn dịch vụ</h2>
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger>
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

        <div>
          <h2 className="text-lg font-semibold mb-2">Chọn giờ</h2>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger>
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

        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={!date || !timeSlot || !serviceId || isSubmitting}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch'}
        </Button>
      </div>
    </div>
  )
} 