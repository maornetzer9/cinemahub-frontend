import { Box, Typography } from '@mui/material';
import { typography } from '../tokens';

export default function SectionHeader({ title, subtitle, action = null }) {
    return (
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2} mb={2}>
            <Box>
                <Typography sx={{ ...typography.sectionTitle, color: 'text.secondary' }}>{title}</Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" mt={0.25}>{subtitle}</Typography>
                )}
            </Box>
            {action}
        </Box>
    );
}
