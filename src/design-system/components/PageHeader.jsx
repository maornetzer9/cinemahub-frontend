import { Box, Button, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchInput from './SearchInput';
import { pageFilterButtonSx } from '../styles';

export default function PageHeader({
    title,
    subtitle,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search…',
    onFilterClick,
    filterLabel = 'Filters',
    actions = null,
}) {
    return (
        <Box mb={3}>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', lg: 'row' }}
                alignItems={{ xs: 'stretch', lg: 'flex-start' }}
                justifyContent="space-between"
                gap={2}
                mb={2.5}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary" mt={0.5} maxWidth={560}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    gap={1.25}
                    width={{ xs: '100%', lg: 'auto' }}
                    minWidth={{ lg: 360 }}
                >
                    {onSearchChange && (
                        <SearchInput
                            value={searchValue}
                            onChange={onSearchChange}
                            placeholder={searchPlaceholder}
                        />
                    )}
                    {onFilterClick && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            startIcon={<FilterListIcon />}
                            onClick={onFilterClick}
                            sx={pageFilterButtonSx}
                        >
                            {filterLabel}
                        </Button>
                    )}
                    {actions}
                </Box>
            </Box>
        </Box>
    );
}
