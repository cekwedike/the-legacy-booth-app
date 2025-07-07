import React, { useState, useEffect } from 'react';
import type { Recording, View } from '../types/types';
import { TranscriptionStatus } from '../types/types';
import { useLegacyData } from '../hooks/useLegacyData';
import Button from './ui/Button';
import Card from './ui/Card';
import Header from './ui/Header';
import { GoogleGenAI } from "@google/genai";

interface RecordingDetailProps {
  navigate: (view: View, context?: any) => void;
  context: {
    recordingId: string;
  };
}

const RecordingDetail: React.FC<RecordingDetailProps> = ({ navigate, context }) => {
  const { recordings, getResidentById, updateRecording } = useLegacyData();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Guard against missing context
  if (!context || !context.recordingId) {
      navigate('STAFF_HOME');
      return null;
  }

  useEffect(() => {
    const foundRecording = recordings.find(r => r.recordingId === context.recordingId);
    if (foundRecording) {
      // Create a deep copy for editing. JSON.stringify turns Date objects into ISO strings,
      // so we must parse it back into a Date object to maintain type integrity.
      const clonedRecording = JSON.parse(JSON.stringify(foundRecording));
      clonedRecording.timestamp = new Date(clonedRecording.timestamp);
      setRecording(clonedRecording);
    }
  }, [context.recordingId, recordings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!recording) return;
    const { name, value } = e.target;
    setRecording({ ...recording, [name]: value });
  };
  
  const generateAiContent = async () => {
    if (!recording) return;
    setIsGenerating(true);
    setAiError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // 1. Generate Transcription
        const transPrompt = `You are a transcription service. A senior resident named ${getResidentById(recording.residentId)?.name} is telling a story. Based on the prompt "${recording.associatedPrompt || 'a personal message'}", generate a plausible, heartfelt transcription from their perspective. The transcription should be a single block of text.`;
        const transResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: transPrompt,
        });
        const transcriptionText = transResponse.text;

        // 2. Generate Summary
        const summaryPrompt = `Summarize the following text in one or two sentences, capturing the main sentiment and key points. Text: "${transcriptionText}"`;
        const summaryResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: summaryPrompt,
        });
        const aiSummary = summaryResponse.text;
        
        setRecording({
            ...recording,
            transcriptionText,
            aiSummary,
            transcriptionStatus: TranscriptionStatus.Complete
        });

    } catch (error) {
        console.error("Error generating AI content:", error);
        setAiError("AI content generation failed. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  }

  const handleSaveChanges = () => {
    if (!recording) return;
    setIsSaving(true);
    setTimeout(() => {
      updateRecording(recording);
      setIsSaving(false);
      navigate('STAFF_HOME');
    }, 1000);
  };
  
  if (!recording) {
    return (
        <div className="min-h-screen flex flex-col bg-brand-background">
            <Header title="Loading..." onBack={() => navigate('STAFF_HOME')} />
            <main className="flex-grow flex items-center justify-center">
                <p className="text-2xl text-brand-text-secondary">Recording not found.</p>
            </main>
        </div>
    );
  }

  const resident = getResidentById(recording.residentId);
  const inputBaseClasses = "w-full p-3 text-base bg-brand-background border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-brand-text-primary placeholder:text-brand-text-secondary/60";

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Manage Recording" onBack={() => navigate('STAFF_HOME')} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & AI */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h3 className="text-2xl font-bold text-brand-text-primary font-serif mb-4">Details</h3>
              <div className="space-y-4 text-base">
                <p><span className="font-semibold text-brand-text-secondary">Resident:</span><br/> {resident?.name}</p>
                <p><span className="font-semibold text-brand-text-secondary">Type:</span><br/> {recording.recordingType}</p>
                <p><span className="font-semibold text-brand-text-secondary">Date:</span><br/> {new Date(recording.timestamp).toLocaleString()}</p>
                <p><span className="font-semibold text-brand-text-secondary">Video:</span><br/> 
                  <a href={recording.videoFile instanceof File ? URL.createObjectURL(recording.videoFile) : recording.videoFile.url} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline break-all">
                      {recording.videoFile.name}
                  </a>
                </p>
                {recording.associatedPrompt && <p><span className="font-semibold text-brand-text-secondary">Prompt:</span><br/> <span className="italic">"{recording.associatedPrompt}"</span></p>}
              </div>
            </Card>
            <Card>
                <h3 className="text-2xl font-bold text-brand-text-primary font-serif mb-4">AI Assistant</h3>
                <Button onClick={generateAiContent} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate Transcript & Summary'}
                </Button>
                {aiError && <p className="text-red-400 text-sm mt-3">{aiError}</p>}
                {recording.aiSummary && !aiError && (
                    <div className="mt-6">
                        <label className="block text-base font-semibold text-brand-text-secondary mb-2">AI Summary</label>
                        <p className="p-4 text-base bg-brand-background rounded-lg text-brand-text-primary italic border border-brand-secondary/40">{recording.aiSummary}</p>
                    </div>
                )}
            </Card>
          </div>

          {/* Right Column: Editable Fields */}
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-6">
                <div>
                  <label htmlFor="transcriptionStatus" className="block text-sm font-semibold text-brand-text-secondary mb-2">Transcription Status</label>
                  <select
                    id="transcriptionStatus"
                    name="transcriptionStatus"
                    value={recording.transcriptionStatus}
                    onChange={handleInputChange}
                    className={inputBaseClasses}
                  >
                    {Object.values(TranscriptionStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="transcriptionText" className="block text-sm font-semibold text-brand-text-secondary mb-2">Transcription Text</label>
                  <textarea
                    id="transcriptionText"
                    name="transcriptionText"
                    value={recording.transcriptionText}
                    onChange={handleInputChange}
                    rows={12}
                    placeholder="Generate with AI or paste the full text of the transcription here..."
                    className={inputBaseClasses}
                  />
                </div>
                 <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-brand-text-secondary mb-2">Internal Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={recording.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Add any internal notes..."
                    className={inputBaseClasses}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveChanges} disabled={isSaving} className="w-auto px-10" variant="accent">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordingDetail;