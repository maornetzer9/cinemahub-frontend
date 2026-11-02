import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { radius } from '../tokens';
import { surfaceCardSx, tableSurfaceSx } from '../styles';

export function StatCardSkeleton() {
    return (
        <Box sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between">
                <Box flex={1}>
                    <Skeleton width={80} height={14} sx={{ borderRadius: 1 }} />
                    <Skeleton width={48} height={36} sx={{ mt: 1, borderRadius: 1 }} />
                    <Skeleton width={120} height={12} sx={{ mt: 1, borderRadius: 1 }} />
                </Box>
                <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: `${radius.control}px` }} />
            </Stack>
        </Box>
    );
}

export function CardGridSkeleton({ count = 8, columns = { xs: 12, sm: 6, md: 4, lg: 3 } }) {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: count }).map((_, i) => (
                <Grid item {...columns} key={i}>
                    <Box sx={{ ...surfaceCardSx, overflow: 'hidden' }}>
                        <Skeleton variant="rectangular" height={140} />
                        <Box p={1.5}>
                            <Skeleton width="70%" height={18} />
                            <Skeleton width="40%" height={12} sx={{ mt: 1 }} />
                            <Stack direction="row" gap={0.5} mt={1.5}>
                                <Skeleton width={48} height={20} sx={{ borderRadius: `${radius.control}px` }} />
                                <Skeleton width={56} height={20} sx={{ borderRadius: `${radius.control}px` }} />
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

export function TableSkeleton({ rows = 6, cols = 7 }) {
    return (
        <Box sx={tableSurfaceSx}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" gap={2}>
                    {Array.from({ length: cols }).map((_, i) => (
                        <Skeleton key={i} width={i === 0 ? 100 : 60} height={12} />
                    ))}
                </Stack>
            </Box>
            {Array.from({ length: rows }).map((_, r) => (
                <Box key={r} sx={{ px: 2, py: 1.75, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Skeleton variant="circular" width={36} height={36} />
                    <Box flex={1}>
                        <Skeleton width="30%" height={14} />
                        <Skeleton width="20%" height={10} sx={{ mt: 0.5 }} />
                    </Box>
                    <Skeleton width={60} height={22} sx={{ borderRadius: `${radius.control}px` }} />
                    <Skeleton width={40} height={14} />
                </Box>
            ))}
        </Box>
    );
}

export function DashboardSkeleton() {
    return (
        <Box>
            <Skeleton width={200} height={32} sx={{ mb: 1 }} />
            <Skeleton width={320} height={16} sx={{ mb: 3 }} />
            <Grid container spacing={2} mb={3}>
                {[1, 2, 3, 4].map((i) => (
                    <Grid item xs={12} sm={6} lg={3} key={i}><StatCardSkeleton /></Grid>
                ))}
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={4}><StatCardSkeleton /></Grid>
                <Grid item xs={12} lg={4}><StatCardSkeleton /></Grid>
                <Grid item xs={12} lg={4}><StatCardSkeleton /></Grid>
            </Grid>
        </Box>
    );
}

export function MemberCardSkeleton() {
    return (
        <Box sx={{ ...surfaceCardSx, p: 2 }}>
            <Stack direction="row" gap={1.5} mb={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box flex={1}>
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="80%" height={12} sx={{ mt: 0.5 }} />
                </Box>
            </Stack>
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: `${radius.input}px`, mb: 1.5 }} />
            <Skeleton variant="rounded" height={36} sx={{ borderRadius: `${radius.input}px` }} />
        </Box>
    );
}

export function MemberGridSkeleton({ count = 6 }) {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: count }).map((_, i) => (
                <Grid item xs={12} sm={6} lg={4} key={i}><MemberCardSkeleton /></Grid>
            ))}
        </Grid>
    );
}
