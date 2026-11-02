import {
    Box, Button, Dialog, DialogContent, Divider, Grow, IconButton, Switch, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { PERMISSIONS } from '../../utils/constants';
import { radius } from '../tokens';
import {
    crudCancelButtonSx,
    crudModalPaperSx,
    crudPrimaryButtonSx,
    crudSectionSx,
    CRUD_MODAL_EXIT_MS,
    crudModalMaxWidths,
    fieldLabelSx,
    modalAccents,
    modalBackdropSx,
} from '../styles';

const PERMISSION_GROUPS = [
    { key: 'Subscriptions', title: 'Subscriptions', icon: SubscriptionsOutlinedIcon },
    { key: 'Movies', title: 'Movies', icon: MovieFilterOutlinedIcon },
];

const ACTION_META = {
    View: { icon: VisibilityOutlinedIcon, description: 'Can view all items in this section.' },
    Create: { icon: AddCircleOutlineOutlinedIcon, description: 'Can create new items in this section.' },
    Update: { icon: EditOutlinedIcon, description: 'Can edit and update existing items.' },
    Delete: { icon: DeleteOutlineOutlinedIcon, description: 'Can delete items from this section.' },
};

const compactSpacing = {
    headerIcon: 40,
    headerIconFont: 20,
    headerDividerMy: 1.5,
    sectionPadding: { xs: 1.25, md: 1.5 },
    sectionTitleMb: 1,
    panelPadding: { xs: 2, md: 2.5 },
    panelGap: 1.5,
    fieldGap: 0.5,
    gridGap: 1.25,
    permissionCardPadding: 1.25,
    permissionRowPy: 0.65,
    permissionRowPx: 1.1,
    permissionGridGap: 0.75,
};

export function CrudModalHeader({ icon: Icon, title, subtitle, onClose, accent = 'user', compact = false }) {
    const accentStyle = modalAccents[accent] || modalAccents.user;

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: compact ? compactSpacing.headerIcon : 48,
                            height: compact ? compactSpacing.headerIcon : 48,
                            borderRadius: compact ? `${radius.input}px` : `${radius.input + 2}px`,
                            flexShrink: 0,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: accentStyle.muted,
                            border: '1px solid',
                            borderColor: accentStyle.border,
                            boxShadow: accentStyle.glow,
                            color: accentStyle.main,
                        }}
                    >
                        <Icon sx={{ fontSize: compact ? compactSpacing.headerIconFont : 24 }} />
                    </Box>
                    <Box minWidth={0}>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                letterSpacing: '-0.02em',
                                fontSize: compact
                                    ? { xs: '1.125rem', md: '1.25rem' }
                                    : { xs: '1.25rem', md: '1.375rem' },
                                lineHeight: 1.25,
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={compact ? 0.5 : 0.75}
                                sx={{ lineHeight: compact ? 1.45 : 1.55, maxWidth: 520, fontSize: compact ? '0.8125rem' : undefined }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {onClose && (
                    <IconButton
                        onClick={onClose}
                        aria-label="Close"
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: `${radius.control}px`,
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', color: 'text.primary' },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                )}
            </Box>
            <Divider sx={{ borderColor: 'divider', my: compact ? compactSpacing.headerDividerMy : 2.5 }} />
        </>
    );
}

export function CrudModalSection({ title, icon: SectionIcon, children, sx = {}, compact = false }) {
    return (
        <Box
            sx={{
                ...crudSectionSx,
                ...(compact && {
                    p: compactSpacing.sectionPadding,
                    borderRadius: `${radius.card}px`,
                }),
                ...sx,
            }}
        >
            {title && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: compact ? compactSpacing.sectionTitleMb : 2 }}>
                    {SectionIcon && <SectionIcon sx={{ fontSize: compact ? 16 : 18, color: 'primary.main' }} />}
                    <Typography variant="subtitle2" fontWeight={700} sx={{ letterSpacing: '-0.01em', fontSize: compact ? '0.8125rem' : undefined }}>
                        {title}
                    </Typography>
                </Box>
            )}
            {children}
        </Box>
    );
}

