import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';

const VideoCall: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Video Call
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Video calling feature coming soon. This will allow you to connect with family and friends through video calls.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default VideoCall; 