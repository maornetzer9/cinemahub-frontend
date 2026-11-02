import { Fab, Tooltip } from '@mui/material';
import { fabSx } from '../styles';

export default function AppFab({ title, onClick, children, sx = {}, ...props }) {
    const fab = (
        <Fab
            color="primary"
            onClick={onClick}
            sx={{ ...fabSx, ...sx }}
            aria-label={title || 'add'}
            {...props}
        >
            {children}
        </Fab>
    );

    return title ? <Tooltip title={title}>{fab}</Tooltip> : fab;
}
