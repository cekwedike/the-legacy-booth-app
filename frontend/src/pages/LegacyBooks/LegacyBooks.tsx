import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LegacyBooks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Legacy Books
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/dashboard')}
          >
            Create Legacy Book
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Legacy books feature coming soon. This will allow you to compile your stories and messages into beautiful books.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LegacyBooks; 