import { Chip } from '@mui/material';
import { colors } from '../tokens';

const STATUS_STYLES = {
    active: { borderColor: 'rgba(16,185,129,0.4)', color: colors.success, label: 'Active' },
    inactive: { borderColor: 'divider', color: 'text.secondary', label: 'Inactive' },
    warning: { borderColor: 'rgba(245,158,11,0.4)', color: colors.warning, label: 'Warning' },
    error: { borderColor: 'rgba(239,68,68,0.4)', color: colors.danger, label: 'Error' },
};

export default function StatusBadge({ status = 'inactive', label, size = 'small' }) {
    const preset = STATUS_STYLES[status] || STATUS_STYLES.inactive;
    return (
        <Chip
            size={size}
            label={label || preset.label}
            variant="outlined"
            sx={{ height: 24, borderColor: preset.borderColor, color: preset.color }}
        />
    );
}
