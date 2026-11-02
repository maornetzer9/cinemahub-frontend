import { Component } from 'react';
import { Box, Button, Typography } from '@mui/material';

export default class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    handleRetry = () => {
        this.setState({ hasError: false });
    };

    handleGoHome = () => {
        window.location.assign('/');
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        px: 3,
                        textAlign: 'center',
                        bgcolor: 'background.default',
                    }}
                >
                    <Typography variant="h5" component="h1">
                        Something went wrong
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
                        An unexpected error occurred. You can try again or return to sign in.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                        <Button variant="outlined" onClick={this.handleRetry}>
                            Try again
                        </Button>
                        <Button variant="contained" onClick={this.handleGoHome}>
                            Go to sign in
                        </Button>
                    </Box>
                </Box>
            );
        }

        return this.props.children;
    }
}
