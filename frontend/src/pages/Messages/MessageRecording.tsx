import React, { useState, useRef, useEffect } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Divider,
  Slider,
  Tooltip
} from '@mui/material';
import {
  Mic,
  MicOff,
  Stop,
  PlayArrow,
  Pause,
  Save,
  ArrowBack,
  Schedule,
  Template,
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  VolumeUp,
  VolumeOff,
  Speed,
  Delete,
  Edit,
  AutoAwesome,
  Timer,
  RecordVoiceOver,
  Send,
  CalendarToday,
  Notifications,
  Lightbulb
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  suggestedDuration: number;
}

interface MessageFormData {
  title: string;
  recipientName: string;
  recipientEmail: string;
  recipientRelationship: string;
  messageType: string;
  description: string;
  isScheduled: boolean;
  scheduledDate: string;
  scheduledTime: string;
  isPrivate: boolean;
  tags: string[];
}

const MessageRecording: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<MessageFormData>({
    title: '',
    recipientName: '',
    recipientEmail: '',
    recipientRelationship: '',
    messageType: 'personal',
    description: '',
    isScheduled: false,
    scheduledDate: '',
    scheduledTime: '',
    isPrivate: false,
    tags: []
  });

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const messageTypes = [
    { value: 'birthday', label: 'Birthday Message', icon: '🎂' },
    { value: 'anniversary', label: 'Anniversary Message', icon: '💕' },
    { value: 'holiday', label: 'Holiday Message', icon: '🎄' },
    { value: 'daily', label: 'Daily Encouragement', icon: '☀️' },
    { value: 'encouragement', label: 'Words of Encouragement', icon: '💪' },
    { value: 'memory', label: 'Shared Memory', icon: '📸' },
    { value: 'advice', label: 'Life Advice', icon: '💡' },
    { value: 'gratitude', label: 'Thank You', icon: '🙏' },
    { value: 'love', label: 'Love Note', icon: '❤️' },
    { value: 'wisdom', label: 'Words of Wisdom', icon: '🧠' },
    { value: 'personal', label: 'Personal Message', icon: '💬' }
  ];

  const messageTemplates: MessageTemplate[] = [
    {
      id: '1',
      title: 'Birthday Blessings',
      content: "Happy Birthday! On this special day, I want you to know how much joy you bring to my life. May your day be filled with love, laughter, and wonderful memories. You deserve all the happiness in the world!",
      category: 'birthday',
      isFavorite: false,
      suggestedDuration: 30
    },
    {
      id: '2',
      title: 'Anniversary Love',
      content: "Happy Anniversary! Every day with you has been a gift. Thank you for being my partner, my friend, and my love. Here's to many more years together filled with love and laughter.",
      category: 'anniversary',
      isFavorite: false,
      suggestedDuration: 25
    },
    {
      id: '3',
      title: 'Daily Encouragement',
      content: "Good morning! Remember that you are capable of amazing things. Today is a new opportunity to shine and make a difference. I believe in you and I'm cheering you on!",
      category: 'daily',
      isFavorite: false,
      suggestedDuration: 20
    },
    {
      id: '4',
      title: 'Life Advice',
      content: "Always remember that challenges are opportunities in disguise. When life gets tough, that's when you discover your true strength. Trust yourself, stay positive, and keep moving forward.",
      category: 'advice',
      isFavorite: false,
      suggestedDuration: 35
    },
    {
      id: '5',
      title: 'Gratitude Message',
      content: "Thank you for being such an important part of my life. Your kindness, support, and love mean the world to me. I'm so grateful to have you in my life.",
      category: 'gratitude',
      isFavorite: false,
      suggestedDuration: 25
    },
    {
      id: '6',
      title: 'Words of Wisdom',
      content: "Life is not about waiting for the storm to pass, but learning to dance in the rain. Embrace every moment, learn from every experience, and always choose kindness.",
      category: 'wisdom',
      isFavorite: false,
      suggestedDuration: 30
    }
  ];

  const relationships = [
    'Spouse/Partner',
    'Child',
    'Grandchild',
    'Parent',
    'Grandparent',
    'Sibling',
    'Friend',
    'Colleague',
    'Mentor',
    'Student',
    'Other'
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle audio playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Handle audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

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
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      setError('Unable to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
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

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      title: template.title,
      messageType: template.category,
      description: template.content
    }));
    setShowTemplates(false);
  };

  const toggleFavorite = (templateId: string) => {
    // Toggle favorite status - could be saved to localStorage or backend
    console.log('Toggle favorite for template:', templateId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.recipientName.trim()) {
      setError('Please fill in all required fields');
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
      formDataToSend.append('title', formData.title);
      formDataToSend.append('recipientName', formData.recipientName);
      formDataToSend.append('recipientEmail', formData.recipientEmail);
      formDataToSend.append('recipientRelationship', formData.recipientRelationship);
      formDataToSend.append('messageType', formData.messageType);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isScheduled', formData.isScheduled.toString());
      formDataToSend.append('scheduledDate', formData.scheduledDate);
      formDataToSend.append('scheduledTime', formData.scheduledTime);
      formDataToSend.append('isPrivate', formData.isPrivate.toString());
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('audio', audioBlob, 'message.webm');

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
        throw new Error(errorData.error || 'Failed to save message');
      }

      setSuccess('Message saved successfully!');
      setTimeout(() => {
        navigate('/messages/library');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save message');
    } finally {
      setLoading(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    const messageType = messageTypes.find(t => t.value === type);
    return messageType?.icon || '💬';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/messages/library')}
            sx={{ mr: 2, color: '#6366f1' }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: '#fff', mb: 1 }}>
              Record a Message
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
              Create personalized messages for your loved ones
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Recording Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Record Your Message
                </Typography>

                {/* Recording Controls */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  {!audioBlob ? (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
                        Click the record button to start capturing your message
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Mic />}
                          onClick={startRecording}
                          disabled={isRecording}
                          sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            },
                            px: 4,
                            py: 2
                          }}
                        >
                          Start Recording
                        </Button>
                        
                        <Button
                          variant="outlined"
                          startIcon={<Template />}
                          onClick={() => setShowTemplates(true)}
                          sx={{
                            borderColor: '#6366f1',
                            color: '#6366f1',
                            '&:hover': {
                              borderColor: '#8b5cf6',
                              color: '#8b5cf6',
                            }
                          }}
                        >
                          Templates
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Recording Complete
                      </Typography>
                      
                      {/* Timer Display */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h3" sx={{ fontFamily: 'monospace', color: '#6366f1' }}>
                          {formatTime(recordingTime)}
                        </Typography>
                      </Box>

                      {/* Playback Controls */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                        <IconButton
                          onClick={playRecording}
                          sx={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1',
                            '&:hover': {
                              background: 'rgba(99, 102, 241, 0.3)',
                            }
                          }}
                        >
                          {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        
                        <IconButton
                          onClick={deleteRecording}
                          sx={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            '&:hover': {
                              background: 'rgba(239, 68, 68, 0.3)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {/* Playback Settings */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Speed sx={{ fontSize: 20, color: '#a1a1aa' }} />
                          <Slider
                            value={playbackSpeed}
                            onChange={(e, value) => setPlaybackSpeed(value as number)}
                            min={0.5}
                            max={2}
                            step={0.25}
                            sx={{
                              width: 100,
                              '& .MuiSlider-track': { background: '#6366f1' },
                              '& .MuiSlider-thumb': { background: '#6366f1' },
                              '& .MuiSlider-rail': { background: 'rgba(255, 255, 255, 0.2)' }
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#a1a1aa', minWidth: 40 }}>
                            {playbackSpeed}x
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => setIsMuted(!isMuted)}
                            sx={{ color: isMuted ? '#ef4444' : '#a1a1aa' }}
                          >
                            {isMuted ? <VolumeOff /> : <VolumeUp />}
                          </IconButton>
                          <Slider
                            value={volume}
                            onChange={(e, value) => setVolume(value as number)}
                            disabled={isMuted}
                            sx={{
                              width: 100,
                              '& .MuiSlider-track': { background: '#6366f1' },
                              '& .MuiSlider-thumb': { background: '#6366f1' },
                              '& .MuiSlider-rail': { background: 'rgba(255, 255, 255, 0.2)' }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  style={{ display: 'none' }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Message Details Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Message Details
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Message Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '& input': { color: '#fff' },
                        '& label': { color: '#a1a1aa' },
                      }
                    }}
                  />

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Recipient Name"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '& input': { color: '#fff' },
                            '& label': { color: '#a1a1aa' },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#a1a1aa' }}>Relationship</InputLabel>
                        <Select
                          name="recipientRelationship"
                          value={formData.recipientRelationship}
                          onChange={handleSelectChange}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '& .MuiSelect-icon': { color: '#a1a1aa' },
                          }}
                        >
                          {relationships.map((rel) => (
                            <MenuItem key={rel} value={rel}>{rel}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Recipient Email (Optional)"
                    name="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={handleInputChange}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '& input': { color: '#fff' },
                        '& label': { color: '#a1a1aa' },
                      }
                    }}
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ color: '#a1a1aa' }}>Message Type</InputLabel>
                    <Select
                      name="messageType"
                      value={formData.messageType}
                      onChange={handleSelectChange}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '& .MuiSelect-icon': { color: '#a1a1aa' },
                      }}
                    >
                      {messageTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{type.icon}</span>
                            {type.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    name="description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '& textarea': { color: '#fff' },
                        '& label': { color: '#a1a1aa' },
                      }
                    }}
                  />

                  {/* Scheduling Options */}
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isScheduled}
                          onChange={(e) => setFormData(prev => ({ ...prev, isScheduled: e.target.checked }))}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#6366f1',
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#6366f1',
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule sx={{ fontSize: 20 }} />
                          <Typography>Schedule for Later</Typography>
                        </Box>
                      }
                      sx={{ color: '#fff' }}
                    />

                    {formData.isScheduled && (
                      <Fade in timeout={300}>
                        <Box sx={{ mt: 2, p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Date"
                                name="scheduledDate"
                                type="date"
                                value={formData.scheduledDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '& input': { color: '#fff' },
                                    '& label': { color: '#a1a1aa' },
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Time"
                                name="scheduledTime"
                                type="time"
                                value={formData.scheduledTime}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '& input': { color: '#fff' },
                                    '& label': { color: '#a1a1aa' },
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Fade>
                    )}
                  </Box>

                  {/* Privacy Setting */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPrivate}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#6366f1',
                            '&:hover': {
                              backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            },
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#6366f1',
                          },
                        }}
                      />
                    }
                    label="Private Message"
                    sx={{ color: '#fff', mb: 3 }}
                  />

                  {/* Save Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={loading || !audioBlob || !formData.title || !formData.recipientName}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      },
                      py: 1.5
                    }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Save Message'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Message Templates Dialog */}
        <Dialog 
          open={showTemplates} 
          onClose={() => setShowTemplates(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Template sx={{ color: '#fbbf24' }} />
              <Typography variant="h6">
                Message Templates
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            pt: 3
          }}>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
              Choose a template to help you get started with your message
            </Typography>
            
            <Grid container spacing={2}>
              {messageTemplates.map((template) => (
                <Grid item xs={12} key={template.id}>
                  <Paper sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                    }
                  }}
                  onClick={() => handleTemplateSelect(template)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {template.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 2 }}>
                          {template.content}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={template.category}
                            size="small"
                            sx={{
                              background: 'rgba(99, 102, 241, 0.2)',
                              color: '#6366f1'
                            }}
                          />
                          <Chip
                            icon={<Timer />}
                            label={`~${template.suggestedDuration}s`}
                            size="small"
                            sx={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981'
                            }}
                          />
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                        sx={{ color: template.isFavorite ? '#fbbf24' : '#a1a1aa' }}
                      >
                        {template.isFavorite ? <Star /> : <StarBorder />}
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2
          }}>
            <Button 
              onClick={() => setShowTemplates(false)}
              sx={{ color: '#a1a1aa' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MessageRecording; 