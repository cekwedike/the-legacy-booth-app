import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  Fade,
  CircularProgress
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
  VolumeUp,
  VolumeOff,
  Settings,
  Group,
  PersonAdd,
  ExitToApp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface VideoCallState {
  isInCall: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isAudioOff: boolean;
  roomId: string;
  participants: string[];
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  screenStream: MediaStream | null;
}

const VideoCall: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<VideoCallState>({
    isInCall: false,
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    isAudioOff: false,
    roomId: '',
    participants: [],
    localStream: null,
    remoteStreams: new Map(),
    screenStream: null
  });

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again.');
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        if (state.isInCall) {
          setError('Connection lost. Please reconnect.');
        }
      };
    };

    if (!socketRef.current) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [state.isInCall]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'user-joined':
        handleUserJoined(data.userId);
        break;
      case 'user-left':
        handleUserLeft(data.userId);
        break;
      case 'offer':
        handleOffer(data.offer, data.userId);
        break;
      case 'answer':
        handleAnswer(data.answer, data.userId);
        break;
      case 'ice-candidate':
        handleIceCandidate(data.candidate, data.userId);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  // Get user media
  const getUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Unable to access camera/microphone. Please check permissions.');
    }
  };

  // Create peer connection
  const createPeerConnection = (userId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(rtcConfig);
    
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          userId: userId
        }));
      }
    };

    pc.ontrack = (event) => {
      setState(prev => ({
        ...prev,
        remoteStreams: new Map(prev.remoteStreams.set(userId, event.streams[0]))
      }));
    };

    // Add local stream tracks
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => {
        pc.addTrack(track, state.localStream!);
      });
    }

    peerConnections.current.set(userId, pc);
    return pc;
  };

  // Handle user joined
  const handleUserJoined = async (userId: string) => {
    console.log('User joined:', userId);
    setState(prev => ({
      ...prev,
      participants: [...prev.participants, userId]
    }));

    const pc = createPeerConnection(userId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'offer',
        offer: offer,
        userId: userId
      }));
    }
  };

  // Handle user left
  const handleUserLeft = (userId: string) => {
    console.log('User left:', userId);
    const pc = peerConnections.current.get(userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(userId);
    }

    setState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== userId),
      remoteStreams: new Map([...prev.remoteStreams].filter(([key]) => key !== userId))
    }));
  };

  // Handle offer
  const handleOffer = async (offer: RTCSessionDescriptionInit, userId: string) => {
    const pc = createPeerConnection(userId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'answer',
        answer: answer,
        userId: userId
      }));
    }
  };

  // Handle answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit, userId: string) => {
    const pc = peerConnections.current.get(userId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit, userId: string) => {
    const pc = peerConnections.current.get(userId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  // Start call
  const startCall = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user media
      const stream = await getUserMedia({
        video: true,
        audio: true
      });

      // Set local stream
      setState(prev => ({
        ...prev,
        localStream: stream,
        isInCall: true
      }));

      // Join room
      if (socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'join-room',
          roomId: state.roomId || generateRoomId()
        }));
      }

      setShowJoinDialog(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start call');
    } finally {
      setLoading(false);
    }
  };

  // Join existing call
  const joinCall = async () => {
    if (!joinRoomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const stream = await getUserMedia({
        video: true,
        audio: true
      });

      setState(prev => ({
        ...prev,
        localStream: stream,
        isInCall: true,
        roomId: joinRoomId
      }));

      if (socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'join-room',
          roomId: joinRoomId
        }));
      }

      setShowJoinDialog(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join call');
    } finally {
      setLoading(false);
    }
  };

  // End call
  const endCall = () => {
    // Stop all streams
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }
    if (state.screenStream) {
      state.screenStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();

    // Leave room
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        type: 'leave-room',
        roomId: state.roomId
      }));
    }

    setState({
      isInCall: false,
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      isAudioOff: false,
      roomId: '',
      participants: [],
      localStream: null,
      remoteStreams: new Map(),
      screenStream: null
    });
  };

  // Toggle mute
  const toggleMute = () => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (state.isScreenSharing) {
        // Stop screen sharing
        if (state.screenStream) {
          state.screenStream.getTracks().forEach(track => track.stop());
        }
        setState(prev => ({ ...prev, isScreenSharing: false, screenStream: null }));
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });

        setState(prev => ({ ...prev, isScreenSharing: true, screenStream }));

        // Replace video track in all peer connections
        peerConnections.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      setError('Failed to start screen sharing');
    }
  };

  // Generate room ID
  const generateRoomId = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && state.localStream) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream]);

  useEffect(() => {
    if (screenVideoRef.current && state.screenStream) {
      screenVideoRef.current.srcObject = state.screenStream;
    }
  }, [state.screenStream]);

  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStreams.size > 0) {
      const firstRemoteStream = Array.from(state.remoteStreams.values())[0];
      remoteVideoRef.current.srcObject = firstRemoteStream;
    }
  }, [state.remoteStreams]);

  if (state.isInCall) {
    return (
      <Container maxWidth="xl" sx={{ height: '100vh', p: 0 }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            background: 'rgba(30, 30, 50, 0.9)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Room: {state.roomId}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Chip 
                    icon={<Group />} 
                    label={`${state.participants.length + 1} participants`}
                    size="small"
                    sx={{ background: 'rgba(99, 102, 241, 0.2)', color: '#fff' }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={endCall}
                  sx={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    }
                  }}
                >
                  <CallEnd />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Video Grid */}
          <Box sx={{ flex: 1, p: 2, background: '#0f1419' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {/* Local Video */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  height: '100%', 
                  background: '#1a1a2e',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {state.isVideoOff && (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#fff',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h4">Camera Off</Typography>
                    </Box>
                  )}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 1,
                    p: 1
                  }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      You {state.isMuted && '(Muted)'} {state.isVideoOff && '(Camera Off)'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Remote Video */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ 
                  height: '100%', 
                  background: '#1a1a2e',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {state.remoteStreams.size > 0 ? (
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a1a1aa'
                    }}>
                      <Typography variant="h6">Waiting for others to join...</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Screen Share */}
              {state.isScreenSharing && (
                <Grid item xs={12}>
                  <Paper sx={{ 
                    height: 300, 
                    background: '#1a1a2e',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <video
                      ref={screenVideoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Controls */}
          <Box sx={{ 
            p: 2, 
            background: 'rgba(30, 30, 50, 0.9)', 
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton
                onClick={toggleMute}
                sx={{
                  background: state.isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: state.isMuted ? '#ef4444' : '#fff',
                  '&:hover': {
                    background: state.isMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                  }
                }}
              >
                {state.isMuted ? <MicOff /> : <Mic />}
              </IconButton>

              <IconButton
                onClick={toggleVideo}
                sx={{
                  background: state.isVideoOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: state.isVideoOff ? '#ef4444' : '#fff',
                  '&:hover': {
                    background: state.isVideoOff ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                  }
                }}
              >
                {state.isVideoOff ? <VideocamOff /> : <Videocam />}
              </IconButton>

              <IconButton
                onClick={toggleScreenShare}
                sx={{
                  background: state.isScreenSharing ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: state.isScreenSharing ? '#10b981' : '#fff',
                  '&:hover': {
                    background: state.isScreenSharing ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                  }
                }}
              >
                {state.isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>

              <IconButton
                onClick={endCall}
                sx={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  }
                }}
              >
                <CallEnd />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff' }}>
          Video Call
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  mb: 3
                }}>
                  <Call sx={{ fontSize: 40 }} />
                </Box>

                <Typography variant="h5" gutterBottom>
                  Start New Call
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, color: '#a1a1aa' }}>
                  Create a new video call room and invite others to join
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<Call />}
                  onClick={() => {
                    setState(prev => ({ ...prev, roomId: generateRoomId() }));
                    setShowJoinDialog(true);
                  }}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Start Call'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  mb: 3
                }}>
                  <PersonAdd sx={{ fontSize: 40 }} />
                </Box>

                <Typography variant="h5" gutterBottom>
                  Join Call
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, color: '#a1a1aa' }}>
                  Join an existing video call using a room ID
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setShowJoinDialog(true)}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Join Call'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Join Dialog */}
        <Dialog open={showJoinDialog} onClose={() => setShowJoinDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {state.roomId ? 'Start New Call' : 'Join Call'}
          </DialogTitle>
          <DialogContent sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            pt: 3
          }}>
            {state.roomId && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 1 }}>
                  Room ID (share this with others):
                </Typography>
                <TextField
                  fullWidth
                  value={state.roomId}
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }
                  }}
                />
              </Box>
            )}

            {!state.roomId && (
              <TextField
                fullWidth
                label="Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter room ID"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& input': {
                      color: '#fff',
                    },
                    '& label': {
                      color: '#a1a1aa',
                    },
                  }
                }}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2
          }}>
            <Button 
              onClick={() => setShowJoinDialog(false)}
              sx={{ color: '#a1a1aa' }}
            >
              Cancel
            </Button>
            <Button
              onClick={state.roomId ? startCall : joinCall}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                }
              }}
            >
              {loading ? <CircularProgress size={20} /> : (state.roomId ? 'Start Call' : 'Join Call')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default VideoCall; 