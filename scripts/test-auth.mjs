#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 Testing authentication setup...\n');

    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Test 2: Check if there are any users in the database
    console.log('2. Checking users in database...');
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database\n`);

    if (userCount === 0) {
      console.log('⚠️  No users found. Creating a test user...');
      
      const hashedPassword = await bcrypt.hash('testpassword123', 12);
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
        }
      });
      
      console.log('✅ Test user created:', testUser.email);
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: testpassword123\n');
    }

    // Test 3: Test password hashing and comparison
    console.log('3. Testing password hashing and comparison...');
    const testPassword = 'testpassword123';
    const testHash = await bcrypt.hash(testPassword, 12);
    const isValid = await bcrypt.compare(testPassword, testHash);
    console.log(`✅ Password hashing test: ${isValid ? 'PASSED' : 'FAILED'}\n`);

    // Test 4: Test user lookup and password verification
    console.log('4. Testing user lookup and password verification...');
    const users = await prisma.user.findMany({
      where: {
        password: {
          not: null
        }
      },
      take: 1
    });

    if (users.length > 0) {
      const user = users[0];
      console.log(`👤 Testing with user: ${user.email}`);
      
      // This would be the same logic as in your auth.ts
      if (user.password) {
        const testPasswordMatch = await bcrypt.compare('testpassword123', user.password);
        console.log(`🔐 Password verification: ${testPasswordMatch ? 'PASSED' : 'FAILED'}`);
      }
    }

    console.log('\n🎉 Authentication setup test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Try logging in with the test credentials');
    console.log('2. Check the browser console for any error messages');
    console.log('3. Check the server logs for authentication debug messages');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
