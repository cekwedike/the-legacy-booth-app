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
  IconButton,
  SelectChangeEvent
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
import { MessageFormData } from '../../types';

const MessageRecording: React.FC = () => {
  const [formData, setFormData] = useState<MessageFormData>({
    recipientName: '',
    messageType: 'personal',
    description: ''
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  const messageTypes = [
    { value: 'personal', label: 'Personal Message' },
    { value: 'birthday', label: 'Birthday Message' },
    { value: 'anniversary', label: 'Anniversary Message' },
    { value: 'holiday', label: 'Holiday Message' },
    { value: 'advice', label: 'Advice' },
    { value: 'memory', label: 'Memory' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
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
    
    if (!formData.recipientName.trim()) {
      setError('Please enter the recipient name');
      return;
    }

    if (!audioBlob) {
      setError('Please record your message first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('recipientName', formData.recipientName);
      formDataToSend.append('messageType', formData.messageType);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('audio', audioBlob, 'message.wav');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save message');
      }

      navigate('/messages/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save message');
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
            Record a Message
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
                label="Recipient Name"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                margin="normal"
                required
                variant="outlined"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Message Type</InputLabel>
                <Select
                  name="messageType"
                  value={formData.messageType}
                  label="Message Type"
                  onChange={handleSelectChange}
                >
                  {messageTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                  {loading ? 'Saving...' : 'Save Message'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MessageRecording; 