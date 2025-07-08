const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const OpenAI = require('openai');
const Story = require('../models/Story');
const { authenticateToken, requireOwnershipOrStaff } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: Story management
 */

// Configure OpenAI (optional)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/stories');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `story-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  }
});

// Get story prompts
const storyPrompts = {
  childhood: [
    "Tell me about your earliest childhood memory.",
    "What was your favorite toy or game when you were a child?",
    "Describe your childhood home and neighborhood.",
    "What was school like when you were growing up?",
    "Who was your best friend as a child and what did you do together?"
  ],
  family: [
    "Tell me about your parents and what they were like.",
    "What traditions did your family have when you were growing up?",
    "Describe a special family vacation or trip.",
    "What lessons did your parents teach you that you still remember?",
    "Tell me about your siblings and your relationship with them."
  ],
  career: [
    "What was your first job and how did you get it?",
    "What was your career path and how did you choose it?",
    "Tell me about a challenging project or achievement at work.",
    "What advice would you give to someone starting their career?",
    "How has your work changed over the years?"
  ],
  travel: [
    "What's the most interesting place you've ever visited?",
    "Tell me about a memorable trip or adventure.",
    "What's the farthest you've ever traveled from home?",
    "Describe a place that felt like home even though you were far away.",
    "What travel experience changed your perspective on life?"
  ],
  hobbies: [
    "What hobbies or interests have you had throughout your life?",
    "Tell me about a skill or craft you learned and enjoyed.",
    "What activities bring you the most joy?",
    "Have you ever collected anything? Tell me about it.",
    "What would you do if you had unlimited time and resources?"
  ],
  'life-lessons': [
    "What's the most important lesson life has taught you?",
    "What advice would you give to your younger self?",
    "What do you think is the key to a happy life?",
    "Tell me about a time when you had to overcome a major challenge.",
    "What values are most important to you and why?"
  ],
  memories: [
    "What's your happiest memory?",
    "Tell me about a time when you felt proud of yourself.",
    "What's a funny story from your life that still makes you laugh?",
    "Describe a moment that changed your life forever.",
    "What memory do you cherish the most?"
  ]
};

/**
 * @swagger
 * /api/stories/prompts/{category}:
 *   get:
 *     summary: Get story prompts by category
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Story category
 *     responses:
 *       200:
 *         description: List of prompts
 */
router.get('/prompts/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const prompts = storyPrompts[category] || storyPrompts.memories;
  res.json({ prompts });
});

/**
 * @swagger
 * /api/stories/categories:
 *   get:
 *     summary: Get all story categories
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', authenticateToken, (req, res) => {
  const categories = Object.keys(storyPrompts);
  res.json({ categories });
});

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Create a new story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - prompt
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               prompt:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Story created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create story
 *   get:
 *     summary: Get stories for current user
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of stories
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, status, limit = 20, page = 1 } = req.query;
    const filter = { resident: req.user._id };

    if (category) filter.category = category;
    if (status) filter.status = status;

    const stories = await Story.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Story.countDocuments(filter);

    res.json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Stories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Create a new story
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, prompt, category } = req.body;

    if (!title || !prompt || !category) {
      return res.status(400).json({ error: 'Title, prompt, and category are required' });
    }

    const story = new Story({
      resident: req.user._id,
      title,
      prompt,
      category
    });

    await story.save();

    res.status(201).json({
      message: 'Story created successfully',
      story
    });
  } catch (error) {
    console.error('Story creation error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

/**
 * @swagger
 * /api/stories/{storyId}/recording:
 *   post:
 *     summary: Upload a recording for a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Story ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recording:
 *                 type: string
 *                 format: binary
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Recording uploaded successfully
 *       400:
 *         description: No recording file provided
 *       404:
 *         description: Story not found
 *       500:
 *         description: Failed to upload recording
 */
