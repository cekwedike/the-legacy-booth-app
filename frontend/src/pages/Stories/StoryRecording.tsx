import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  Pause,
  Save,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { StoryFormData } from '../../types';

const StoryRecording: React.FC = () => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    description: '',
    category: ''
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  const categories = [
    'Childhood Memories',
    'Family Stories',
    'Career & Work',
    'Life Lessons',
    'Historical Events',
    'Travel Adventures',
    'Love & Relationships',
    'Hobbies & Interests',
    'Challenges Overcome',
    'Wisdom & Advice'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setAudioChunks(chunks);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title for your story');
      return;
    }

    if (!audioBlob) {
      setError('Please record your story first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('category', formData.category || '');
      formDataToSend.append('audio', audioBlob, 'story.wav');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save story');
      }

      navigate('/stories/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Record Your Story
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Story Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                margin="normal"
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                variant="outlined"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recording
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {!isRecording ? (
                    <Button
                      variant="contained"
                      startIcon={<Mic />}
                      onClick={startRecording}
                      disabled={loading}
                    >
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Stop />}
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  )}

                  {audioUrl && (
                    <Button
                      variant="outlined"
                      startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                      onClick={playRecording}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                  )}
                </Box>

                {audioUrl && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: 'none' }}
                  />
                )}

                {isRecording && (
                  <Alert severity="info">
                    Recording in progress... Speak clearly and take your time.
                  </Alert>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading || !audioBlob}
                >
                  {loading ? 'Saving...' : 'Save Story'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default StoryRecording; 