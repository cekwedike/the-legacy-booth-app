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
  SelectChangeEvent,
  Grid,
  useTheme,
  Chip,
  Paper
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  Pause,
  Save,
  ArrowBack,
  Person,
  Category,
  Description,
  Timer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

const MessageRecording: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    recipientName: '',
    messageType: 'personal' as const,
    description: ''
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // Zustand store
  const addMessage = useAppStore(s => s.addMessage);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      setRecordingTime(0);
      setError('');

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store timer reference
      (recorder as any).timer = timer;
    } catch {
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      // Clear timer
      if ((mediaRecorder as any).timer) {
        clearInterval((mediaRecorder as any).timer);
      }
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
      // Add message to store
      const newMessage = {
        _id: Date.now().toString(),
        recipientName: formData.recipientName,
        messageType: formData.messageType,
        description: formData.description,
        recording: {
          audioUrl: audioUrl,
          duration: recordingTime,
          fileSize: audioBlob.size
        },
        status: 'published' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addMessage(newMessage);
      navigate('/messages/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/messages/library')} 
            sx={{ 
              mr: 2,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              '&:hover': {
                background: 'rgba(16, 185, 129, 0.1)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Record a Message
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Share your thoughts and feelings with loved ones
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Recording Section */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              height: 'fit-content',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: theme.palette.mode === 'dark'
                ? '1.5px solid rgba(16,185,129,0.3)'
                : '1.5px solid rgba(16,185,129,0.18)',
              color: theme.palette.text.primary,
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: isRecording 
                      ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    mb: 3,
                    boxShadow: isRecording 
                      ? '0 0 30px rgba(220, 38, 38, 0.5)'
                      : '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
                    animation: isRecording ? 'pulse 2s infinite' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                  >
                    <Mic sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {isRecording ? 'Recording...' : 'Ready to Record'}
                  </Typography>
                  {isRecording && (
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                      {formatTime(recordingTime)}
                    </Typography>
                  )}
                  {/* Recording Controls */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                    {!isRecording && !audioBlob && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Mic />}
                        onClick={startRecording}
                        sx={{
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                          },
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Start Recording
                      </Button>
                    )}
                    {isRecording && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Stop />}
                        onClick={stopRecording}
                        sx={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                          },
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Stop Recording
                      </Button>
                    )}
                    {audioBlob && !isRecording && (
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                          onClick={playRecording}
                          sx={{
                            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                            },
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600
                          }}
                        >
                          {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<Mic />}
                          onClick={startRecording}
                          sx={{
                            borderColor: '#10b981',
                            color: '#10b981',
                            '&:hover': {
                              borderColor: '#059669',
                              background: 'rgba(16, 185, 129, 0.1)',
                            },
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600
                          }}
                        >
                          Record Again
                        </Button>
                      </>
                    )}
                  </Box>
                  {audioBlob && (
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      style={{ display: 'none' }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Message Details */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              height: 'fit-content',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: theme.palette.mode === 'dark'
                ? '1.5px solid rgba(16,185,129,0.3)'
                : '1.5px solid rgba(16,185,129,0.18)',
              color: theme.palette.text.primary,
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Message Details
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                    Recipient Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="Who is this message for?"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                    }}
                  />

                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                    Message Type
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <Select
                      name="messageType"
                      value={formData.messageType}
                      onChange={handleSelectChange}
                      startAdornment={<Category sx={{ color: 'text.secondary', mr: 1 }} />}
                    >
                      {messageTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                    Description (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    placeholder="Add a brief description of your message..."
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <Description sx={{ color: 'text.secondary', mr: 1, mt: 1 }} />
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={!formData.recipientName || !audioBlob || loading}
                    sx={{
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(5, 150, 105, 0.5)',
                      },
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Message'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MessageRecording; 