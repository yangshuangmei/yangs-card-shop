import { supabase } from './src/lib/supabase.ts';
import { products } from './src/data/products.ts';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('Starting migration to Supabase...');

  // 1. Migrate Products
  const { error: pError } = await supabase.from('products').upsert(products);
  if (pError) console.error('Product migration error:', pError);
  else console.log('Products migrated successfully.');

  // 2. Migrate Settings
  const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  const { error: sError } = await supabase.from('settings').upsert({ id: 1, ...settings });
  if (sError) console.error('Settings migration error:', sError);
  else console.log('Settings migrated successfully.');

  console.log('Migration finished.');
}

migrate();
