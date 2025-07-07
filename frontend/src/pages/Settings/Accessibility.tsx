import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';

const Accessibility: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Accessibility Settings
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Accessibility settings feature coming soon.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Accessibility; 