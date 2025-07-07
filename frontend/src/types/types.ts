export interface Resident {
  residentId: string;
  name: string;
  photoUrl: string | null;
  email: string;
  isStaff: boolean;
  familyContactName: string;
  familyContactEmail: string;
  familyContactPhone: string;
}

export enum RecordingType {
  LifeStory = "Life Story",
  Message = "Message",
}

export enum TranscriptionStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Complete = "Complete",
}

export interface Recording {
  recordingId: string;
  timestamp: Date;
  residentId: string;
  recordingType: RecordingType;
  associatedPrompt?: string;
  videoFile: File | { name: string; url: string };
  transcriptionStatus: TranscriptionStatus;
  transcriptionText: string;
  aiSummary: string;
  notes: string;
}

export interface Prompt {
  promptId: string;
  category: string;
  question: string;
}

export type View = 'WELCOME' | 'SIGN_UP' | 'LOGIN' | 'RESIDENT_HOME' | 'PROMPTS_LIST' | 'RECORDING' | 'STAFF_HOME' | 'STAFF_RECORDING_DETAIL' | 'STAFF_MANAGE_PROMPTS' | 'CONTACT_FAMILY' | 'SEND_GREETING';