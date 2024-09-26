import { v4 as uuidv4 } from 'uuid';

export function generateReferralCode(): string {
  return uuidv4();
}