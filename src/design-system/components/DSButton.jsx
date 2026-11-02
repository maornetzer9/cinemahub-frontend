import { Button, CircularProgress } from '@mui/material';
import { buttonVariants } from '../styles';

export default function DSButton({
    variant = 'primary',
    loading = false,
    disabled = false,
    children,
    startIcon,
    endIcon,
    onClick,
    type = 'button',
    fullWidth = false,
    size = 'medium',
    sx = {},
    ...props
}) {
    const preset = buttonVariants[variant] || buttonVariants.primary;

    return (
        <Button
            type={type}
            variant={preset.variant}
            color={preset.color}
            disabled={disabled || loading}
            onClick={onClick}
            fullWidth={fullWidth}
            size={size}
            startIcon={loading ? null : startIcon}
            endIcon={loading ? null : endIcon}
            sx={{ ...preset.sx, ...sx }}
            {...props}
        >
            {loading ? <CircularProgress size={18} color="inherit" /> : children}
        </Button>
    );
}
