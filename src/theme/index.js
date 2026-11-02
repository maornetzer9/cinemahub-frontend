import { createTheme } from '@mui/material/styles';
import { colors, radius, typography, spacing } from '../design-system/tokens';

/** Visible 42px circle is centered in the 56px trigger box. Match AppFab insets. */
const NAGISHLI_ICON_INSET = (56 - 42) / 2;
const nagishliLeft = spacing.lg - NAGISHLI_ICON_INSET;
const nagishliLeftDesktop = spacing.xl - NAGISHLI_ICON_INSET;

const cinemaTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: colors.primary,
            light: colors.primaryLight,
            dark: colors.primaryDark,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4338ca',
            contrastText: '#ffffff',
        },
        success: {
            main: colors.success,
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: colors.warning,
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: colors.primary,
            light: colors.primaryLight,
            dark: colors.primaryDark,
        },
        error: {
            main: colors.danger,
            light: '#f87171',
            dark: '#dc2626',
        },
        background: {
            default: colors.background,
            paper: colors.surface,
        },
        text: {
            primary: colors.textPrimary,
            secondary: colors.textSecondary,
            disabled: colors.textMuted,
        },
        divider: colors.borderSubtle,
    },

    typography: {
        fontFamily: typography.fontFamily,
        h1: { ...typography.h1 },
        h2: { ...typography.h2 },
        h3: { ...typography.h3 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500, color: colors.textSecondary },
        subtitle2: { fontWeight: 500, color: colors.textSecondary },
        body1: { ...typography.body },
        body2: { ...typography.body, color: colors.textSecondary },
        caption: { color: colors.textMuted },
        button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' },
    },

    shape: {
        borderRadius: 4,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: colors.background,
                },
                /* Match NagishLi bottom and visible left inset to AppFab. */
                '#NagishLiTrigger': {
                    bottom: `${spacing.lg}px !important`,
                    left: `${nagishliLeft}px !important`,
                    '@media (min-width:900px)': {
                        bottom: `${spacing.xl}px !important`,
                        left: `${nagishliLeftDesktop}px !important`,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: `${radius.control}px`,
                    padding: '8px 20px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { boxShadow: 'none' },
                },
                containedPrimary: {
                    background: colors.primary,
                    '&:hover': {
                        background: colors.primaryDark,
                    },
                },
                outlinedInherit: {
                    borderColor: colors.border,
                    '&:hover': { borderColor: colors.primary, bgcolor: 'rgba(59,130,246,0.06)' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.borderSubtle}`,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: colors.surface,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(15,23,42,0.95)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                    boxShadow: 'none',
                    backgroundImage: 'none',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.background,
                    borderRight: `1px solid ${colors.borderSubtle}`,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: colors.textSecondary,
                    transition: 'color 0.2s ease',
                    '&.Mui-selected': { color: colors.primary, fontWeight: 600 },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: { backgroundColor: colors.primary, height: 3, borderRadius: 2 },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: `${radius.control}px`, fontWeight: 500, fontSize: '0.75rem' },
                outlinedPrimary: { borderColor: colors.primary, color: colors.primary },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: `${radius.input}px`,
                        transition: 'border-color 0.2s ease',
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
                    },
                    '& label.Mui-focused': { color: colors.primary },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: `${radius.input}px`,
                    margin: '2px 12px',
                    padding: '10px 14px',
                    transition: 'all 0.2s ease',
                    '&:hover': { backgroundColor: 'rgba(59,130,246,0.08)' },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(59,130,246,0.14)',
                        color: colors.primary,
                        '&:hover': { backgroundColor: 'rgba(59,130,246,0.18)' },
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: colors.borderSubtle },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                },
                colorPrimary: {
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                    color: '#ffffff',
                    '&:hover': {
                        background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: colors.surfaceElevated,
                    border: `1px solid ${colors.borderSubtle}`,
                    fontSize: '0.78rem',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: `${radius.input}px` },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: colors.borderSubtle,
                    padding: '12px 16px',
                },
                head: {
                    color: colors.textSecondary,
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: `${radius.input}px`,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                    borderRadius: `${radius.dialog}px`,
                },
            },
        },
    },
});

export default cinemaTheme;
