import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { up as up002 } from './migrations/002_update_users_table.js';
import { up as up003 } from './migrations/003_add_referral_columns.js';
import { up as up004 } from './migrations/004_add_main_balance_column.js';
import { up as up005 } from './migrations/005_add_clicker_balance_and_energy.js';
import { up as up006 } from './migrations/006_add_energy_column.js';
import { up as up007 } from './migrations/007_add_drug_money_balance.js';
import { up as up008 } from './migrations/008_add_clicker_inventory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function runMigration() {
  try {
    console.log('Environment variables:', process.env);
    await up002();
    await up003();
    await up004();
    await up005();
    await up006();
    await up007();
    await up008();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration().catch((error) => {
  console.error('Unhandled error during migration:', error);
  process.exit(1);
});