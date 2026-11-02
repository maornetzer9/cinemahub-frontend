import { Box, Divider, Typography } from '@mui/material';
import BrandLogo from './BrandLogo';
import { authPageSx, surfaceCardSx } from '../styles';

export default function AuthCard({ title, subtitle, children, footer, maxWidth = 420 }) {
    return (
        <Box sx={authPageSx}>
            <Box sx={{ width: '100%', maxWidth, ...surfaceCardSx, p: { xs: 3, sm: 4 }, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <Box mb={3}>
                    <BrandLogo size="lg" />
                </Box>
                {title && <Typography variant="h6" fontWeight={600} mb={0.5}>{title}</Typography>}
                {subtitle && <Typography variant="body2" color="text.secondary" mb={3}>{subtitle}</Typography>}
                <Divider sx={{ mb: 3 }} />
                {children}
                {footer}
            </Box>
        </Box>
    );
}