export function CrudModalField({ label, helperText, children, fullWidth = false, compact = false }) {
    return (
        <Box
            display="grid"
            gap={compact ? compactSpacing.fieldGap : 0.75}
            sx={{
                width: '100%',
                gridColumn: fullWidth ? { xs: '1', md: '1 / -1' } : undefined,
            }}
        >
            {label && (
                <Typography component="label" sx={fieldLabelSx}>
                    {label}
                </Typography>
            )}
            {children}
            {helperText && (
                <Typography variant="caption" color="text.secondary">
                    {helperText}
                </Typography>
            )}
        </Box>
    );
}

export function CrudModalActions({
    onCancel,
    onSave,
    saveLabel = 'Save',
    saving = false,
    savingLabel = 'Saving…',
    disabled = false,
    accent = 'user',
    saveIcon: SaveIcon,
    cancelLabel = 'Cancel',
    compact = false,
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                gap: compact ? 1 : 1.5,
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                pt: compact ? 0 : 1,
                width: '100%',
            }}
        >
            <Button
                variant="outlined"
                color="inherit"
                onClick={onCancel}
                disabled={disabled || saving}
                sx={crudCancelButtonSx}
            >
                {cancelLabel}
            </Button>
            <Button
                variant="contained"
                onClick={onSave}
                disabled={disabled || saving}
                startIcon={SaveIcon ? <SaveIcon sx={{ fontSize: 18 }} /> : undefined}
                sx={crudPrimaryButtonSx(accent)}
            >
                {saving ? savingLabel : saveLabel}
            </Button>
        </Box>
    );
}

export function CrudDialog({
    open,
    onClose,
    children,
    size = 'md',
    maxWidth,
    exitMs = CRUD_MODAL_EXIT_MS,
    zIndex = 1600,
    compact = false,
}) {
    const resolvedMaxWidth = maxWidth || crudModalMaxWidths[size] || crudModalMaxWidths.md;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={resolvedMaxWidth}
            TransitionComponent={Grow}
            transitionDuration={{ enter: exitMs, exit: exitMs }}
            TransitionProps={{ style: { transformOrigin: 'center center' } }}
            sx={{ zIndex, '& .MuiDialog-container': { position: 'fixed', inset: 0 } }}
            BackdropProps={{ sx: modalBackdropSx }}
            PaperProps={{
                sx: {
                    ...crudModalPaperSx,
                    position: 'relative',
                    zIndex: zIndex + 1,
                    maxHeight: 'calc(100vh - 48px)',
                    ...(compact && {
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }),
                },
            }}
        >
            <DialogContent
                sx={{
                    p: compact ? compactSpacing.panelPadding : { xs: 2.5, md: 3 },
                    ...(compact && {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                    }),
                    ...(!compact && {
                        overflowY: 'auto',
                    }),
                }}
            >
                <Box
                    display={compact ? 'flex' : 'grid'}
                    flexDirection={compact ? 'column' : undefined}
                    flex={compact ? 1 : undefined}
                    minHeight={compact ? 0 : undefined}
                    gap={compact ? compactSpacing.panelGap : 2.5}
                >
                    {children}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export function CrudPanel({ children, accent = 'user', compact = false }) {
    const accentStyle = modalAccents[accent] || modalAccents.user;

    return (
        <Box
            sx={{
                ...crudModalPaperSx,
                position: 'relative',
                overflow: 'hidden',
                ...(compact && {
                    maxHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    flexDirection: 'column',
                }),
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: accentStyle.gradient,
                    opacity: 0.9,
                },
            }}
        >
            <Box
                sx={{
                    p: compact ? compactSpacing.panelPadding : { xs: 3, md: 4 },
                    display: compact ? 'flex' : 'grid',
                    flexDirection: compact ? 'column' : undefined,
                    flex: compact ? 1 : undefined,
                    minHeight: compact ? 0 : undefined,
                    gap: compact ? compactSpacing.panelGap : 2,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export function CrudPanelBody({ children, compact = false }) {
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                overflowY: compact ? 'auto' : 'visible',
                display: 'grid',
                gap: compact ? compactSpacing.panelGap : 2.5,
                pr: compact ? 0.25 : 0,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderRadius: 3,
                },
            }}
        >
            {children}
        </Box>
    );
}

