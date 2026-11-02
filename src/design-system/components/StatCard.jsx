import { Box, Card, CardContent, Typography } from '@mui/material';
import { hoverLiftSx, surfaceCardSx } from '../styles';
import { radius } from '../tokens';

export default function StatCard({ icon: Icon, label, value, helper, accent = 'primary.main' }) {
    return (
        <Card sx={{ ...surfaceCardSx, ...hoverLiftSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: '0.04em' }}>
                            {label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} mt={0.5} sx={{ letterSpacing: '-0.02em' }}>
                            {value}
                        </Typography>
                        {helper && (
                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                {helper}
                            </Typography>
                        )}
                    </Box>
                    {Icon && (
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: `${radius.control}px`,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: `${accent}14`,
                                color: accent,
                                flexShrink: 0,
                            }}
                        >
                            <Icon sx={{ fontSize: 20 }} />
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
