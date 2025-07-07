import type { Resident, Prompt, Recording } from '../types/types';
import { RecordingType, TranscriptionStatus } from '../types/types';

export const residents: Resident[] = [
  {
    residentId: 'RES-001',
    name: 'Eleanor Vance',
    photoUrl: null,
    email: 'resident1@facility.com',
    isStaff: false,
    familyContactName: 'John Vance',
    familyContactEmail: 'vance.family@email.com',
    familyContactPhone: '555-123-4567',
  },
  {
    residentId: 'RES-002',
    name: 'Arthur Pendelton',
    photoUrl: null,
    email: 'resident2@facility.com',
    isStaff: false,
    familyContactName: 'Mary Pendelton',
    familyContactEmail: 'pendelton.fam@email.com',
    familyContactPhone: '555-987-6543',
  },
   {
    residentId: 'STAFF-001',
    name: 'Dr. Evelyn Reed',
    photoUrl: null,
    email: 'staff1@facility.com',
    isStaff: true,
    familyContactName: '',
    familyContactEmail: '',
    familyContactPhone: '',
  },
];

export const prompts: Prompt[] = [
  {
    promptId: 'P-001',
    category: 'Childhood & Youth',
    question: 'What games did you play as a child?',
  },
  {
    promptId: 'P-002',
    category: 'Childhood & Youth',
    question: 'What was your favorite subject in school and why?',
  },
  {
    promptId: 'P-003',
    category: 'Career & Life Lessons',
    question: 'What was your very first job?',
  },
  {
    promptId: 'P-004',
    category: 'Career & Life Lessons',
    question: 'What are you most proud of in your life?',
  },
  {
    promptId: 'P-005',
    category: 'Family & Relationships',
    question: 'How did you meet your spouse or a significant friend?',
  },
  {
    promptId: 'P-006',
    category: 'Family & Relationships',
    question: 'What is one of your fondest memories with your family?',
  },
];

export const recordings: Recording[] = [
  {
    recordingId: 'VID-001',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    residentId: 'RES-001',
    recordingType: RecordingType.LifeStory,
    associatedPrompt: 'What was your proudest moment?',
    videoFile: { name: 'proud_moment.mp4', url: '#' },
    transcriptionStatus: TranscriptionStatus.Complete,
    transcriptionText: 'I think my proudest moment was watching my daughter graduate from college. It was a long journey for her, and she worked so hard. Seeing her walk across that stage, I just felt an overwhelming sense of joy and pride...',
    aiSummary: 'The resident expresses immense pride and joy in witnessing their daughter\'s college graduation, highlighting her hard work and the significance of the achievement.',
    notes: 'Resident seemed very happy during this recording.',
  },
  {
    recordingId: 'VID-002',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    residentId: 'RES-002',
    recordingType: RecordingType.Message,
    videoFile: { name: 'message_to_grandkids.mp4', url: '#' },
    transcriptionStatus: TranscriptionStatus.Pending,
    transcriptionText: '',
    aiSummary: '',
    notes: '',
  },
];