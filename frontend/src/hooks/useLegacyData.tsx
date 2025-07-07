import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import type { Resident, Prompt, Recording } from '../types/types';
import { residents as mockResidents, prompts as mockPrompts, recordings as mockRecordings } from '../services/mockData';

interface LegacyDataContextType {
  residents: Resident[];
  prompts: Prompt[];
  recordings: Recording[];
  getResidentById: (id: string) => Resident | undefined;
  addRecording: (newRecording: Omit<Recording, 'recordingId' | 'timestamp' | 'aiSummary'>) => void;
  updateRecording: (updatedRecording: Recording) => void;
  addPrompt: (newPrompt: Omit<Prompt, 'promptId'>) => void;
  addResident: (newResidentData: Omit<Resident, 'residentId' | 'isStaff'>) => Resident;
}

const LegacyDataContext = createContext<LegacyDataContextType | undefined>(undefined);

// Helper function to load data from localStorage
const loadFromStorage = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
        const parsed = JSON.parse(item);
        // Basic check to see if it's an array
        return Array.isArray(parsed) ? parsed : fallback;
    }
    return fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
};


export const LegacyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [residents, setResidents] = useState<Resident[]>(() => loadFromStorage('legacy-residents', mockResidents));
  
  const [prompts, setPrompts] = useState<Prompt[]>(() => loadFromStorage('legacy-prompts', mockPrompts));
  
  const [recordings, setRecordings] = useState<Recording[]>(() => {
    const storedRecordings = loadFromStorage<Recording>('legacy-recordings', mockRecordings);
    return storedRecordings.map(rec => ({
      ...rec,
      timestamp: new Date(rec.timestamp),
    }));
  });

  // Effect to save residents to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem('legacy-residents', JSON.stringify(residents));
    } catch(error) {
        console.error("Could not save residents to localStorage", error);
    }
  }, [residents]);


  // Effect to save prompts to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem('legacy-prompts', JSON.stringify(prompts));
    } catch(error) {
        console.error("Could not save prompts to localStorage", error);
    }
  }, [prompts]);

  // Effect to save recordings to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem('legacy-recordings', JSON.stringify(recordings));
    } catch (error) {
        console.error("Could not save recordings to localStorage", error);
    }
  }, [recordings]);

  const addResident = useCallback((newResidentData: Omit<Resident, 'residentId' | 'isStaff'>): Resident => {
    const newResident: Resident = {
      ...newResidentData,
      residentId: `RES-${Date.now()}`,
      isStaff: false,
    };
    setResidents(prev => [newResident, ...prev]);
    return newResident;
  }, []);

  const getResidentById = useCallback((id: string) => {
    // Search both the state and the initial mock data, just in case.
    const allResidents = [...residents, ...mockResidents];
    return allResidents.find(r => r.residentId === id);
  }, [residents]);

  const addRecording = useCallback((newRecordingData: Omit<Recording, 'recordingId' | 'timestamp' | 'aiSummary'>) => {
    const newRecording: Recording = {
      ...newRecordingData,
      recordingId: `VID-${Date.now()}`,
      timestamp: new Date(),
      aiSummary: '',
    };
    setRecordings(prev => [newRecording, ...prev]);
  }, []);
  
  const addPrompt = useCallback((newPromptData: Omit<Prompt, 'promptId'>) => {
    const newPrompt: Prompt = {
      ...newPromptData,
      promptId: `P-${Date.now()}`,
    };
    setPrompts(prev => [newPrompt, ...prev]);
  }, []);

  const updateRecording = useCallback((updatedRecording: Recording) => {
    setRecordings(prev => prev.map(r => (r.recordingId === updatedRecording.recordingId ? updatedRecording : r)));
  }, []);

  const value = useMemo(() => ({
    residents,
    prompts,
    recordings,
    getResidentById,
    addRecording,
    updateRecording,
    addPrompt,
    addResident,
  }), [residents, prompts, recordings, getResidentById, addRecording, updateRecording, addPrompt, addResident]);

  return <LegacyDataContext.Provider value={value}>{children}</LegacyDataContext.Provider>;
};

export const useLegacyData = (): LegacyDataContextType => {
  const context = useContext(LegacyDataContext);
  if (context === undefined) {
    throw new Error('useLegacyData must be used within a LegacyDataProvider');
  }
  return context;
};