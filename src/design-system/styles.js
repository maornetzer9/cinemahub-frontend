import { colors, motion, radius, shadows, spacing, layout, controlHeight, typography, iconSizes } from './tokens';

export const pageContainerSx = {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    mx: 'auto',
    px: { xs: 2, sm: 3, md: 4 },
};

export const surfaceCardSx = {
    borderRadius: `${radius.card}px`,
    border: '1px solid',
    borderColor: colors.borderSubtle,
    bgcolor: colors.surface,
    boxShadow: shadows.card,
    backgroundImage: 'none',
};

export const tableSurfaceSx = {
    borderRadius: `${radius.table}px`,
    border: '1px solid',
    borderColor: colors.borderSubtle,
    bgcolor: colors.surface,
    boxShadow: shadows.card,
    overflow: 'hidden',
    backgroundImage: 'none',
};

export const hoverLiftSx = {
    transition: `transform ${motion.normal}, box-shadow ${motion.normal}, border-color ${motion.normal}, background-color ${motion.normal}`,
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: shadows.cardHover,
        borderColor: colors.border,
        bgcolor: colors.surfaceElevated,
    },
};

export const hoverSubtleSx = {
    transition: `background-color ${motion.fast}`,
    '&:hover': { bgcolor: colors.surfaceHover },
};

/** Premium dark UI — thin internal scrollbars (matches index.css + popover pattern) */
export const subtleScrollbarSx = {
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.12) transparent',
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
        bgcolor: 'rgba(255,255,255,0.12)',
        borderRadius: 3,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
    },
};

/** PageHeader filter control — soft label, aligned with SearchInput height */
export const pageFilterButtonSx = {
    borderRadius: `${radius.input}px`,
    borderColor: 'divider',
    whiteSpace: 'nowrap',
    height: controlHeight.sm,
    minHeight: controlHeight.sm,
    minWidth: 'auto',
    px: 1.75,
    py: 0,
    boxSizing: 'border-box',
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: typography.label.lineHeight,
    color: 'text.secondary',
    textTransform: 'none',
    letterSpacing: '0.01em',
    transition: `all ${motion.fast}`,
    '& .MuiButton-startIcon': {
        marginRight: 0.75,
        marginLeft: 0,
        '& .MuiSvgIcon-root': { fontSize: iconSizes.md, color: colors.textMuted },
    },
    '&:hover': {
        borderColor: colors.border,
        bgcolor: colors.surfaceHover,
        color: 'text.primary',
        '& .MuiButton-startIcon .MuiSvgIcon-root': { color: 'text.secondary' },
    },
};

/** Colored edit action — matches MovieCard professional icon buttons */
export const editActionIconSx = {
    borderRadius: `${radius.control}px`,
    border: '1px solid',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    color: colors.primary,
    width: 34,
    height: 34,
    minWidth: 34,
    p: 0,
    bgcolor: colors.primaryMuted,
    transition: `all ${motion.fast}`,
    '&:hover': {
        color: colors.primary,
        borderColor: colors.primary,
        bgcolor: 'rgba(59, 130, 246, 0.18)',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.14)',
    },
    '&:focus-visible': {
        outline: '2px solid',
        outlineColor: colors.primary,
        outlineOffset: 2,
    },
};

/** Colored delete action — matches MovieCard professional icon buttons */
export const deleteActionIconSx = {
    borderRadius: `${radius.control}px`,
    border: '1px solid',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    color: colors.danger,
    width: 34,
    height: 34,
    minWidth: 34,
    p: 0,
    bgcolor: colors.dangerMuted,
    transition: `all ${motion.fast}`,
    '&:hover': {
        color: colors.danger,
        borderColor: colors.danger,
        bgcolor: 'rgba(239, 68, 68, 0.18)',
        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.14)',
    },
    '&:focus-visible': {
        outline: '2px solid',
        outlineColor: colors.danger,
        outlineOffset: 2,
    },
};

export const chipSx = {
    height: 22,
    fontSize: '0.6875rem',
    fontWeight: 500,
    borderRadius: `${radius.control}px`,
    borderColor: colors.borderSubtle,
};

