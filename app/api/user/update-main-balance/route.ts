import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Ensure you have the correct path to your Prisma client
import Pusher from 'pusher';


const prisma = new PrismaClient();

// Initialize Pusher
const pusher = new Pusher({
  appId: "1872455",
  key: "d70648a990c9399479e1",
  secret: "414c6a46bf065de11053",
  cluster: "eu",
  useTLS: true,
});

export async function POST(request: Request) {
  const { telegramId, amount } = await request.json();

  if (!telegramId || amount === undefined) {
    return NextResponse.json({ error: 'Telegram ID and amount are required' }, { status: 400 });
  }

  try {
    // Update the user's main balance
    const user = await prisma.users.findUnique({
      where: { telegram_id: telegramId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newBalance = user.main_balance + amount;

    await prisma.users.update({
      where: { telegram_id: telegramId },
      data: { main_balance: newBalance },
    });

    // Notify via Pusher
    await pusher.trigger(`user-${telegramId}`, 'balance-updated', {
      mainBalance: newBalance,
      drugMoneyBalance: user.drug_money_balance,
      energy: user.energy,
      clickerInventory: user.clicker_inventory,
    });

    return NextResponse.json({ newBalance });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
