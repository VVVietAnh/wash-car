import prisma from '../../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: params.id,
      },
      include: {
        service: true,
        user: true,
      },
    });

    if (!booking) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return Response.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return Response.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}