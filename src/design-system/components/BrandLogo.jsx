import { Box, Typography } from '@mui/material';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';

export default function BrandLogo({ size = 'md', showText = true, onClick }) {
    const iconSize = size === 'sm' ? 22 : size === 'lg' ? 30 : 26;
    const variant = size === 'lg' ? 'h5' : 'h6';

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            onClick={onClick}
            sx={{ cursor: onClick ? 'pointer' : 'default', flexShrink: 0 }}
        >
            <MovieFilterOutlinedIcon sx={{ color: 'primary.main', fontSize: iconSize }} />
            {showText && (
                <Typography variant={variant} fontWeight={700} sx={{ letterSpacing: '0.02em' }}>
                    Cinema<Box component="span" sx={{ color: 'primary.main' }}>Hub</Box>
                </Typography>
            )}
        </Box>
    );
}
