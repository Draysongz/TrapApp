import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Pusher from 'pusher';

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Pusher
const pusher = new Pusher({
  appId: "1872455",
  key: "d70648a990c9399479e1",
  secret: "414c6a46bf065de11053",
  cluster: "eu",
  useTLS: true,
});

// Fetch user from Prisma
async function fetchUser(telegramId: string) {
  const user = await prisma.users.findUnique({
    where: { telegram_id: telegramId },
  });

  if (user && user.createdAt === null) {
    console.warn(`User with telegram ID ${telegramId} has a null createdAt value.`);
  }

  console.log(user)
  return user;
}


// Notify via Pusher
async function notifyUserFetched(user) {
  await pusher.trigger('my-channel', 'user-fetched', {
    user: user,
  });
}

// Fetch and notify user
async function fetchAndNotifyUser(telegramId: string) {
  const user = await fetchUser(telegramId);

  if (user) {
    // Trigger Pusher event
    await notifyUserFetched(user);
  }

  return user;
}

// Handle POST request
export async function POST(req: Request) {
  const { telegramId } = await req.json();

  if (!telegramId) {
    return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
  }

  try {
    const user = await fetchAndNotifyUser(telegramId);
    console.log(user)

    if (user) {
      return NextResponse.json({ success: true, user }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching and notifying user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
