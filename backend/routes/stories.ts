import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import OpenAI from 'openai';
import Story from '../models/Story';
import { authenticateToken, requireOwnershipOrStaff } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: Story management
 */

// Configure OpenAI (optional)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req: any, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../uploads/stories');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: AuthenticatedRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `story-${req.user!._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  }
});

// Get story prompts
const storyPrompts: Record<string, string[]> = {
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
    "What's a memory that always makes you smile?",
    "Describe a moment that changed your life.",
    "What memory would you like to preserve for future generations?"
  ],
  other: [
    "Tell me about something that's important to you.",
    "What would you like people to know about you?",
    "Is there anything you'd like to share that we haven't covered?",
    "What story would you like to tell?",
    "Is there something from your life that you think others should know about?"
  ]
};

/**
 * @swagger
 * /api/stories/prompts:
 *   get:
 *     summary: Get story prompts by category
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Story category
 *     responses:
 *       200:
 *         description: Prompts retrieved successfully
 */
// Get story prompts
router.get('/prompts', authenticateToken, (req: AuthenticatedRequest, res: express.Response) => {
  const { category } = req.query;
  
  if (category && typeof category === 'string') {
    const prompts = storyPrompts[category] || [];
    res.json({ prompts });
  } else {
    res.json({ categories: Object.keys(storyPrompts), prompts: storyPrompts });
  }
});

/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Get user's stories
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stories retrieved successfully
 */
// Get user's stories
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter: any = { resident: req.user!._id };

    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const stories = await Story.find(filter)
      .populate('resident', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Story.countDocuments(filter);

    res.json({
      stories: stories.map(story => story.toJSON()),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Stories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
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
 */
// Create new story
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { title, prompt, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const story = new Story({
      resident: req.user!._id,
      title,
      prompt,
      category,
      status: 'draft'
    });

    await story.save();

    res.status(201).json({
      message: 'Story created successfully',
      story: story.toJSON()
    });
  } catch (error) {
    console.error('Story creation error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

/**
 * @swagger
 * /api/stories/{storyId}:
 *   get:
 *     summary: Get a specific story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story retrieved successfully
 *       404:
 *         description: Story not found
 */
// Get specific story
router.get('/:storyId', authenticateToken, requireOwnershipOrStaff('storyId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { storyId } = req.params;
    
    const story = await Story.findById(storyId)
      .populate('resident', 'name email');

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({
      story: story.toJSON()
    });
  } catch (error) {
    console.error('Story fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

/**
 * @swagger
 * /api/stories/{storyId}/upload:
 *   post:
 *     summary: Upload recording for a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
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
 *       404:
 *         description: Story not found
 */
// Upload recording for story
router.post('/:storyId/upload', authenticateToken, requireOwnershipOrStaff('storyId'), upload.single('recording'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { storyId } = req.params;
    const { duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No recording file provided' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const fileUrl = `/uploads/stories/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    story.recording = {
      audioUrl: isVideo ? undefined : fileUrl,
      videoUrl: isVideo ? fileUrl : undefined,
      duration: Number(duration) || 0,
      fileSize: req.file.size,
      format: isVideo ? 'video' : 'audio'
    } as any;
    story.status = 'recorded';

    await story.save();

    // Start transcription if OpenAI is available
    if (openai && req.file?.path && storyId) {
      const filePath = req.file.path;
      transcribeRecording(storyId, filePath).catch(console.error);
    }

    res.json({
      message: 'Recording uploaded successfully',
      story: story.toJSON()
    });
  } catch (error) {
    console.error('Recording upload error:', error);
    res.status(500).json({ error: 'Failed to upload recording' });
  }
});

/**
 * @swagger
 * /api/stories/{storyId}:
 *   put:
 *     summary: Update a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: object
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Story updated successfully
 *       404:
 *         description: Story not found
 */
// Update story
router.put('/:storyId', authenticateToken, requireOwnershipOrStaff('storyId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { storyId } = req.params;
    const { title, content, status } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (title) story.title = title;
    if (content) story.content = { ...story.content, ...content };
    if (status) story.status = status;

    await story.save();

    res.json({
      message: 'Story updated successfully',
      story: story.toJSON()
    });
  } catch (error) {
    console.error('Story update error:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

/**
 * @swagger
 * /api/stories/{storyId}:
 *   delete:
 *     summary: Delete a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *       404:
 *         description: Story not found
 */
// Delete story
router.delete('/:storyId', authenticateToken, requireOwnershipOrStaff('storyId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Delete associated files
    if (story.recording?.audioUrl) {
      const filePath = path.join(__dirname, '..', story.recording.audioUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting audio file:', error);
      }
    }

    if (story.recording?.videoUrl) {
      const filePath = path.join(__dirname, '..', story.recording.videoUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting video file:', error);
      }
    }

    await Story.findByIdAndDelete(storyId);

    res.json({
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Story deletion error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// Helper function to transcribe recording
async function transcribeRecording(storyId: string, filePath: string): Promise<void> {
  try {
    if (!openai) return;

    const story = await Story.findById(storyId);
    if (!story) return;

    // Update transcription status
    story.transcription = { ...story.transcription, status: 'processing' };
    await story.save();

    const transcription = await openai.audio.transcriptions.create({
      file: await fs.readFile(filePath) as any,
      model: "whisper-1",
    });

    story.transcription = {
      text: transcription.text,
      confidence: 0.9, // Whisper doesn't provide confidence scores
      language: (transcription as any).language || 'en',
      status: 'completed'
    };

    await story.save();

    // Generate insights if transcription is successful
    if (transcription.text) {
      generateStoryInsights(storyId, transcription.text).catch(console.error);
    }
  } catch (error) {
    console.error('Transcription error:', error);
    
    const story = await Story.findById(storyId);
    if (story) {
      story.transcription = { ...story.transcription, status: 'failed' };
      await story.save();
    }
  }
}

// Helper function to generate story insights
async function generateStoryInsights(storyId: string, text: string): Promise<void> {
  try {
    if (!openai) return;

    const story = await Story.findById(storyId);
    if (!story) return;

    const prompt = `Analyze this story and provide:
1. A brief summary (2-3 sentences)
2. Key themes or topics mentioned
3. Emotional tone (positive, neutral, or negative)
4. Keywords that capture the main points

Story: ${text}

Please respond in JSON format with the following structure:
{
  "summary": "brief summary here",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "sentiment": "positive/neutral/negative"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        const insights = JSON.parse(response);
        story.content = {
          ...story.content,
          summary: insights.summary,
          keywords: insights.keywords,
          sentiment: insights.sentiment,
          originalText: text
        };
        await story.save();
      } catch (parseError) {
        console.error('Error parsing insights:', parseError);
      }
    }
  } catch (error) {
    console.error('Insights generation error:', error);
  }
}

export default router; 