const mongoose = require('mongoose');
const User = require('../models/User');
const Story = require('../models/Story');
const Message = require('../models/Message');
const LegacyBook = require('../models/LegacyBook');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legacy-booth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const sampleUsers = [
  { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user' },
  { name: 'Michael Chen', email: 'michael@example.com', role: 'user' },
  { name: 'Emma Davis', email: 'emma@example.com', role: 'user' },
  { name: 'Robert Wilson', email: 'robert@example.com', role: 'user' },
  { name: 'Lisa Brown', email: 'lisa@example.com', role: 'user' },
  { name: 'David Miller', email: 'david@example.com', role: 'user' },
  { name: 'Jennifer Garcia', email: 'jennifer@example.com', role: 'user' },
  { name: 'James Taylor', email: 'james@example.com', role: 'user' },
  { name: 'Maria Rodriguez', email: 'maria@example.com', role: 'user' },
  { name: 'Thomas Anderson', email: 'thomas@example.com', role: 'user' }
];

const storyCategories = ['childhood', 'family', 'career', 'travel', 'hobbies', 'life-lessons', 'memories', 'other'];
const storyTitles = [
  'My First Day at School',
  'The Family Vacation to Europe',
  'Starting My Own Business',
  'Meeting My Spouse',
  'Learning to Drive',
  'My First Job',
  'The Birth of My Children',
  'Overcoming Challenges',
  'Life Lessons from My Parents',
  'Memories of My Grandparents'
];

const messageTypes = ['birthday', 'anniversary', 'holiday', 'daily', 'encouragement', 'memory', 'advice', 'gratitude', 'love', 'wisdom'];
const messageTitles = [
  'Happy Birthday, Sweetheart',
  'Our Anniversary Celebration',
  'Christmas Memories',
  'Daily Encouragement',
  'Words of Wisdom',
  'Thank You for Everything',
  'I Love You',
  'Life Advice',
  'Memories We Share',
  'Gratitude for You'
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Create sample users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User({
          ...userData,
          password: 'password123',
          status: 'active',
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random login within last 7 days
        });
        await user.save();
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.name}`);
      } else {
        createdUsers.push(existingUser);
      }
    }

    // Create sample stories
    const createdStories = [];
    for (let i = 0; i < 25; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const story = new Story({
        user: user._id,
        title: storyTitles[Math.floor(Math.random() * storyTitles.length)],
        prompt: 'Tell me about a memorable moment in your life',
        category: storyCategories[Math.floor(Math.random() * storyCategories.length)],
        status: ['draft', 'recorded', 'transcribed', 'edited', 'published'][Math.floor(Math.random() * 5)],
        content: {
          originalText: 'This is a sample story content that would be transcribed from the recording.',
          editedText: 'This is a sample story content that would be transcribed from the recording.',
          summary: 'A heartwarming story about family and memories.',
          keywords: ['family', 'memories', 'love', 'life'],
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
        },
        transcription: {
          text: 'This is a sample transcription of the recorded story.',
          confidence: 0.85 + Math.random() * 0.15,
          language: 'en',
          status: 'completed'
        },
        metadata: {
          recordingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          location: 'Home',
          weather: 'Sunny',
          mood: ['happy', 'calm', 'excited', 'thoughtful', 'nostalgic'][Math.floor(Math.random() * 5)]
        }
      });
      await story.save();
      createdStories.push(story);
    }
    console.log(`✅ Created ${createdStories.length} stories`);

    // Create sample messages
    const createdMessages = [];
    for (let i = 0; i < 30; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const message = new Message({
        sender: user._id,
        title: messageTitles[Math.floor(Math.random() * messageTitles.length)],
        recipientName: 'Family Member',
        recipientEmail: 'family@example.com',
        recipientRelationship: 'Family',
        messageType: messageTypes[Math.floor(Math.random() * messageTypes.length)],
        description: 'A heartfelt message for my loved ones',
        audioFile: 'sample-audio.mp3',
        audioPath: '/uploads/messages/sample-audio.mp3',
        duration: 60 + Math.random() * 120, // 1-3 minutes
        transcription: {
          text: 'This is a sample transcription of the recorded message.',
          status: 'completed',
          confidence: 0.85 + Math.random() * 0.15,
          language: 'en'
        },
        status: ['draft', 'active', 'scheduled', 'sent', 'delivered', 'viewed'][Math.floor(Math.random() * 6)],
        metadata: {
          recordingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          location: 'Home',
          weather: 'Sunny',
          device: 'Mobile Phone',
          recordingQuality: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        },
        analytics: {
          playCount: Math.floor(Math.random() * 10),
          lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          favoriteCount: Math.floor(Math.random() * 5),
          shareCount: Math.floor(Math.random() * 3)
        }
      });
      await message.save();
      createdMessages.push(message);
    }
    console.log(`✅ Created ${createdMessages.length} messages`);

    // Create sample legacy books
    const createdLegacyBooks = [];
    for (let i = 0; i < 8; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const userStories = createdStories.filter(story => story.user.toString() === user._id.toString());
      const userMessages = createdMessages.filter(message => message.sender.toString() === user._id.toString());
      
      const legacyBook = new LegacyBook({
        user: user._id,
        title: `Legacy Book for ${user.name}`,
        description: 'A collection of memories and stories for future generations',
        theme: ['classic', 'modern', 'vintage', 'minimal'][Math.floor(Math.random() * 4)],
        isPublic: Math.random() > 0.7,
        isFavorite: Math.random() > 0.8,
        dedication: 'To my family, with love',
        acknowledgments: 'Thank you to everyone who has been part of my journey',
        stories: userStories.slice(0, Math.floor(Math.random() * 5) + 1).map(story => story._id),
        messages: userMessages.slice(0, Math.floor(Math.random() * 3) + 1).map(message => message._id),
        status: ['draft', 'published', 'archived'][Math.floor(Math.random() * 3)],
        content: {
          introduction: 'Welcome to my legacy book, a collection of stories and memories.',
          tableOfContents: [
            { title: 'Introduction', pageNumber: 1, type: 'chapter' },
            { title: 'Family Stories', pageNumber: 5, type: 'story' },
            { title: 'Personal Messages', pageNumber: 15, type: 'message' }
          ],
          conclusion: 'Thank you for reading my legacy book.'
        },
        format: {
          pageCount: 50 + Math.floor(Math.random() * 100),
          wordCount: 5000 + Math.floor(Math.random() * 10000),
          estimatedReadingTime: 30 + Math.floor(Math.random() * 60),
          dimensions: {
            width: 8.5,
            height: 11
          }
        }
      });
      await legacyBook.save();
      createdLegacyBooks.push(legacyBook);
    }
    console.log(`✅ Created ${createdLegacyBooks.length} legacy books`);

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Stories: ${createdStories.length}`);
    console.log(`   - Messages: ${createdMessages.length}`);
    console.log(`   - Legacy Books: ${createdLegacyBooks.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData(); 