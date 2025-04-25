'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useParams } from 'next/navigation';

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  status: string;
  createdAt: string;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Đang tải thông tin đặt lịch...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Lỗi: {error}</div>;
  }

  if (!booking) {
    return <div className="p-8">Không tìm thấy thông tin đặt lịch</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Chi tiết đặt lịch</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin dịch vụ</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Tên dịch vụ:</p>
            <p className="font-medium">{booking.service.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Giá:</p>
            <p className="font-medium">{booking.service.price.toLocaleString('vi-VN')}đ</p>
          </div>
          <div>
            <p className="text-gray-600">Thời gian thực hiện:</p>
            <p className="font-medium">{booking.service.duration} phút</p>
          </div>
          <div>
            <p className="text-gray-600">Mô tả:</p>
            <p className="font-medium">{booking.service.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin đặt lịch</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Ngày đặt lịch:</p>
            <p className="font-medium">
              {format(new Date(booking.bookingDate), 'EEEE, dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Giờ đặt lịch:</p>
            <p className="font-medium">{booking.timeSlot}</p>
          </div>
          <div>
            <p className="text-gray-600">Trạng thái:</p>
            <p className="font-medium">
              {booking.status === 'PENDING' ? 'Chờ xác nhận' : 
               booking.status === 'CONFIRMED' ? 'Đã xác nhận' :
               booking.status === 'COMPLETED' ? 'Đã hoàn thành' :
               booking.status === 'CANCELLED' ? 'Đã hủy' : booking.status}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Ngày tạo:</p>
            <p className="font-medium">
              {format(new Date(booking.createdAt), 'HH:mm dd/MM/yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Tên khách hàng:</p>
            <p className="font-medium">{booking.user.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{booking.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 