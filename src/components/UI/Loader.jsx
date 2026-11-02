import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader({ color = 'primary', label = 'Loading…' }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(59,130,246,0.08)',
                }}
            >
                <CircularProgress size={32} thickness={3} color={color} />
            </Box>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
    );
}
