import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Visibility,
  Hearing,
  Save,
  ZoomIn,
  ZoomOut,
  HighContrast,
  LargeText
} from '@mui/icons-material';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const Accessibility = () => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    fontSize: 16,
    volume: 50,
    autoPlay: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { updateSettings } = useAccessibility();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      }
    } catch (err) {
      console.error('Failed to load accessibility settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    
    // Apply settings immediately
    applySettings(newSettings);
  };

  const applySettings = (newSettings) => {
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

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save to localStorage
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
      
      // Update context
      if (updateSettings) {
        updateSettings(settings);
      }

      setSuccess('Accessibility settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save accessibility settings');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reducedMotion: false,
      fontSize: 16,
      volume: 50,
      autoPlay: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Accessibility Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Visual Settings */}
          <Typography variant="h6" gutterBottom>
            Visual Settings
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.highContrast}
                        onChange={(e) => handleChange('highContrast', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HighContrast sx={{ mr: 1 }} />
                        High Contrast
                      </Box>
                    }
                  />
                  <Typography variant="body2" color="text.secondary">
                    Increase contrast for better visibility
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.largeText}
                        onChange={(e) => handleChange('largeText', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LargeText sx={{ mr: 1 }} />
                        Large Text
                      </Box>
                    }
                  />
                  <Typography variant="body2" color="text.secondary">
                    Increase text size for easier reading
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom>
            Font Size
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ZoomOut sx={{ mr: 2 }} />
            <Slider
              value={settings.fontSize}
              onChange={(e, value) => handleChange('fontSize', value)}
              min={12}
              max={24}
              step={1}
              marks
              valueLabelDisplay="auto"
              sx={{ flex: 1, mx: 2 }}
            />
            <ZoomIn sx={{ ml: 2 }} />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Motion Settings */}
          <Typography variant="h6" gutterBottom>
            Motion Settings
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.reducedMotion}
                    onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                    color="primary"
                  />
                }
                label="Reduce Motion"
              />
              <Typography variant="body2" color="text.secondary">
                Reduce animations and transitions for users with motion sensitivity
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          {/* Audio Settings */}
          <Typography variant="h6" gutterBottom>
            Audio Settings
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Volume Level
              </Typography>
              <Slider
                value={settings.volume}
                onChange={(e, value) => handleChange('volume', value)}
                min={0}
                max={100}
                step={5}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoPlay}
                        onChange={(e) => handleChange('autoPlay', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Auto-play Audio"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Automatically play audio content
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Screen Reader */}
          <Typography variant="h6" gutterBottom>
            Screen Reader Support
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.screenReader}
                    onChange={(e) => handleChange('screenReader', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Screen Reader Mode"
              />
              <Typography variant="body2" color="text.secondary">
                Optimize interface for screen reader compatibility
              </Typography>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : 'Save Settings'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Accessibility; 