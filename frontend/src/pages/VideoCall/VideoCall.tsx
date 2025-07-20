import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper
} from '@mui/material';
import {
  Call,
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  People,
  Settings,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  MoreVert,
  Phone,
  PhoneDisabled,
  CameraAlt,
  RecordVoiceOver,
  Share,
  Close,
  Add,
  Remove,
  ArrowBack,
  ExpandMore,
  PersonAdd,
  Edit,
  Delete,
  AccessTime,
  CallMade,
  CallReceived,
  CallMissed
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  isCalling: boolean;
  email?: string;
  phone?: string;
}

interface CallHistory {
  id: string;
  contactName: string;
  contactAvatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  date: string;
  status: 'completed' | 'missed' | 'declined';
}

interface CallSettings {
  defaultCamera: string;
  defaultMicrophone: string;
  defaultSpeaker: string;
  autoMute: boolean;
  autoVideo: boolean;
  callQuality: 'low' | 'medium' | 'high';
  echoCancellation: boolean;
  noiseSuppression: boolean;
}

const VideoCall: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Video call states
  const [isInCall, setIsInCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showContacts, setShowContacts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [error, setError] = useState<string>('');

  // Form states
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const [callSettings, setCallSettings] = useState<CallSettings>({
    defaultCamera: 'Front Camera',
    defaultMicrophone: 'Built-in Microphone',
    defaultSpeaker: 'Built-in Speaker',
    autoMute: false,
    autoVideo: true,
    callQuality: 'high',
    echoCancellation: true,
    noiseSuppression: true
  });

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // Mock contacts
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/mock-avatar-1.jpg',
      status: 'online',
      isCalling: false,
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/mock-avatar-2.jpg',
      status: 'online',
      isCalling: false,
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678'
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: '/mock-avatar-3.jpg',
      status: 'busy',
      isCalling: false,
      email: 'emma.davis@email.com',
      phone: '+1 (555) 345-6789'
    },
    {
      id: '4',
      name: 'David Wilson',
      avatar: '/mock-avatar-4.jpg',
      status: 'offline',
      isCalling: false,
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890'
    }
  ]);

  // Mock call history
  const [callHistory, setCallHistory] = useState<CallHistory[]>([
    {
      id: '1',
      contactName: 'Sarah Johnson',
      contactAvatar: '/mock-avatar-1.jpg',
      type: 'outgoing',
      duration: 1250,
      date: '2024-01-20T14:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      contactName: 'Michael Chen',
      contactAvatar: '/mock-avatar-2.jpg',
      type: 'incoming',
      duration: 0,
      date: '2024-01-19T16:45:00Z',
      status: 'missed'
    },
    {
      id: '3',
      contactName: 'Emma Davis',
      contactAvatar: '/mock-avatar-3.jpg',
      type: 'outgoing',
      duration: 890,
      date: '2024-01-18T10:15:00Z',
      status: 'completed'
    },
    {
      id: '4',
      contactName: 'David Wilson',
      contactAvatar: '/mock-avatar-4.jpg',
      type: 'incoming',
      duration: 0,
      date: '2024-01-17T09:20:00Z',
      status: 'declined'
    }
  ]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCallDuration = (seconds: number) => {
    if (seconds === 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCallDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
      }
    } catch (err) {
      setError('Unable to access camera and microphone. Please check permissions.');
    }
  };

  const stopLocalVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const handleStartCall = async (contact: Contact) => {
    setSelectedContact(contact);
    setCallStatus('connecting');
    setIsInCall(true);
    
    try {
      await startLocalVideo();
      setCallStatus('connected');
      setIsCallActive(true);
      setCallDuration(0);
    } catch (err) {
      setCallStatus('ended');
      setError('Failed to start video call');
    }
  };

  const handleEndCall = () => {
    stopLocalVideo();
    setIsInCall(false);
    setIsCallActive(false);
    setCallStatus('ended');
    
    // Add to call history
    if (selectedContact && callDuration > 0) {
      const newCall: CallHistory = {
        id: Date.now().toString(),
        contactName: selectedContact.name,
        contactAvatar: selectedContact.avatar,
        type: 'outgoing',
        duration: callDuration,
        date: new Date().toISOString(),
        status: 'completed'
      };
      setCallHistory(prev => [newCall, ...prev]);
    }
    
    setCallDuration(0);
    setSelectedContact(null);
    setError('');
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'busy':
        return 'warning';
      case 'offline':
        return 'default';
      default:
        return 'default';
    }
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'outgoing':
        return <CallMade sx={{ color: '#10b981' }} />;
      case 'incoming':
        return <CallReceived sx={{ color: '#3b82f6' }} />;
      case 'missed':
        return <CallMissed sx={{ color: '#ef4444' }} />;
      default:
        return <CallMade />;
    }
  };

  const handleAddContact = () => {
    if (newContact.name.trim()) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        avatar: '/mock-avatar-default.jpg',
        status: 'offline',
        isCalling: false,
        email: newContact.email || undefined,
        phone: newContact.phone || undefined
      };
      setContacts(prev => [contact, ...prev]);
      setNewContact({ name: '', email: '', phone: '' });
      setShowAddContact(false);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  if (isInCall) {
    return (
      <Container maxWidth={false} sx={{ p: 0, height: '100vh', maxWidth: '100%' }}>
        <Box sx={{ 
          height: '100vh', 
          background: theme.palette.mode === 'dark' ? '#000' : '#1a1a1a',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Remote Video (Main) */}
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                background: '#1a1a1a'
              }}
            />
            
            {/* Call Status Overlay */}
            <Box sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={selectedContact?.avatar}
                  sx={{ width: 40, height: 40, border: '2px solid #10b981' }}
                />
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {selectedContact?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {callStatus === 'connected' ? formatTime(callDuration) : 'Connecting...'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setShowSettings(true)}
                  sx={{ color: 'white', background: 'rgba(0,0,0,0.3)' }}
                >
                  <Settings />
                </IconButton>
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{ color: 'white', background: 'rgba(0,0,0,0.3)' }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Box>
            </Box>

            {/* Local Video (Picture-in-Picture) */}
            <Box sx={{
              position: 'absolute',
              top: 100,
              right: 20,
              width: 200,
              height: 150,
              borderRadius: 2,
              overflow: 'hidden',
              border: '2px solid #10b981',
              zIndex: 10
            }}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>

            {/* Call Controls */}
            <Box sx={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 2,
              zIndex: 10
            }}>
              <IconButton
                onClick={toggleMute}
                sx={{
                  width: 60,
                  height: 60,
                  background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    background: isMuted ? '#dc2626' : 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </IconButton>

              <IconButton
                onClick={handleEndCall}
                sx={{
                  width: 70,
                  height: 70,
                  background: '#ef4444',
                  color: 'white',
                  '&:hover': {
                    background: '#dc2626',
                  }
                }}
              >
                <CallEnd />
              </IconButton>

              <IconButton
                onClick={toggleVideo}
                sx={{
                  width: 60,
                  height: 60,
                  background: !isVideoOn ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    background: !isVideoOn ? '#dc2626' : 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                {!isVideoOn ? <VideocamOff /> : <Videocam />}
              </IconButton>

              <IconButton
                onClick={toggleScreenShare}
                sx={{
                  width: 60,
                  height: 60,
                  background: isScreenSharing ? '#10b981' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    background: isScreenSharing ? '#059669' : 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Settings Dialog */}
        <Dialog 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Call Settings</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure your video call preferences and device settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Camera</InputLabel>
                  <Select
                    value={callSettings.defaultCamera}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, defaultCamera: e.target.value }))}
                    label="Camera"
                  >
                    <MenuItem value="Front Camera">Front Camera</MenuItem>
                    <MenuItem value="Back Camera">Back Camera</MenuItem>
                    <MenuItem value="External Camera">External Camera</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Microphone</InputLabel>
                  <Select
                    value={callSettings.defaultMicrophone}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, defaultMicrophone: e.target.value }))}
                    label="Microphone"
                  >
                    <MenuItem value="Built-in Microphone">Built-in Microphone</MenuItem>
                    <MenuItem value="External Microphone">External Microphone</MenuItem>
                    <MenuItem value="Bluetooth Headset">Bluetooth Headset</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Speaker</InputLabel>
                  <Select
                    value={callSettings.defaultSpeaker}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, defaultSpeaker: e.target.value }))}
                    label="Speaker"
                  >
                    <MenuItem value="Built-in Speaker">Built-in Speaker</MenuItem>
                    <MenuItem value="External Speaker">External Speaker</MenuItem>
                    <MenuItem value="Bluetooth Headset">Bluetooth Headset</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Call Quality</InputLabel>
                  <Select
                    value={callSettings.callQuality}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, callQuality: e.target.value as any }))}
                    label="Call Quality"
                  >
                    <MenuItem value="low">Low (Data Saver)</MenuItem>
                    <MenuItem value="medium">Medium (Balanced)</MenuItem>
                    <MenuItem value="high">High (Best Quality)</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.autoMute}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, autoMute: e.target.checked }))}
                      />
                    }
                    label="Auto-mute on join"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.autoVideo}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, autoVideo: e.target.checked }))}
                      />
                    }
                    label="Auto-enable video"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.echoCancellation}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, echoCancellation: e.target.checked }))}
                      />
                    }
                    label="Echo cancellation"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.noiseSuppression}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, noiseSuppression: e.target.checked }))}
                      />
                    }
                    label="Noise suppression"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>Cancel</Button>
            <Button variant="contained">Save Settings</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
          <IconButton 
            onClick={() => navigate('/dashboard')} 
            sx={{ 
              mr: 3,
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
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Video Calls
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Connect with family and friends through video calls
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Contacts List */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: theme.palette.mode === 'dark'
                ? '1.5px solid rgba(16,185,129,0.3)'
                : '1.5px solid rgba(16,185,129,0.18)',
              color: theme.palette.text.primary,
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Available Contacts
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => setShowAddContact(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(107, 114, 128, 0.3)',
                      },
                      px: 3,
                      py: 1,
                      borderRadius: 2
                    }}
                  >
                    Add Contact
                  </Button>
                </Box>

                <List sx={{ mt: 2 }}>
                  {contacts.map((contact, index) => (
                    <React.Fragment key={contact.id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: contact.status === 'online' ? '#10b981' : 
                                             contact.status === 'busy' ? '#f59e0b' : '#6b7280',
                                  border: '2px solid white'
                                }}
                              />
                            }
                          >
                            <Avatar 
                              src={contact.avatar}
                              sx={{ width: 60, height: 60 }}
                            />
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.name}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Chip 
                                label={contact.status} 
                                size="small" 
                                color={getStatusColor(contact.status) as any}
                                sx={{ fontSize: '0.7rem' }}
                              />
                              {contact.status === 'online' && (
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                  Available for video call
                                </Typography>
                              )}
                            </Box>
                          }
                          primaryTypographyProps={{ fontWeight: 600, fontSize: '1.2rem', mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<Call />}
                            onClick={() => handleStartCall(contact)}
                            disabled={contact.status !== 'online'}
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              },
                              '&:disabled': {
                                background: 'rgba(107, 114, 128, 0.3)',
                              },
                              px: 3,
                              py: 1.5,
                              borderRadius: 2
                            }}
                          >
                            Call
                          </Button>
                          <IconButton
                            onClick={() => handleDeleteContact(contact.id)}
                            sx={{
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              '&:hover': {
                                background: 'rgba(239, 68, 68, 0.1)',
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < contacts.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
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
              <CardContent sx={{ p: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                  Quick Actions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => setShowContacts(true)}
                    sx={{
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                      py: 2,
                      '&:hover': {
                        borderColor: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                      }
                    }}
                  >
                    View All Contacts
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Settings />}
                    onClick={() => setShowSettings(true)}
                    sx={{
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                      py: 2,
                      '&:hover': {
                        borderColor: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                      }
                    }}
                  >
                    Call Settings
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<AccessTime />}
                    onClick={() => setShowCallHistory(true)}
                    sx={{
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                      py: 2,
                      '&:hover': {
                        borderColor: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                      }
                    }}
                  >
                    Call History
                  </Button>
                </Box>

                <Box sx={{ mt: 5, p: 4, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                    💡 Tip: Make sure your camera and microphone are enabled for the best video call experience.
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    All calls are encrypted and secure for your privacy.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Contact Dialog */}
        <Dialog 
          open={showAddContact} 
          onClose={() => setShowAddContact(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Email (Optional)"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                variant="outlined"
                type="email"
              />
              <TextField
                fullWidth
                label="Phone (Optional)"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                variant="outlined"
                type="tel"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddContact(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddContact}>Add Contact</Button>
          </DialogActions>
        </Dialog>

        {/* Contacts Dialog */}
        <Dialog 
          open={showContacts} 
          onClose={() => setShowContacts(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>All Contacts</DialogTitle>
          <DialogContent>
            <List>
              {contacts.map((contact) => (
                <ListItem key={contact.id}>
                  <ListItemAvatar>
                    <Avatar src={contact.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name}
                    secondary={contact.status}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Call />}
                    disabled={contact.status !== 'online'}
                  >
                    Call
                  </Button>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowContacts(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Call History Dialog */}
        <Dialog 
          open={showCallHistory} 
          onClose={() => setShowCallHistory(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Call History</DialogTitle>
          <DialogContent>
            <TableContainer component={MuiPaper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contact</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {callHistory.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={call.contactAvatar} sx={{ width: 40, height: 40 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {call.contactName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getCallTypeIcon(call.type)}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {call.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCallDuration(call.duration)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCallDate(call.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={call.status} 
                          size="small" 
                          color={call.status === 'completed' ? 'success' : 
                                 call.status === 'missed' ? 'error' : 'warning'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCallHistory(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Video Call Settings</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Configure your video call preferences and device settings
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Device Settings</Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Camera</InputLabel>
                  <Select
                    value={callSettings.defaultCamera}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, defaultCamera: e.target.value }))}
                    label="Camera"
                  >
                    <MenuItem value="Front Camera">Front Camera</MenuItem>
                    <MenuItem value="Back Camera">Back Camera</MenuItem>
                    <MenuItem value="External Camera">External Camera</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Microphone</InputLabel>
                  <Select
                    value={callSettings.defaultMicrophone}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, defaultMicrophone: e.target.value }))}
                    label="Microphone"
                  >
                    <MenuItem value="Built-in Microphone">Built-in Microphone</MenuItem>
                    <MenuItem value="External Microphone">External Microphone</MenuItem>
                    <MenuItem value="Bluetooth Headset">Bluetooth Headset</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Speaker</InputLabel>
                  <Select
                    value={callSettings.defaultSpeaker}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, defaultSpeaker: e.target.value }))}
                    label="Speaker"
                  >
                    <MenuItem value="Built-in Speaker">Built-in Speaker</MenuItem>
                    <MenuItem value="External Speaker">External Speaker</MenuItem>
                    <MenuItem value="Bluetooth Headset">Bluetooth Headset</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Call Preferences</Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Call Quality</InputLabel>
                  <Select
                    value={callSettings.callQuality}
                    onChange={(e) => setCallSettings(prev => ({ ...prev, callQuality: e.target.value as any }))}
                    label="Call Quality"
                  >
                    <MenuItem value="low">Low (Data Saver)</MenuItem>
                    <MenuItem value="medium">Medium (Balanced)</MenuItem>
                    <MenuItem value="high">High (Best Quality)</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.autoMute}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, autoMute: e.target.checked }))}
                      />
                    }
                    label="Auto-mute on join"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.autoVideo}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, autoVideo: e.target.checked }))}
                      />
                    }
                    label="Auto-enable video"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.echoCancellation}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, echoCancellation: e.target.checked }))}
                      />
                    }
                    label="Echo cancellation"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={callSettings.noiseSuppression}
                        onChange={(e) => setCallSettings(prev => ({ ...prev, noiseSuppression: e.target.checked }))}
                      />
                    }
                    label="Noise suppression"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>Cancel</Button>
            <Button variant="contained">Save Settings</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default VideoCall; 