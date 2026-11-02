import { Card } from '@mui/material';
import { hoverLiftSx, surfaceCardSx } from '../styles';

export default function CardContainer({ children, hover = true, sx = {}, ...props }) {
    return (
        <Card sx={{ ...surfaceCardSx, ...(hover ? hoverLiftSx : {}), ...sx }} {...props}>
            {children}
        </Card>
    );
}
