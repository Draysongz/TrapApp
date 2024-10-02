import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchUser(telegramId: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { telegram_id: telegramId },
    });
    
    if (user) {
      console.log('User found:', user);
      return user;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}


