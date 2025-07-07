import React, { useState, useRef } from 'react';
import type { Prompt, View, Recording } from '../types/types';
import { RecordingType, TranscriptionStatus } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { useLegacyData } from '../hooks/useLegacyData';
import Button from './ui/Button';
import Card from './ui/Card';
import Header from './ui/Header';
import { CameraIcon, UploadIcon } from './ui/icons';

interface RecordingScreenProps {
  navigate: (view: View, context?: any) => void;
  context: {
    recordingType: RecordingType;
    prompt?: Prompt | string;
  };
}

const RecordingScreen: React.FC<RecordingScreenProps> = ({ navigate, context }) => {
  const { currentUser } = useAuth();
  const { addRecording } = useLegacyData();
  const takeVideoRef = useRef<HTMLInputElement>(null);
  const chooseGalleryRef = useRef<HTMLInputElement>(null);

  const backView = context?.recordingType === RecordingType.LifeStory ? 'PROMPTS_LIST' : 'RESIDENT_HOME';

  // Guard against missing context
  if (!context) {
    navigate(backView);
    return null;
  }
    
  const { recordingType, prompt } = context;

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoFile(event.target.files[0]);
    }
    // Reset the input value to allow re-selection of the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleSubmit = () => {
    if (!videoFile || !currentUser) return;
    setIsSubmitting(true);

    const promptText = typeof prompt === 'string' ? prompt : prompt?.question;

    const newRecording: Omit<Recording, 'recordingId' | 'timestamp' | 'aiSummary'> = {
      residentId: currentUser.residentId,
      recordingType: recordingType,
      associatedPrompt: promptText,
      videoFile: videoFile,
      transcriptionStatus: TranscriptionStatus.Pending,
      transcriptionText: '',
      notes: '',
    };
    
    // Simulate upload delay
    setTimeout(() => {
      addRecording(newRecording);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
        <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center text-center p-8">
            <Card className="max-w-lg">
                <h2 className="text-4xl font-bold text-brand-text-primary font-serif">Thank You!</h2>
                <p className="text-xl text-brand-text-secondary mt-4">Your memory has been safely submitted.</p>
                <div className="mt-12 w-full max-w-xs mx-auto">
                    <Button onClick={() => navigate('RESIDENT_HOME')} variant="accent">Back to Home</Button>
                </div>
            </Card>
        </div>
    );
  }

  const title = recordingType === RecordingType.LifeStory ? "Record Your Story" : "Leave a Message";
  const promptQuestion = typeof prompt === 'string' ? prompt : prompt?.question;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title={title} onBack={() => navigate(backView)} />
      <main className="flex-grow w-full max-w-3xl mx-auto p-4 sm:p-8">
        <Card>
          {promptQuestion && (
            <div className="bg-brand-background p-6 rounded-xl border border-brand-accent/20 mb-8">
              <p className="text-base text-brand-accent/80">You are responding to the prompt:</p>
              <p className="text-2xl font-semibold text-brand-text-primary font-serif mt-2">"{promptQuestion}"</p>
            </div>
          )}
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-text-primary font-serif">Instructions</h3>
            <ol className="list-decimal list-inside space-y-4 text-lg text-brand-text-secondary">
                <li>Choose <span className="font-semibold text-brand-accent">'Record New Video'</span> to open your device's camera, or <span className="font-semibold text-brand-accent">'Upload from Gallery'</span> to select an existing video.</li>
                <li>After recording or selecting, the file name will appear below.</li>
                <li>Tap <span className="font-semibold text-brand-accent">'Submit Your Video'</span> when you're ready.</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-8 mt-8 border-t border-brand-surface/50">
              <Button onClick={() => takeVideoRef.current?.click()} icon={<CameraIcon className="h-6 w-6" />}>
                Record New Video
              </Button>
              <input ref={takeVideoRef} type="file" accept="video/*" capture="user" onChange={handleFileChange} className="hidden" />

              <Button onClick={() => chooseGalleryRef.current?.click()} variant="secondary" icon={<UploadIcon className="h-6 w-6" />}>
                Upload from Gallery
              </Button>
              <input ref={chooseGalleryRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
          </div>

          {videoFile && (
            <div className="mt-6 text-center text-lg text-green-300 font-medium bg-green-900/40 p-4 rounded-lg">
              Ready to upload: {videoFile.name}
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-brand-surface/50">
            <Button onClick={handleSubmit} disabled={!videoFile || isSubmitting} variant="accent">
              {isSubmitting ? 'Submitting...' : 'Submit Your Video'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default RecordingScreen;