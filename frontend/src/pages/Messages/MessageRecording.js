import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  Pause,
  Save,
  Delete,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const MessageRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [messageType, setMessageType] = useState('personal');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const { user } = useAuth();

  const messageTypes = [
    { value: 'personal', label: 'Personal Message' },
    { value: 'birthday', label: 'Birthday Wish' },
    { value: 'anniversary', label: 'Anniversary Message' },
    { value: 'holiday', label: 'Holiday Greeting' },
    { value: 'advice', label: 'Words of Wisdom' },
    { value: 'memory', label: 'Shared Memory' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSave = async () => {
    if (!recipientName.trim()) {
      setError('Please enter the recipient\'s name');
      return;
    }

    if (!audioBlob) {
      setError('Please record a message before saving');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('recipientName', recipientName);
      formData.append('messageType', messageType);
      formData.append('description', description);
      formData.append('audio', audioBlob, 'message.wav');

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save message');
      }

      setSuccess('Message saved successfully!');
      setRecipientName('');
      setMessageType('personal');
      setDescription('');
      setAudioBlob(null);
      setAudioUrl(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save message');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecipientName('');
    setMessageType('personal');
    setDescription('');
    setError('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Record a Message
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
          <TextField
            fullWidth
            label="Recipient's Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            startIcon={<Person />}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Message Type</InputLabel>
            <Select
              value={messageType}
              label="Message Type"
              onChange={(e) => setMessageType(e.target.value)}
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
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            variant="outlined"
            placeholder="Add context about this message..."
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {!isRecording ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Mic />}
                onClick={startRecording}
                size="large"
              >
                Start Recording
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Stop />}
                onClick={stopRecording}
                size="large"
              >
                Stop Recording
              </Button>
            )}
          </Box>

          {audioUrl && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Message Preview
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton
                    onClick={isPlaying ? pauseAudio : playAudio}
                    color="primary"
                    size="large"
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: 'none' }}
                  />
                  
                  <Typography variant="body2" color="text.secondary">
                    Click to {isPlaying ? 'pause' : 'play'} your message
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Save Message'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                  >
                    Delete Recording
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Record a special message for your loved ones. These messages can be played 
              on special occasions or whenever they need to hear your voice.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MessageRecording; 