export function CrudPanelFooter({ children }) {
    return (
        <Box
            sx={{
                flexShrink: 0,
                display: 'grid',
                gap: 1.25,
                pt: 1.25,
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            {children}
        </Box>
    );
}

export function PermissionCards({ form, formHandler, formError = {}, showError = false, compact = false }) {
    const permissionsByGroup = PERMISSION_GROUPS.map((group) => ({
        ...group,
        permissions: PERMISSIONS.filter((permission) => permission.endsWith(`-${group.key}`)),
    }));

    return (
        <CrudModalSection title="Permissions" compact={compact}>
            {showError && formError.permissions && (
                <Typography variant="caption" color="error" display="block" mb={compact ? 1 : 1.5}>
                    {formError.permissions}
                </Typography>
            )}

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={compact ? 1.25 : 2}>
                {permissionsByGroup.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                        <Box
                            key={group.key}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: compact ? `${radius.card}px` : `${radius.card}px`,
                                p: compact ? compactSpacing.permissionCardPadding : 2,
                                bgcolor: 'rgba(255,255,255,0.02)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1} mb={compact ? 1 : 1.5}>
                                <Box
                                    sx={{
                                        width: compact ? 28 : 32,
                                        height: compact ? 28 : 32,
                                        borderRadius: compact ? `${radius.control}px` : `${radius.input}px`,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: 'rgba(59,130,246,0.1)',
                                        color: 'primary.main',
                                    }}
                                >
                                    <GroupIcon sx={{ fontSize: compact ? 16 : 18 }} />
                                </Box>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: compact ? '0.8125rem' : undefined }}>
                                    {group.title}
                                </Typography>
                            </Box>

                            <Box display="grid" gap={compact ? compactSpacing.permissionGridGap : 1}>
                                {group.permissions.map((permission) => {
                                    const [actionName] = permission.split('-');
                                    const actionMeta = ACTION_META[actionName];
                                    const ActionIcon = actionMeta?.icon || VisibilityOutlinedIcon;
                                    const isChecked = form.permissions.includes(permission);

                                    const toggle = () =>
                                        formHandler({
                                            target: {
                                                name: 'permissions',
                                                value: permission,
                                                checked: !isChecked,
                                            },
                                        });

                                    return (
                                        <Box
                                            key={permission}
                                            role="button"
                                            tabIndex={0}
                                            onClick={toggle}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    toggle();
                                                }
                                            }}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: compact ? 1.25 : 2,
                                                px: compact ? compactSpacing.permissionRowPx : 1.5,
                                                py: compact ? compactSpacing.permissionRowPy : 1.25,
                                                borderRadius: compact ? `${radius.control}px` : `${radius.input}px`,
                                                border: '1px solid',
                                                borderColor: isChecked ? 'rgba(59,130,246,0.45)' : 'divider',
                                                bgcolor: isChecked ? 'rgba(59,130,246,0.08)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.22s ease',
                                                '&:hover': {
                                                    bgcolor: isChecked ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                                                },
                                            }}
                                        >
                                            <Box display="flex" alignItems="flex-start" gap={compact ? 1 : 1.25} minWidth={0}>
                                                <ActionIcon
                                                    sx={{
                                                        fontSize: compact ? 16 : 18,
                                                        mt: 0.15,
                                                        color: isChecked ? 'primary.main' : 'text.secondary',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <Box minWidth={0}>
                                                    <Typography variant="body2" fontWeight={600} lineHeight={1.25} sx={{ fontSize: compact ? '0.8125rem' : undefined }}>
                                                        {actionName}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        display="block"
                                                        lineHeight={1.35}
                                                        sx={{ fontSize: compact ? '0.6875rem' : undefined }}
                                                    >
                                                        {actionMeta?.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Switch
                                                name="permissions"
                                                value={permission}
                                                checked={isChecked}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={formHandler}
                                                size={compact ? 'small' : 'medium'}
                                                inputProps={{ 'aria-label': `${actionName} ${group.title}` }}
                                                sx={{
                                                    flexShrink: 0,
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        bgcolor: 'primary.main',
                                                        opacity: 0.55,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </CrudModalSection>
    );
}