export const modalBackdropSx = {
    backgroundColor: colors.overlay,
    backdropFilter: 'blur(4px)',
};

export const modalPaperSx = {
    borderRadius: `${radius.dialog}px`,
    border: '1px solid',
    borderColor: colors.borderSubtle,
    boxShadow: shadows.modal,
    bgcolor: colors.surface,
};

export const modalAccents = {
    user: {
        main: colors.primary,
        muted: colors.primaryMuted,
        border: 'rgba(59,130,246,0.35)',
        glow: '0 0 24px rgba(59,130,246,0.18)',
        gradient: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryLight} 100%)`,
    },
    movie: {
        main: '#14B8A6',
        muted: 'rgba(20,184,166,0.12)',
        border: 'rgba(20,184,166,0.35)',
        glow: '0 0 24px rgba(20,184,166,0.18)',
        gradient: 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)',
    },
    member: {
        main: colors.accent,
        muted: 'rgba(129,140,248,0.12)',
        border: 'rgba(129,140,248,0.35)',
        glow: '0 0 24px rgba(129,140,248,0.18)',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #A5B4FC 100%)',
    },
    subscription: {
        main: colors.primary,
        muted: colors.primaryMuted,
        border: 'rgba(59,130,246,0.35)',
        glow: '0 0 24px rgba(59,130,246,0.18)',
        gradient: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryLight} 100%)`,
    },
};

export const crudModalPaperSx = {
    borderRadius: `${radius.dialog}px`,
    border: '1px solid',
    borderColor: colors.borderSubtle,
    boxShadow: shadows.modal,
    background: `linear-gradient(180deg, ${colors.surfaceElevated} 0%, ${colors.surface} 100%)`,
    backgroundImage: 'none',
    overflow: 'hidden',
};

export const crudSectionSx = {
    border: '1px solid',
    borderColor: colors.borderSubtle,
    borderRadius: `${radius.card}px`,
    p: { xs: 2, md: 2.5 },
    bgcolor: 'rgba(255,255,255,0.02)',
};

export const crudAlertSx = {
    borderRadius: `${radius.input}px`,
};

export const crudReadOnlyFieldSx = {
    minHeight: 48,
    borderRadius: `${radius.input}px`,
    border: '1px solid',
    borderColor: colors.borderSubtle,
    px: 1.5,
    display: 'flex',
    alignItems: 'center',
    color: 'text.secondary',
    bgcolor: 'rgba(255,255,255,0.02)',
    fontSize: '0.875rem',
};

export const CRUD_MODAL_EXIT_MS = 220;

export const crudModalMaxWidths = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
};

export const crudCancelButtonSx = {
    borderRadius: `${radius.input}px`,
    fontWeight: 600,
    fontSize: '0.875rem',
    px: 2.5,
    py: 1.1,
    minHeight: 44,
    borderColor: colors.borderSubtle,
    color: 'text.secondary',
    transition: `all ${motion.fast}`,
    '&:hover': {
        borderColor: colors.border,
        bgcolor: colors.surfaceHover,
        color: 'text.primary',
    },
};

