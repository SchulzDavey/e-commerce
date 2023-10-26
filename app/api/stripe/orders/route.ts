import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '../../auth/[...nextauth]/authOptions';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const user = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json({ message: 'Not logged in' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user?.user?.id,
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
