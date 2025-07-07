import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [audioEnabled, setAudioEnabled] = useState(() => {
    return localStorage.getItem('audioEnabled') !== 'false';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('reducedMotion') === 'true';
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('audioEnabled', audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('reducedMotion', reducedMotion);
  }, [reducedMotion]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // Apply high contrast to document
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Apply reduced motion to document
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const updateFontSize = (size) => {
    setFontSize(size);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const resetPreferences = () => {
    setFontSize('medium');
    setTheme('light');
    setAudioEnabled(true);
    setHighContrast(false);
    setReducedMotion(false);
  };

  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'small':
        return 0.875;
      case 'large':
        return 1.2;
      default:
        return 1;
    }
  };

  const value = {
    fontSize,
    theme,
    audioEnabled,
    highContrast,
    reducedMotion,
    updateFontSize,
    updateTheme,
    toggleAudio,
    toggleHighContrast,
    toggleReducedMotion,
    resetPreferences,
    getFontSizeMultiplier,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 