export const crudPrimaryButtonSx = (accent = 'user') => {
    const a = modalAccents[accent] || modalAccents.user;
    return {
        borderRadius: `${radius.input}px`,
        fontWeight: 600,
        fontSize: '0.875rem',
        px: 2.5,
        py: 1.1,
        minHeight: 44,
        color: '#fff',
        background: a.gradient,
        boxShadow: `0 8px 20px ${a.muted}`,
        transition: `all ${motion.fast}`,
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 12px 28px ${a.muted}`,
            background: a.gradient,
            filter: 'brightness(1.05)',
        },
        '&:active': { transform: 'translateY(0)' },
        '&.Mui-disabled': {
            background: 'rgba(255,255,255,0.08)',
            color: 'text.disabled',
            boxShadow: 'none',
        },
    };
};

export const selectRootSx = {
    borderRadius: `${radius.input}px`,
    bgcolor: 'rgba(255,255,255,0.03)',
    fontSize: '0.875rem',
    minHeight: 48,
    transition: `border-color ${motion.fast}, box-shadow ${motion.fast}`,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.borderSubtle },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
    '&.Mui-focused': {
        bgcolor: 'rgba(255,255,255,0.04)',
        boxShadow: `0 0 0 3px ${colors.primaryMuted}`,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
};

/** Must exceed CrudDialog z-index (1600) so Select menus render above modal backdrop */
export const CRUD_SELECT_MENU_Z_INDEX = 1700;

export const crudSelectMenuProps = {
    disableScrollLock: true,
    sx: { zIndex: CRUD_SELECT_MENU_Z_INDEX },
    PaperProps: {
        sx: {
            zIndex: CRUD_SELECT_MENU_Z_INDEX,
            bgcolor: colors.surface,
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: colors.borderSubtle,
            borderRadius: `${radius.input}px`,
            boxShadow: shadows.modal,
            mt: 0.5,
            maxHeight: 280,
        },
    },
    MenuListProps: {
        sx: {
            py: 0.5,
            '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                color: colors.textPrimary,
                '&:hover': { bgcolor: colors.surfaceHover },
                '&.Mui-selected': {
                    bgcolor: colors.primaryMuted,
                    color: colors.primary,
                    '&:hover': { bgcolor: 'rgba(59,130,246,0.16)' },
                },
            },
        },
    },
};

export const formSectionSx = {
    border: '1px solid',
    borderColor: colors.borderSubtle,
    borderRadius: `${radius.input}px`,
    p: 2,
    bgcolor: 'rgba(255,255,255,0.02)',
    display: 'grid',
    gap: spacing.md,
};

export const fieldLabelSx = {
    fontSize: '0.8125rem',
    color: 'text.secondary',
    fontWeight: 500,
};

export const modalFooterSx = {
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    pt: spacing.sm,
    width: '100%',
};

export const fabSx = {
    position: 'fixed',
    right: { xs: spacing.lg, md: spacing.xl },
    bottom: { xs: spacing.lg, md: spacing.xl },
    width: 56,
    height: 56,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    color: '#fff',
    boxShadow: shadows.fab,
    transition: `transform ${motion.normal}, box-shadow ${motion.normal}`,
    '&:hover': {
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: shadows.fabHover,
        background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
    },
    '&:active': { transform: 'translateY(-1px) scale(0.98)' },
    '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 3 },
};

export const authPageSx = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: spacing.lg,
    background: `radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%)`,
};

/** Cinematic login page — Login.jsx only */
export const loginPageSx = {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    bgcolor: colors.background,
    background: `
        radial-gradient(ellipse 85% 55% at 16% 40%, rgba(99,102,241,0.28) 0%, rgba(124,58,237,0.12) 38%, transparent 62%),
        radial-gradient(ellipse 60% 45% at 84% 72%, rgba(59,130,246,0.22) 0%, rgba(168,85,247,0.08) 42%, transparent 68%),
        radial-gradient(ellipse 40% 35% at 52% 88%, rgba(236,72,153,0.06) 0%, transparent 70%),
        linear-gradient(155deg, #050810 0%, ${colors.background} 40%, #0f172a 72%, #111827 100%)
    `,
};

export const loginGlassCardSx = {
    width: '100%',
    maxWidth: 440,
    p: { xs: 3, sm: 4 },
    borderRadius: `${radius.dialog}px`,
    border: '1px solid rgba(148,163,184,0.26)',
    bgcolor: 'rgba(8,14,28,0.72)',
    backdropFilter: 'blur(26px)',
    boxShadow: '0 32px 90px rgba(0,0,0,0.58), 0 0 48px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 60px rgba(15,23,42,0.35)',
    position: 'relative',
    overflow: 'hidden',
    '@keyframes loginCardShine': {
        '0%': { transform: 'translateX(-140%) skewX(-14deg)', opacity: 0 },
        '35%': { opacity: 0.11 },
        '100%': { transform: 'translateX(220%) skewX(-14deg)', opacity: 0 },
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '-10%',
        left: 0,
        width: '55%',
        height: '45%',
        background: 'linear-gradient(105deg, transparent 8%, rgba(255,255,255,0.22) 50%, transparent 92%)',
        animation: 'loginCardShine 11s ease-in-out infinite',
        pointerEvents: 'none',
    },
};

export const loginIconGlowSx = {
    width: 72,
    height: 72,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    border: '1px solid rgba(96,165,250,0.42)',
    bgcolor: 'rgba(59,130,246,0.12)',
    boxShadow: '0 0 56px rgba(59,130,246,0.28), 0 0 24px rgba(168,85,247,0.12)',
};

export const loginPrimaryButtonSx = {
    py: 1.35,
    borderRadius: `${radius.input}px`,
    fontWeight: 600,
    fontSize: '0.9375rem',
    textTransform: 'none',
    background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.primary} 35%, ${colors.primaryLight} 65%, ${colors.accent} 100%)`,
    backgroundSize: '220% 100%',
    boxShadow: '0 10px 32px rgba(59,130,246,0.38)',
    transition: `transform ${motion.normal}, box-shadow ${motion.normal}`,
    '@keyframes loginGradientFlow': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
    },
    animation: 'loginGradientFlow 7s ease infinite',
    '&:hover': {
        boxShadow: '0 14px 40px rgba(59,130,246,0.48)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 8px 24px rgba(59,130,246,0.32)',
    },
    '&:disabled': {
        background: 'rgba(59,130,246,0.35)',
        color: 'rgba(255,255,255,0.65)',
        animation: 'none',
    },
};

