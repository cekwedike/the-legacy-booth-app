import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilitySettings, AccessibilityContextType } from '../types';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  screenReader: false,
  reducedMotion: false,
  fontSize: 16,
  volume: 50,
  autoPlay: false
};

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const loadSettings = (): void => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  };

  const applySettings = (newSettings: AccessibilitySettings): void => {
    // Apply high contrast
    if (newSettings.highContrast) {
      document.body.style.filter = 'contrast(150%)';
    } else {
      document.body.style.filter = 'none';
    }

    // Apply large text
    if (newSettings.largeText) {
      document.body.style.fontSize = '18px';
    } else {
      document.body.style.fontSize = '16px';
    }

    // Apply custom font size
    document.body.style.fontSize = `${newSettings.fontSize}px`;

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      document.body.style.setProperty('--reduced-motion', 'reduce');
    } else {
      document.body.style.setProperty('--reduced-motion', 'no-preference');
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>): void => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  };

  const value: AccessibilityContextType = {
    settings,
    updateSettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}; 