import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Fade,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Slider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Mic,
  MicOff,
  Stop,
  PlayArrow,
  Pause,
  Delete,
  Save,
  ArrowBack,
  Lightbulb,
  Category,
  Title,
  Videocam,
  VideocamOff,
  VolumeUp,
  VolumeOff,
  Speed,
  Edit,
  AutoAwesome,
  Star,
  StarBorder,
  Timer,
  RecordVoiceOver,
  Subtitles,
  CloudUpload
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore, MediaType } from '../../store';
import { useAuth } from '../../contexts/AuthContext';

interface RecordingPrompt {
  id: string;
  text: string;
  category: string;
  isFavorite: boolean;
}

const StoryRecording: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [recordMode, setRecordMode] = useState<MediaType>('audio');
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<RecordingPrompt | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Zustand store
  const setCurrentMedia = useAppStore(s => s.setCurrentMedia);
  const clearCurrentMedia = useAppStore(s => s.clearCurrentMedia);

  const categories = [
    'Family & Childhood',
    'Career & Work',
    'Love & Relationships',
    'Travel Adventures',
    'Life Lessons',
    'Historical Events',
    'Personal Achievements',
    'Friendships',
    'Hobbies & Interests',
    'Life Milestones',
    'Health & Wellness',
    'Education & Learning',
    'Community & Service',
    'Spiritual & Faith',
    'Humor & Laughter'
  ];

  const recordingPrompts: RecordingPrompt[] = [
    { id: '1', text: "Tell me about your first job and what you learned from it", category: 'Career & Work', isFavorite: false },
    { id: '2', text: "Share a story about your childhood that shaped who you are", category: 'Family & Childhood', isFavorite: false },
    { id: '3', text: "Describe the moment you met your spouse or partner", category: 'Love & Relationships', isFavorite: false },
    { id: '4', text: "What's the most adventurous thing you've ever done?", category: 'Travel Adventures', isFavorite: false },
    { id: '5', text: "Tell me about a time when you had to overcome a challenge", category: 'Life Lessons', isFavorite: false },
    { id: '6', text: "Share a story about your family traditions", category: 'Family & Childhood', isFavorite: false },
    { id: '7', text: "What's the best advice you've ever received?", category: 'Life Lessons', isFavorite: false },
    { id: '8', text: "Describe a place that holds special meaning for you", category: 'Travel Adventures', isFavorite: false },
    { id: '9', text: "Tell me about a friendship that lasted a lifetime", category: 'Friendships', isFavorite: false },
    { id: '10', text: "What hobby or interest has brought you the most joy?", category: 'Hobbies & Interests', isFavorite: false },
    { id: '11', text: "Share a story about a historical event you lived through", category: 'Historical Events', isFavorite: false },
    { id: '12', text: "What achievement are you most proud of?", category: 'Personal Achievements', isFavorite: false }
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

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

  const startVideoRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      setVideoStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      };

      setVideoRecorder(mediaRecorder);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      setError('Unable to access camera/microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      if (recordMode === 'audio' && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      } else if (recordMode === 'video' && videoRecorder) {
        videoRecorder.stop();
      }
      
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordMode === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (recordMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (recordMode === 'audio') {
      setAudioBlob(null);
      setAudioUrl('');
    } else {
      setVideoBlob(null);
      setVideoUrl('');
    }
    setRecordingTime(0);
    setTranscription('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribe = async () => {
    if (!audioBlob && !videoBlob) {
      setError('No recording to transcribe');
      return;
    }

    setIsTranscribing(true);
    setError('');

    try {
      const formData = new FormData();
      const blob = recordMode === 'audio' ? audioBlob : videoBlob;
      formData.append('audio', blob!);
      formData.append('language', 'en');

      const response = await fetch('/api/stories/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setTranscription(data.transcription);
        setSuccess('Transcription completed successfully!');
      } else {
        setError('Transcription failed. Please try again.');
      }
    } catch (error) {
      setError('Transcription service unavailable. Please try again later.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSave = async () => {
    if (!title || !category || (!audioBlob && !videoBlob)) {
      setError('Please fill in all required fields and record your story.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('transcription', transcription);
      formData.append('mediaType', recordMode);
      
      const blob = recordMode === 'audio' ? audioBlob : videoBlob;
      formData.append('media', blob!);

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setSuccess('Story saved successfully!');
        setTimeout(() => {
          navigate('/stories/library');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save story');
      }
    } catch (error) {
      setError('Failed to save story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt: RecordingPrompt) => {
    setSelectedPrompt(prompt);
    setShowPrompts(false);
    // You could auto-fill the title or description based on the prompt
  };

  const toggleFavorite = (promptId: string) => {
    // Toggle favorite status - could be saved to localStorage or backend
    console.log('Toggle favorite for prompt:', promptId);
  };

  const getCurrentMedia = () => {
    return recordMode === 'audio' ? audioBlob : videoBlob;
  };

  const hasRecording = () => {
    return !!(audioBlob || videoBlob);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/stories/library')}
            sx={{ mr: 2, color: '#6366f1' }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: '#fff', mb: 1 }}>
              Record Your Story
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
              Share your memories and experiences with future generations
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
          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <CardContent sx={{ p: 4 }}>
                {/* Recording Mode Toggle */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recording Mode
                  </Typography>
                  <ToggleButtonGroup
                    value={recordMode}
                    exclusive
                    onChange={(e, newMode) => {
                      if (newMode !== null) {
                        setRecordMode(newMode);
                        deleteRecording(); // Clear any existing recording
                      }
                    }}
                    sx={{
                      '& .MuiToggleButton-root': {
                        color: '#a1a1aa',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: '#fff',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          }
                        }
                      }
                    }}
                  >
                    <ToggleButton value="audio">
                      <Mic sx={{ mr: 1 }} />
                      Audio Only
                    </ToggleButton>
                    <ToggleButton value="video">
                      <Videocam sx={{ mr: 1 }} />
                      Video
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Recording Controls */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  {!hasRecording() ? (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Ready to Record
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
                        Click the record button to start capturing your story
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Mic />}
                          onClick={recordMode === 'audio' ? startRecording : startVideoRecording}
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
                          startIcon={<Lightbulb />}
                          onClick={() => setShowPrompts(true)}
                          sx={{
                            borderColor: '#6366f1',
                            color: '#6366f1',
                            '&:hover': {
                              borderColor: '#8b5cf6',
                              color: '#8b5cf6',
                            }
                          }}
                        >
                          Get Prompts
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

                {/* Hidden Media Elements */}
                {recordMode === 'audio' && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: 'none' }}
                  />
                )}
                
                {recordMode === 'video' && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: 'none' }}
                  />
                )}

                {/* Live Video Preview */}
                {recordMode === 'video' && videoStream && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Live Preview
                    </Typography>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      style={{
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 8,
                        border: '2px solid rgba(99, 102, 241, 0.3)'
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Story Details Section */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Story Details
                </Typography>

                <TextField
                  fullWidth
                  label="Story Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  <InputLabel sx={{ color: '#a1a1aa' }}>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiSelect-icon': { color: '#a1a1aa' },
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

                {/* Transcription Section */}
                {hasRecording() && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        Transcription
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<Subtitles />}
                        onClick={handleTranscribe}
                        disabled={isTranscribing}
                        sx={{
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#6366f1',
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.3)',
                          }
                        }}
                      >
                        {isTranscribing ? <CircularProgress size={16} /> : 'Transcribe'}
                      </Button>
                    </Box>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      placeholder="Transcription will appear here..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '& textarea': { color: '#fff' },
                          '& input::placeholder': { color: '#a1a1aa' },
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Save Button */}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={loading || !hasRecording() || !title || !category}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                    py: 1.5
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Save Story'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recording Prompts Dialog */}
        <Dialog 
          open={showPrompts} 
          onClose={() => setShowPrompts(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb sx={{ color: '#fbbf24' }} />
              <Typography variant="h6">
                Recording Prompts
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            pt: 3
          }}>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
              Choose a prompt to help you get started with your story recording
            </Typography>
            
            <Grid container spacing={2}>
              {recordingPrompts.map((prompt) => (
                <Grid item xs={12} key={prompt.id}>
                  <Paper sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                    }
                  }}
                  onClick={() => handlePromptClick(prompt)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {prompt.text}
                        </Typography>
                        <Chip
                          label={prompt.category}
                          size="small"
                          sx={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1'
                          }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt.id);
                        }}
                        sx={{ color: prompt.isFavorite ? '#fbbf24' : '#a1a1aa' }}
                      >
                        {prompt.isFavorite ? <Star /> : <StarBorder />}
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
              onClick={() => setShowPrompts(false)}
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

export default StoryRecording; 