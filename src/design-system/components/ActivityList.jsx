import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CardContainer from './CardContainer';
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import { hoverSubtleSx, subtleScrollbarSx } from '../styles';
import { layout, radius } from '../tokens';

export default function ActivityList({
    title,
    subtitle,
    items = [],
    emptyTitle = 'No activity yet',
    emptyDescription,
    renderIcon,
    renderPrimary,
    renderSecondary,
    getLink,
    action,
}) {
    return (
        <CardContainer
            hover={false}
            sx={{
                height: layout.dashboardActivityCardHeight,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                p={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minHeight: 0,
                }}
            >
                <Box flexShrink={0}>
                    <SectionHeader title={title} subtitle={subtitle} action={action} />
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        ...subtleScrollbarSx,
                    }}
                >
                    {items.length === 0 ? (
                        <EmptyState compact title={emptyTitle} description={emptyDescription} />
                    ) : (
                        <Box display="flex" flexDirection="column" gap={0.5}>
                            {items.map((item, index) => {
                                const content = (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1.5}
                                        sx={{
                                            px: 1.25,
                                            py: 1,
                                            borderRadius: `${radius.control}px`,
                                            ...hoverSubtleSx,
                                        }}
                                    >
                                        {renderIcon?.(item)}
                                        <Box flex={1} minWidth={0}>
                                            <Typography variant="body2" fontWeight={600} noWrap>
                                                {renderPrimary?.(item)}
                                            </Typography>
                                            {renderSecondary && (
                                                <Typography variant="caption" color="text.secondary" noWrap display="block">
                                                    {renderSecondary(item)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                );

                                const link = getLink?.(item);
                                return link ? (
                                    <Link key={item.id || index} to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {content}
                                    </Link>
                                ) : (
                                    <Box key={item.id || index}>{content}</Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </Box>
        </CardContainer>
    );
}
