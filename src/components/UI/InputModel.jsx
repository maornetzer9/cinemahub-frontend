import { TextField } from '@mui/material';
import { inputRootSx } from '../../design-system/styles';

export default function InputModel({
        type = 'text',
        variant = 'outlined',
        name = '',
        label = 'Input',
        placeholder = '',
        hideLabel = false,
        helperText = '',
        error = false,
        autoComplete = '',
        defaultValue = '',
        style = {},
        onChange = () => {},
        children,
        compact = false,
    }) {
    return (
        <TextField
            fullWidth
            size={compact ? 'small' : 'medium'}
            type={type}
            variant={variant}
            label={hideLabel ? undefined : label}
            placeholder={placeholder || (hideLabel ? label : '')}
            name={name}
            style={style}
            onChange={onChange}
            autoComplete={autoComplete}
            helperText={helperText || ''}
            defaultValue={defaultValue}
            error={!!error}
            InputLabelProps={hideLabel ? { shrink: false } : undefined}
            InputProps={{
                sx: {
                    ...inputRootSx,
                    ...(compact && { minHeight: 42 }),
                },
            }}
        >
            {children}
        </TextField>
    );
}
