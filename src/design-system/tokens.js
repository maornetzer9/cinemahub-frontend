/** CinemaHub 2026 design tokens — single source of truth */

export const colors = {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#243044',
    surfaceHover: 'rgba(255,255,255,0.04)',
    border: '#334155',
    borderSubtle: 'rgba(255,255,255,0.08)',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    primaryMuted: 'rgba(59,130,246,0.12)',
    success: '#10B981',
    successMuted: 'rgba(16,185,129,0.12)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245,158,11,0.12)',
    danger: '#EF4444',
    dangerMuted: 'rgba(239,68,68,0.12)',
    accent: '#818CF8',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    overlay: 'rgba(0,0,0,0.72)',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
};

/** Per-surface radius — never use one value for every component */
export const radius = {
    control: 10,
    input: 12,
    card: 18,
    table: 18,
    dialog: 20,
    pill: 999,
};

export const moviePosterTopRadiusSx = {
    borderTopLeftRadius: `${radius.card}px`,
    borderTopRightRadius: `${radius.card}px`,
};

export const shadows = {
    card: '0 1px 3px rgba(0,0,0,0.24), 0 4px 12px rgba(0,0,0,0.18)',
    cardHover: '0 4px 16px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.2)',
    modal: '0 28px 70px rgba(0,0,0,0.6)',
    fab: '0 8px 28px rgba(59,130,246,0.45), 0 2px 8px rgba(0,0,0,0.2)',
    fabHover: '0 12px 36px rgba(59,130,246,0.55), 0 4px 12px rgba(0,0,0,0.25)',
};

export const typography = {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h2: { fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h3: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 },
    sectionTitle: { fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' },
    cardTitle: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.4 },
    subtitle: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, color: colors.textSecondary },
    body: { fontSize: '0.875rem', lineHeight: 1.6 },
    small: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 },
    caption: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.05em' },
    label: { fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.4 },
};

export const motion = {
    fast: '0.2s ease',
    normal: '0.22s ease',
    slow: '0.25s ease',
};

export const layout = {
    sidebarWidth: 240,
    sidebarCollapsedWidth: 72,
    topBarHeight: 60,
    contentMaxWidth: 1400,
    dashboardActivityCardHeight: 320,
};

/** Shared toolbar control heights — SearchInput + PageHeader filter */
export const controlHeight = {
    sm: 38,
    md: 44,
};

export const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
};
