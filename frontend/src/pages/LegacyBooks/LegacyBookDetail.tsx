import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LegacyBookDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/legacy-books')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Legacy Book Detail
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Legacy book detail view coming soon.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LegacyBookDetail; 