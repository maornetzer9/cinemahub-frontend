import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { inputRootSx } from '../styles';
import { colors, controlHeight } from '../tokens';

export default function SearchInput({
    value,
    onChange,
    placeholder = 'Search…',
    fullWidth = true,
    size = 'small',
    sx = {},
}) {
    return (
        <TextField
            size={size}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth={fullWidth}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18, color: colors.textMuted }} />
                    </InputAdornment>
                ),
            }}
            inputProps={{ 'aria-label': placeholder }}
            sx={{
                minWidth: { sm: 240 },
                '& .MuiOutlinedInput-root': {
                    ...inputRootSx,
                    height: size === 'small' ? controlHeight.sm : controlHeight.md,
                    minHeight: size === 'small' ? controlHeight.sm : controlHeight.md,
                    pl: 0.5,
                    boxSizing: 'border-box',
                },
                '& .MuiOutlinedInput-input': {
                    py: 1,
                    px: 0.5,
                    '&::placeholder': { color: colors.textMuted, opacity: 1 },
                },
                ...sx,
            }}
        />
    );
}
