import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.OPENROUTER_API_KEY;

if (apiKey) {
  console.log('✅ OPENROUTER_API_KEY is set.');
} else {
  console.log('❌ OPENROUTER_API_KEY is NOT set.');
}
