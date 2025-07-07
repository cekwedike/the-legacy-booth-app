const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Story = require('../models/Story');
const Message = require('../models/Message');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legacy-booth');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Story.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const demoUsers = [
      {
        name: 'Sarah Johnson',
        email: 'resident@demo.com',
        password: hashedPassword,
        role: 'resident',
        roomNumber: '101',
        dateOfBirth: new Date('1945-03-15'),
        emergencyContact: {
          name: 'Michael Johnson',
          relationship: 'Son',
          phone: '555-0123',
          email: 'michael@example.com'
        },
        preferences: {
          theme: 'light',
          fontSize: 'large',
          audioEnabled: true
        }
      },
      {
        name: 'Staff Member',
        email: 'staff@demo.com',
        password: hashedPassword,
        role: 'staff',
        preferences: {
          theme: 'light',
          fontSize: 'medium',
          audioEnabled: true
        }
      },
      {
        name: 'Administrator',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin',
        preferences: {
          theme: 'light',
          fontSize: 'medium',
          audioEnabled: true
        }
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log('Created demo users');

    // Create sample stories for the resident
    const resident = createdUsers.find(user => user.role === 'resident');
    
    const sampleStories = [
      {
        resident: resident._id,
        title: 'My First Job',
        prompt: 'Tell me about your first job and how you got it.',
        category: 'career',
        content: {
          originalText: 'I got my first job when I was sixteen years old. It was at the local grocery store, and I was so excited to start working. My father helped me get the job because he knew the owner. I started as a bag boy, helping customers carry their groceries to their cars. It was hard work, but I learned so much about responsibility and customer service.',
          editedText: 'I got my first job when I was sixteen years old. It was at the local grocery store, and I was so excited to start working. My father helped me get the job because he knew the owner. I started as a bag boy, helping customers carry their groceries to their cars. It was hard work, but I learned so much about responsibility and customer service.',
          summary: 'A heartwarming story about starting work at sixteen as a grocery store bag boy, learning responsibility and customer service.',
          keywords: ['first job', 'grocery store', 'responsibility', 'customer service', 'sixteen'],
          sentiment: 'positive'
        },
        transcription: {
          text: 'I got my first job when I was sixteen years old. It was at the local grocery store, and I was so excited to start working.',
          confidence: 0.95,
          language: 'en',
          status: 'completed'
        },
        status: 'published',
        metadata: {
          recordingDate: new Date('2024-01-15'),
          mood: 'nostalgic'
        }
      },
      {
        resident: resident._id,
        title: 'Family Vacation to the Beach',
        prompt: 'Describe a memorable family vacation.',
        category: 'family',
        content: {
          originalText: 'When I was ten years old, my family took a trip to the beach. We drove for hours to get there, and I remember being so excited to see the ocean for the first time. My siblings and I built sandcastles, and my parents taught us how to swim in the waves. We stayed in a small cottage near the beach, and every morning we would wake up to the sound of seagulls.',
          editedText: 'When I was ten years old, my family took a trip to the beach. We drove for hours to get there, and I remember being so excited to see the ocean for the first time. My siblings and I built sandcastles, and my parents taught us how to swim in the waves. We stayed in a small cottage near the beach, and every morning we would wake up to the sound of seagulls.',
          summary: 'A cherished memory of a family beach vacation at age ten, filled with sandcastles, swimming lessons, and ocean sounds.',
          keywords: ['family vacation', 'beach', 'ocean', 'sandcastles', 'swimming', 'cottage'],
          sentiment: 'positive'
        },
        transcription: {
          text: 'When I was ten years old, my family took a trip to the beach. We drove for hours to get there, and I remember being so excited to see the ocean for the first time.',
          confidence: 0.92,
          language: 'en',
          status: 'completed'
        },
        status: 'published',
        metadata: {
          recordingDate: new Date('2024-01-10'),
          mood: 'happy'
        }
      }
    ];

    await Story.insertMany(sampleStories);
    console.log('Created sample stories');

    // Create sample messages
    const sampleMessages = [
      {
        sender: resident._id,
        recipient: {
          name: 'Sarah',
          relationship: 'Granddaughter',
          email: 'sarah@example.com'
        },
        title: 'Birthday Wishes',
        type: 'birthday',
        message: {
          text: 'Happy birthday, sweetheart! I hope you have a wonderful day filled with love and laughter.',
          mood: 'loving'
        },
        status: 'delivered',
        metadata: {
          recordingDate: new Date('2024-01-14'),
          mood: 'happy'
        }
      },
      {
        sender: resident._id,
        recipient: {
          name: 'John',
          relationship: 'Son',
          email: 'john@example.com'
        },
        title: 'Daily Thought',
        type: 'daily',
        message: {
          text: 'Just wanted to let you know how proud I am of you and how much I love you.',
          mood: 'thoughtful'
        },
        status: 'sent',
        metadata: {
          recordingDate: new Date('2024-01-12'),
          mood: 'thoughtful'
        }
      }
    ];

    await Message.insertMany(sampleMessages);
    console.log('Created sample messages');

    console.log('\n✅ Database initialized successfully!');
    console.log('\nDemo accounts:');
    console.log('Resident: resident@demo.com / password123');
    console.log('Staff: staff@demo.com / password123');
    console.log('Admin: admin@demo.com / password123');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 