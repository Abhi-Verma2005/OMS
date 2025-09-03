import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      console.log('Test user already exists:', existingUser.email)
      return
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER'
      }
    })

    console.log('Test user created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })

    console.log('\nYou can now sign in with:')
    console.log('Email: test@example.com')
    console.log('Password: password123')

  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
