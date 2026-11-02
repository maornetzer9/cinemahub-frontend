import { Box, Dialog, DialogContent, Divider, Typography } from '@mui/material';
import { modalBackdropSx, modalFooterSx, modalPaperSx } from '../styles';

export default function ModalLayout({
    open,
    onClose,
    title,
    subtitle,
    children,
    footer = null,
    maxWidth = 'md',
    fullWidth = true,
    exitMs = 220,
    zIndex = 1600,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            transitionDuration={{ enter: exitMs, exit: exitMs }}
            sx={{ zIndex, '& .MuiDialog-container': { position: 'fixed', inset: 0 } }}
            BackdropProps={{ sx: modalBackdropSx }}
            PaperProps={{ sx: { ...modalPaperSx, position: 'relative', zIndex: zIndex + 1 } }}
        >
            <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box display="grid" gap={2.5}>
                    {(title || subtitle) && (
                        <Box>
                            {title && (
                                <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                                    {title}
                                </Typography>
                            )}
                            {subtitle && (
                                <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>
                            )}
                        </Box>
                    )}
                    {(title || subtitle) && <Divider sx={{ borderColor: 'divider' }} />}
                    {children}
                    {footer && <Box sx={modalFooterSx}>{footer}</Box>}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
