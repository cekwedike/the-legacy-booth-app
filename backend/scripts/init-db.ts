import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Story from '../models/Story';
import Message from '../models/Message';
import dotenv from 'dotenv';

dotenv.config();

const initializeDatabase = async (): Promise<void> => {
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
        role: 'resident' as const,
        roomNumber: '101',
        dateOfBirth: new Date('1945-03-15'),
        emergencyContact: {
          name: 'Michael Johnson',
          relationship: 'Son',
          phone: '555-0123',
          email: 'michael@example.com'
        },
        preferences: {
          theme: 'light' as const,
          fontSize: 'large' as const,
          audioEnabled: true
        }
      },
      {
        name: 'Staff Member',
        email: 'staff@demo.com',
        password: hashedPassword,
        role: 'staff' as const,
        preferences: {
          theme: 'light' as const,
          fontSize: 'medium' as const,
          audioEnabled: true
        }
      },
      {
        name: 'Administrator',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin' as const,
        preferences: {
          theme: 'light' as const,
          fontSize: 'medium' as const,
          audioEnabled: true
        }
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log('Created demo users');

    // Create sample stories for the resident
    const resident = createdUsers.find(user => user.role === 'resident');
    
    if (resident) {
      const sampleStories = [
        {
          resident: resident._id,
          title: 'My First Job',
          prompt: 'Tell me about your first job and how you got it.',
          category: 'career' as const,
          content: {
            originalText: 'I got my first job when I was sixteen years old. It was at the local grocery store, and I was so excited to start working. My father helped me get the job because he knew the owner. I started as a bag boy, helping customers carry their groceries to their cars. It was hard work, but I learned so much about responsibility and customer service.',
            editedText: 'I got my first job when I was sixteen years old. It was at the local grocery store, and I was so excited to start working. My father helped me get the job because he knew the owner. I started as a bag boy, helping customers carry their groceries to their cars. It was hard work, but I learned so much about responsibility and customer service.',
            summary: 'A heartwarming story about starting work at sixteen as a grocery store bag boy, learning responsibility and customer service.',
            keywords: ['first job', 'grocery store', 'responsibility', 'customer service', 'sixteen'],
            sentiment: 'positive' as const
          },
          transcription: {
            text: 'I got my first job when I was sixteen years old. It was at the local grocery store, and I was so excited to start working.',
            confidence: 0.95,
            language: 'en',
            status: 'completed' as const
          },
          status: 'published' as const,
          metadata: {
            recordingDate: new Date('2024-01-15'),
            mood: 'nostalgic' as const
          }
        },
        {
          resident: resident._id,
          title: 'Family Vacation to the Beach',
          prompt: 'Tell me about a memorable family vacation.',
          category: 'family' as const,
          content: {
            originalText: 'When I was ten years old, my family took a trip to the beach. It was the first time I had ever seen the ocean, and I was amazed by how big and blue it was. We stayed in a small cottage near the beach, and every morning we would walk down to the water. My father taught me how to swim, and my mother packed the most delicious picnic lunches. We built sandcastles, collected seashells, and watched the sunset every evening. It was the perfect family vacation.',
            editedText: 'When I was ten years old, my family took a trip to the beach. It was the first time I had ever seen the ocean, and I was amazed by how big and blue it was. We stayed in a small cottage near the beach, and every morning we would walk down to the water. My father taught me how to swim, and my mother packed the most delicious picnic lunches. We built sandcastles, collected seashells, and watched the sunset every evening. It was the perfect family vacation.',
            summary: 'A magical family vacation to the beach when the narrator was ten, featuring first ocean experience, swimming lessons, and perfect family moments.',
            keywords: ['beach', 'ocean', 'family vacation', 'swimming', 'sandcastles', 'seashells'],
            sentiment: 'positive' as const
          },
          transcription: {
            text: 'When I was ten years old, my family took a trip to the beach. It was the first time I had ever seen the ocean.',
            confidence: 0.92,
            language: 'en',
            status: 'completed' as const
          },
          status: 'published' as const,
          metadata: {
            recordingDate: new Date('2024-01-20'),
            mood: 'happy' as const
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
            name: 'Michael Johnson',
            relationship: 'Son',
            email: 'michael@example.com'
          },
          title: 'Happy Birthday, Michael!',
          type: 'birthday' as const,
          content: {
            audioUrl: '/uploads/messages/sample-birthday-message.mp3',
            duration: 120,
            fileSize: 2048000
          },
          transcription: {
            text: 'Happy birthday, Michael! I hope you have a wonderful day filled with joy and laughter.',
            confidence: 0.88,
            language: 'en',
            status: 'completed' as const
          },
          status: 'recorded' as const,
          scheduledFor: new Date('2024-06-15')
        },
        {
          sender: resident._id,
          recipient: {
            name: 'Emily Johnson',
            relationship: 'Granddaughter',
            email: 'emily@example.com'
          },
          title: 'Advice for Your Future',
          type: 'advice' as const,
          content: {
            videoUrl: '/uploads/messages/sample-advice-message.mp4',
            duration: 180,
            fileSize: 5120000
          },
          transcription: {
            text: 'Emily, I want to share some advice with you that I wish someone had given me when I was your age.',
            confidence: 0.91,
            language: 'en',
            status: 'completed' as const
          },
          status: 'recorded' as const,
          scheduledFor: new Date('2024-12-25')
        }
      ];

      await Message.insertMany(sampleMessages);
      console.log('Created sample messages');
    }

    console.log('Database initialization completed successfully!');
    console.log('\nDemo accounts created:');
    console.log('Resident: resident@demo.com / password123');
    console.log('Staff: staff@demo.com / password123');
    console.log('Admin: admin@demo.com / password123');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase; 