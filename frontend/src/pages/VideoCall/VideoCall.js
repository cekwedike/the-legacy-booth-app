import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import {
  Call,
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const VideoCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  const startCall = async () => {
    setLoading(true);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // In a real app, you'd connect to a signaling server here
      // For now, we'll just simulate a successful connection
      setTimeout(() => {
        setIsInCall(true);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Unable to access camera and microphone. Please check permissions.');
      setLoading(false);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsInCall(false);
    setRemoteStream(null);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOff(!isSpeakerOff);
    // In a real app, you'd control the audio output here
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Video Call
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {!isInCall ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Call />}
              onClick={startCall}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Start Video Call'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<CallEnd />}
              onClick={endCall}
            >
              End Call
            </Button>
          )}
        </Box>

        {isInCall && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
            <IconButton
              onClick={toggleMute}
              color={isMuted ? 'error' : 'primary'}
              size="large"
            >
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>
            
            <IconButton
              onClick={toggleVideo}
              color={isVideoOff ? 'error' : 'primary'}
              size="large"
            >
              {isVideoOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
            
            <IconButton
              onClick={toggleSpeaker}
              color={isSpeakerOff ? 'error' : 'primary'}
              size="large"
            >
              {isSpeakerOff ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Local Video */}
          <Card sx={{ minWidth: 300, maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                You
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  height: 225,
                  backgroundColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {localStream ? (
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
                ) : (
                  <Typography color="text.secondary">
                    Camera not available
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>

          {/* Remote Video */}
          <Card sx={{ minWidth: 300, maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Remote User
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  width: '100%',
                  height: 225,
                  backgroundColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {remoteStream ? (
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
                  <Typography color="text.secondary">
                    Waiting for connection...
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Box>

        {!isInCall && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Video Calls
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with your loved ones through high-quality video calls. 
                The video call feature allows you to see and hear each other in real-time, 
                making it feel like you're in the same room together.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default VideoCall; 