export const inputRootSx = {
    borderRadius: `${radius.input}px`,
    bgcolor: 'rgba(255,255,255,0.03)',
    fontSize: '0.875rem',
    minHeight: 48,
    transition: `border-color ${motion.fast}, box-shadow ${motion.fast}`,
    '& fieldset': { borderColor: colors.borderSubtle },
    '&:hover fieldset': { borderColor: colors.border },
    '&.Mui-focused': {
        bgcolor: 'rgba(255,255,255,0.04)',
        boxShadow: `0 0 0 3px ${colors.primaryMuted}`,
    },
    '&.Mui-focused fieldset': { borderColor: colors.primary },
    '& input, & textarea': { py: 1.25, px: 0.25 },
    '& input::placeholder, & textarea::placeholder': { color: colors.textMuted, opacity: 1 },
};

export const loginInputSx = {
    ...inputRootSx,
    bgcolor: 'rgba(255,255,255,0.045)',
    transition: `border-color ${motion.fast}, box-shadow ${motion.normal}, transform ${motion.normal}`,
    '&.Mui-focused': {
        bgcolor: 'rgba(255,255,255,0.05)',
        transform: 'translateY(-1px)',
        boxShadow: '0 0 0 3px rgba(59,130,246,0.18), 0 0 28px rgba(59,130,246,0.12)',
    },
    '&.Mui-focused fieldset': { borderColor: colors.primaryLight },
    // Neutralize Chrome/Safari autofill: keep the dark surface + readable text
    // instead of the browser's bright blue fill, in every autofill state.
    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBoxShadow: `0 0 0 1000px ${colors.surface} inset`,
        WebkitTextFillColor: colors.textPrimary,
        caretColor: colors.textPrimary,
        borderRadius: 'inherit',
        transition: 'background-color 9999s ease-in-out 0s',
    },
};

export const crudTextFieldProps = {
    fullWidth: true,
    variant: 'outlined',
    InputProps: { sx: inputRootSx },
};

export const pageFadeVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const topBarSx = {
    position: 'sticky',
    top: 0,
    zIndex: (t) => t.zIndex.appBar,
    width: '100%',
    bgcolor: colors.background,
    borderBottom: '1px solid',
    borderColor: colors.borderSubtle,
};

export const sidebarShellSx = {
    width: layout.sidebarWidth,
    bgcolor: colors.background,
    borderRight: '1px solid',
    borderColor: colors.borderSubtle,
};

