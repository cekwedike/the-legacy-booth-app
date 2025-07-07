import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';

const ContentManagement: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Content management feature coming soon.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ContentManagement; 