#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🔧 Setting up Prisma...');

try {
  // Check if .env file exists
  if (!existsSync('.env')) {
    console.log('⚠️  .env file not found. Please create one with your DATABASE_URL');
    process.exit(1);
  }

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Prisma client generated successfully!');
  
  // Optionally run database push (uncomment if needed)
  // console.log('🚀 Pushing schema to database...');
  // execSync('npx prisma db push', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Error setting up Prisma:', error.message);
  process.exit(1);
}