/** Collapse toggle — inline when expanded, floating edge control when collapsed */
export const sidebarCollapseToggleSx = (collapsed) => ({
    color: 'text.secondary',
    border: '1px solid',
    borderColor: colors.borderSubtle,
    width: collapsed ? 28 : 32,
    height: collapsed ? 28 : 32,
    flexShrink: 0,
    transition: `transform ${motion.normal}, background-color ${motion.fast}, box-shadow ${motion.fast}`,
    '&:hover': {
        bgcolor: colors.surfaceHover,
        color: 'text.primary',
        ...(collapsed ? { boxShadow: shadows.cardHover } : {}),
    },
    ...(collapsed
        ? {
              position: 'absolute',
              right: -14,
              top: '50%',
              transform: 'translateY(-50%)',
              borderRadius: '50%',
              bgcolor: colors.surface,
              boxShadow: shadows.card,
              zIndex: 2,
          }
        : {
              borderRadius: `${radius.control}px`,
          }),
});

export const navItemSx = {
    mx: 1.5,
    mb: 0.5,
    borderRadius: `${radius.input}px`,
    py: 1,
    px: 1.5,
    position: 'relative',
    transition: `all ${motion.fast}`,
    '&:hover': { bgcolor: colors.surfaceHover },
    '&.Mui-selected': {
        bgcolor: colors.primaryMuted,
        '&:hover': { bgcolor: 'rgba(59,130,246,0.16)' },
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '22%',
            bottom: '22%',
            width: 3,
            borderRadius: radius.pill,
            bgcolor: 'primary.main',
        },
    },
};

export const tableHeadCellSx = {
    color: 'text.secondary',
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderColor: colors.borderSubtle,
    py: 1.5,
    px: 2,
    bgcolor: 'rgba(255,255,255,0.02)',
};

export const tableRowSx = {
    transition: `background-color ${motion.fast}`,
    '&:hover': { bgcolor: colors.surfaceHover },
    '&:last-child td': { borderBottom: 0 },
    '& td': { borderColor: colors.borderSubtle, py: 1.75, px: 2 },
};

export const buttonVariants = {
    primary: {
        variant: 'contained',
        color: 'primary',
        sx: {
            borderRadius: `${radius.control}px`,
            fontWeight: 600,
            fontSize: '0.875rem',
            px: 2,
            py: 0.875,
            boxShadow: 'none',
            transition: `all ${motion.fast}`,
            '&:hover': { boxShadow: '0 4px 12px rgba(59,130,246,0.35)', transform: 'translateY(-1px)' },
        },
    },
    secondary: {
        variant: 'contained',
        color: 'inherit',
        sx: {
            borderRadius: `${radius.control}px`,
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: colors.surfaceElevated,
            border: `1px solid ${colors.borderSubtle}`,
            boxShadow: 'none',
            transition: `all ${motion.fast}`,
            '&:hover': { bgcolor: colors.surfaceHover, borderColor: colors.border },
        },
    },
    outline: {
        variant: 'outlined',
        color: 'inherit',
        sx: {
            borderRadius: `${radius.control}px`,
            fontWeight: 500,
            fontSize: '0.875rem',
            borderColor: colors.borderSubtle,
            transition: `all ${motion.fast}`,
            '&:hover': { borderColor: colors.primary, bgcolor: colors.primaryMuted },
        },
    },
    ghost: {
        variant: 'text',
        color: 'inherit',
        sx: {
            borderRadius: `${radius.control}px`,
            fontWeight: 500,
            fontSize: '0.875rem',
            color: 'text.secondary',
            transition: `all ${motion.fast}`,
            '&:hover': { bgcolor: colors.surfaceHover, color: 'text.primary' },
        },
    },
    danger: {
        variant: 'outlined',
        color: 'error',
        sx: {
            borderRadius: `${radius.control}px`,
            fontWeight: 500,
            fontSize: '0.875rem',
            transition: `all ${motion.fast}`,
            '&:hover': { bgcolor: colors.dangerMuted },
        },
    },
};
