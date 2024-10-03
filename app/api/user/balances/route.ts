import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import {PrismaClient} from '@prisma/client'

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

async function fetchUser(telegramId: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { telegram_id: telegramId },
    });

    return user;
  } catch (error) {
    console.error('Prisma Error:', error);
    throw new Error('Database Error');
  }
}

// Function to notify via Pusher
async function notifyUserFetched(user) {

  const telegramUserId = user.telegram_id


  if (!telegramUserId) {
    console.error("Telegram user ID not found");
    return;
  }

  if (!user || !user.telegram_id) {
    console.error("Invalid user data:", user);
    return;
  }

  try {
    await pusher.trigger(`user-${telegramUserId}`, 'user-fetched', {
      user: {
        telegramId: user.telegram_id,
        mainBalance: user.main_balance,
        drugMoneyBalance: user.drug_money_balance,
        energy: user.energy,
        clickerInventory: user.clicker_inventory,
      },
    });
    console.log("User fetched notification sent successfully.");
  } catch (error) {
    console.error("Failed to trigger user fetched notification:", error);
  }
}


// Handle GET request
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  try {
    const user = await fetchUser(telegramId);

    // If user is not found, return default values
    if (!user) {
      const defaultUser = {
        mainBalance: 0,
        drugMoneyBalance: 0,
        energy: 100,
        clickerInventory: 0,
      };
      return NextResponse.json(defaultUser, { status: 200 });
    }

    // Notify via Pusher
    await notifyUserFetched(user);

    // Return the fetched user data
    return NextResponse.json({
      mainBalance: user.main_balance || 0,
      drugMoneyBalance: user.drug_money_balance || 0,
      energy: user.energy || 100,
      clickerInventory: user.clicker_inventory || 0,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}