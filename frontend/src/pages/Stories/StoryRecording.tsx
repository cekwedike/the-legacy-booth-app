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
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  Pause,
  Delete,
  Save,
  ArrowBack,
  Lightbulb,
  Category,
  Title
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore, MediaType } from '../../store';

const StoryRecording: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isTranscribing] = useState<boolean>(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [customPromptCategories, setCustomPromptCategories] = useState<{ [prompt: string]: string }>({});
  const [newPromptCategory, setNewPromptCategory] = useState('Family & Childhood');
  const [customPromptDialogOpen, setCustomPromptDialogOpen] = useState(false);
  const [recordMode, setRecordMode] = useState<MediaType>('audio');
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
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
    'Life Milestones'
  ];

  const recordingPrompts = [
    "Tell me about your first job and what you learned from it",
    "Share a story about your childhood that shaped who you are",
    "Describe the moment you met your spouse or partner",
    "What's the most adventurous thing you've ever done?",
    "Tell me about a time when you had to overcome a challenge",
    "Share a story about your family traditions",
    "What's the best advice you've ever received?",
    "Describe a place that holds special meaning for you"
  ];

  const allPrompts = [...recordingPrompts.slice(0, 4), ...customPrompts];
  const allCategories = [...categories, ...customCategories];

  // Map built-in prompts to categories
  const promptCategoryMap: { [prompt: string]: string } = {
    "Tell me about your first job and what you learned from it": "Career & Work",
    "Share a story about your childhood that shaped who you are": "Family & Childhood",
    "Describe the moment you met your spouse or partner": "Love & Relationships",
    "What's the most adventurous thing you've ever done?": "Travel Adventures",
    "Tell me about a time when you had to overcome a challenge": "Life Lessons",
    "Share a story about your family traditions": "Family & Childhood",
    "What's the best advice you've ever received?": "Life Lessons",
    "Describe a place that holds special meaning for you": "Travel Adventures",
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
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
    } catch {
      setError('Unable to access microphone. Please check permissions.');
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
    setTranscription('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!title || !category || !audioBlob) {
      setError('Please fill in all required fields and record your story.');
      return;
    }

    setError('');
    setSuccess('Story saved successfully!');
    
    // Simulate API call
    setTimeout(() => {
      navigate('/stories/library');
    }, 2000);
  };

  const handlePromptClick = (prompt: string) => {
    setTitle(prompt);
    // Set category based on prompt
    const cat = promptCategoryMap[prompt] || customPromptCategories[prompt] || categories[0];
    setCategory(cat);
  };

  const handleAddPrompt = () => {
    if (newPrompt.trim() && !customPrompts.includes(newPrompt.trim())) {
      setCustomPrompts([newPrompt.trim(), ...customPrompts]);
      setCustomPromptCategories({ ...customPromptCategories, [newPrompt.trim()]: newPromptCategory });
      setNewPrompt('');
      setNewPromptCategory(categories[0]);
      setCustomPromptDialogOpen(false);
    }
  };

  const handleDeletePrompt = (prompt: string) => {
    setCustomPrompts(customPrompts.filter(p => p !== prompt));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      setCustomCategories([newCategory.trim(), ...customCategories]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    setCustomCategories(customCategories.filter(c => c !== cat));
  };

  // Video recording handlers
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        setCurrentMedia({ type: 'video', blob, url: URL.createObjectURL(blob) });
        stream.getTracks().forEach(track => track.stop());
      };
      setVideoRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch {
      setError('Unable to access webcam. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorder && isRecording) {
      videoRecorder.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const deleteVideoRecording = () => {
    setVideoBlob(null);
    setVideoUrl('');
    clearCurrentMedia();
    setRecordingTime(0);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/stories/library')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Record Your Story
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share your memories and experiences with future generations
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Recording Section */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              height: 'fit-content',
              background: 'linear-gradient(135deg, #23234a 0%, #181826 100%)',
              border: '1.5px solid rgba(99,102,241,0.18)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={recordMode === 'video'}
                        onChange={(_, checked) => setRecordMode(checked ? 'video' : 'audio')}
                        color="primary"
                      />
                    }
                    label={recordMode === 'video' ? 'Video Mode' : 'Audio Mode'}
                  />
                </Box>

                {recordMode === 'audio' ? (
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: isRecording 
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf8 100%)',
                      color: 'white',
                      mb: 3,
                      boxShadow: isRecording 
                        ? '0 0 30px rgba(239, 68, 68, 0.5)'
                        : '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
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
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        {formatTime(recordingTime)}
                      </Typography>
                    )}
                    {/* Audio Recording Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                      {!isRecording && !audioBlob && (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Mic />}
                          onClick={startRecording}
                          sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
                            startIcon={<Delete />}
                            onClick={deleteRecording}
                            sx={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': {
                                borderColor: '#dc2626',
                                background: 'rgba(239, 68, 68, 0.1)',
                              },
                              px: 4,
                              py: 1.5,
                              borderRadius: 3,
                              fontWeight: 600
                            }}
                          >
                            Delete
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
                ) : (
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 120, borderRadius: 4, background: 'rgba(30,30,50,0.7)', color: 'white', mb: 3, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)', animation: isRecording ? 'pulse 2s infinite' : 'none', cursor: 'pointer', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}>
                      <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', borderRadius: 4, objectFit: 'cover', background: '#181826' }} src={videoUrl || undefined} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {isRecording ? 'Recording Video...' : 'Ready to Record Video'}
                    </Typography>
                    {isRecording && (
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        {formatTime(recordingTime)}
                      </Typography>
                    )}
                    {/* Video Recording Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                      {!isRecording && !videoBlob && (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Mic />}
                          onClick={startVideoRecording}
                          sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }, px: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
                        >
                          Start Video Recording
                        </Button>
                      )}
                      {isRecording && (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<Stop />}
                          onClick={stopVideoRecording}
                          sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', '&:hover': { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }, px: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
                        >
                          Stop Recording
                        </Button>
                      )}
                      {videoBlob && !isRecording && (
                        <>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrow />}
                            onClick={() => videoRef.current && videoRef.current.play()}
                            sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }, px: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
                          >
                            Play
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Delete />}
                            onClick={deleteVideoRecording}
                            sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' }, px: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Transcription Progress */}
                {isTranscribing && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Transcribing your story...
                    </Typography>
                    <LinearProgress 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        background: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Transcription Display */}
                {transcription && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Transcription
                    </Typography>
                    <Paper sx={{ p: 3, background: 'rgba(99, 102, 241, 0.05)' }}>
                      <Typography variant="body1">
                        {transcription}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Story Details */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              height: 'fit-content',
              background: 'linear-gradient(135deg, #23234a 0%, #181826 100%)',
              border: '1.5px solid rgba(99,102,241,0.18)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Story Details
                </Typography>

                <TextField
                  fullWidth
                  label="Story Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <Title sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    startAdornment={<Category sx={{ color: 'text.secondary', mr: 1 }} />}
                  >
                    {allCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                        {customCategories.includes(cat) && (
                          <IconButton size="small" onClick={e => { e.stopPropagation(); handleDeleteCategory(cat); }} sx={{ ml: 1 }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                  }}
                >
                  <TextField
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Add custom category"
                    size="small"
                    sx={{
                      flex: 1,
                      background: 'rgba(30,30,50,0.7)',
                      borderRadius: 2,
                      input: { color: '#fff' },
                      minWidth: 0,
                    }}
                    InputProps={{
                      sx: { color: '#fff' },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    sx={{ borderRadius: 2, mt: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
                  >
                    Add
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={!title || !category || !audioBlob}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(99, 102, 241, 0.5)',
                    },
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Save Story
                </Button>
              </CardContent>
            </Card>

            {/* Recording Prompts */}
            <Card sx={{ 
              mt: 3,
              background: 'linear-gradient(135deg, #23234a 0%, #181826 100%)',
              border: '1.5px solid rgba(99,102,241,0.18)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Lightbulb sx={{ color: '#f59e0b', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Story Prompts
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Need inspiration? Try one of these prompts or add your own:
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    mb: 2,
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}
                >
                  {allPrompts.map((prompt, index) => (
                    <Chip
                      key={prompt}
                      label={prompt}
                      variant="outlined"
                      onClick={() => handlePromptClick(prompt)}
                      sx={{
                        mb: 1.5,
                        px: 1.5,
                        py: 1.2,
                        fontSize: '0.95rem',
                        background: 'rgba(99,102,241,0.08)',
                        color: '#fff',
                        borderColor: 'rgba(99,102,241,0.3)',
                        cursor: 'pointer',
                        maxWidth: 320,
                        minWidth: 0,
                        textAlign: 'left',
                        height: 'auto',
                        minHeight: 32,
                        display: 'flex',
                        alignItems: 'center',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-line',
                        '& .MuiChip-label': {
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          textAlign: 'left',
                          width: '100%',
                          display: 'block',
                          boxSizing: 'border-box',
                        },
                        '&:hover': {
                          borderColor: '#6366f1',
                          background: 'rgba(99,102,241,0.18)',
                        },
                      }}
                      onDelete={index >= 4 ? () => handleDeletePrompt(prompt) : undefined}
                    />
                  ))}
                </Box>

                {/* Add Custom Prompt Button */}
                <Button
                  variant="outlined"
                  onClick={() => setCustomPromptDialogOpen(true)}
                  sx={{ mb: 2, width: { xs: '100%', sm: 'auto' } }}
                >
                  Add Custom Prompt
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}
      </Box>

      {/* Custom Prompt Dialog */}
      <Dialog
        open={customPromptDialogOpen}
        onClose={() => setCustomPromptDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="custom-prompt-dialog-title"
      >
        <DialogTitle id="custom-prompt-dialog-title">Add Custom Prompt</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            value={newPrompt}
            onChange={e => setNewPrompt(e.target.value)}
            placeholder="Enter your custom prompt"
            size="small"
            fullWidth
            autoFocus
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newPromptCategory}
              label="Category"
              onChange={e => setNewPromptCategory(e.target.value as string)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomPromptDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddPrompt} variant="contained" disabled={!newPrompt.trim()}>Add</Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Container>
  );
};

export default StoryRecording; 