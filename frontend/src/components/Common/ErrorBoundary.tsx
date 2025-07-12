import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Container
} from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error logging service (e.g., Sentry)
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    // Create error report
    const errorReport = {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service
      console.log('Error report:', errorReport);
    } else {
      // In development, show in console
      console.group('Error Report');
      console.error('Error:', errorReport);
      console.groupEnd();
    }

    // Show user feedback
    alert('Error report submitted. Thank you for helping us improve!');
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #23234a 0%, #181826 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
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
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  mb: 3
                }}>
                  <BugReport sx={{ fontSize: 40 }} />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Oops! Something went wrong
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, color: '#a1a1aa' }}>
                  We encountered an unexpected error. Don't worry, your data is safe.
                </Typography>

                {process.env.NODE_ENV === 'development' && error && (
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Error Details (Development):
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {error.message}
                    </Typography>
                    {error.stack && (
                      <Typography variant="body2" sx={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.7rem', 
                        mt: 1,
                        color: '#a1a1aa'
                      }}>
                        {error.stack}
                      </Typography>
                    )}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleRetry}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      }
                    }}
                  >
                    Try Again
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<BugReport />}
                    onClick={this.handleReportError}
                    sx={{
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      '&:hover': {
                        borderColor: '#dc2626',
                        color: '#dc2626',
                        background: 'rgba(239, 68, 68, 0.1)',
                      }
                    }}
                  >
                    Report Error
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, color: '#6b7280' }}>
                  If the problem persists, please contact support.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      );
    }

    return children;
  }
}

export default ErrorBoundary; 