router.post('/:storyId/recording', authenticateToken, upload.single('recording'), async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check ownership
    if (story.resident.toString() !== req.user._id.toString() && !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No recording file provided' });
    }

    const fileUrl = `/uploads/stories/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    // Update story with recording info
    story.recording = {
      audioUrl: isVideo ? null : fileUrl,
      videoUrl: isVideo ? fileUrl : null,
      duration: req.body.duration || 0,
      fileSize: req.file.size,
      format: isVideo ? 'video' : 'audio'
    };
    story.status = 'recorded';

    await story.save();

    // Start transcription process
    if (openai) {
      transcribeRecording(story._id, req.file.path);
    }

    res.json({
      message: 'Recording uploaded successfully',
      story
    });
  } catch (error) {
    console.error('Recording upload error:', error);
    res.status(500).json({ error: 'Failed to upload recording' });
  }
});

// Get a specific story
router.get('/:storyId', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId).populate('resident', 'name');

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check ownership
    if (story.resident._id.toString() !== req.user._id.toString() && !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ story });
  } catch (error) {
    console.error('Story fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Update story content
router.put('/:storyId', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, content, privacy, legacyBook } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check ownership
    if (story.resident.toString() !== req.user._id.toString() && !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = { ...story.content, ...content };
    if (privacy) updates.privacy = { ...story.privacy, ...privacy };
    if (legacyBook) updates.legacyBook = { ...story.legacyBook, ...legacyBook };

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Story updated successfully',
      story: updatedStory
    });
  } catch (error) {
    console.error('Story update error:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// Delete a story
router.delete('/:storyId', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check ownership
    if (story.resident.toString() !== req.user._id.toString() && !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete associated files
    if (story.recording.audioUrl) {
      const audioPath = path.join(__dirname, '..', story.recording.audioUrl);
      await fs.unlink(audioPath).catch(() => {});
    }
    if (story.recording.videoUrl) {
      const videoPath = path.join(__dirname, '..', story.recording.videoUrl);
      await fs.unlink(videoPath).catch(() => {});
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Story deletion error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// Transcribe recording using OpenAI Whisper
async function transcribeRecording(storyId, filePath) {
  try {
    const story = await Story.findById(storyId);
    if (!story) return;

    // Check if OpenAI is available
    if (!openai) {
      console.log('OpenAI not configured, skipping transcription');
      story.transcription = {
        text: 'Transcription not available - OpenAI API key not configured',
        confidence: 0,
        language: 'en',
        status: 'not_available'
      };
      await story.save();
      return;
    }

    story.transcription.status = 'processing';
    await story.save();

    const transcription = await openai.audio.transcriptions.create({
      file: await fs.readFile(filePath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });

    story.transcription = {
      text: transcription.text,
      confidence: transcription.language_probability || 0.8,
      language: transcription.language || 'en',
      status: 'completed'
    };

    story.content.originalText = transcription.text;
    story.status = 'transcribed';

    await story.save();

    // Generate summary and keywords
    if (transcription.text) {
      generateStoryInsights(storyId, transcription.text);
    }

  } catch (error) {
    console.error('Transcription error:', error);
    const story = await Story.findById(storyId);
    if (story) {
      story.transcription.status = 'failed';
      await story.save();
    }
  }
}

// Generate story insights using OpenAI
async function generateStoryInsights(storyId, text) {
  try {
    // Check if OpenAI is available
    if (!openai) {
      console.log('OpenAI not configured, skipping story insights generation');
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes life stories. Provide a brief summary (2-3 sentences) and extract 5-8 relevant keywords. Also determine the overall sentiment (positive, neutral, or negative)."
        },
        {
          role: "user",
          content: `Analyze this life story: ${text}`
        }
      ],
      temperature: 0.3
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the analysis (this is a simplified approach)
    const lines = analysis.split('\n');
    const summary = lines.find(line => line.toLowerCase().includes('summary'))?.split(':')[1]?.trim() || '';
    const keywords = lines.find(line => line.toLowerCase().includes('keyword'))?.split(':')[1]?.trim().split(',').map(k => k.trim()) || [];
    const sentiment = lines.find(line => line.toLowerCase().includes('sentiment'))?.split(':')[1]?.trim() || 'neutral';

    const story = await Story.findById(storyId);
    if (story) {
      story.content.summary = summary;
      story.content.keywords = keywords;
      story.content.sentiment = sentiment;
      await story.save();
    }
  } catch (error) {
    console.error('Story insights generation error:', error);
  }
}

module.exports = router; 