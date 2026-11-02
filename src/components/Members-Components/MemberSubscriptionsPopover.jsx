import { useState } from "react";
import {
    Box, Divider, Grow, IconButton, Popover, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import { Link } from "react-router-dom";
import { colors, radius, shadows } from "../../design-system/tokens";

export const SUBSCRIPTION_PREVIEW_LIMIT = 3;

function formatSubscriptionDate(isoDate) {
    const d = new Date(isoDate);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function SubscriptionRow({ sub }) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{
                px: 1,
                py: 0.75,
                borderRadius: `${radius.control}px`,
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: colors.surfaceHover },
            }}
        >
            <Box display="flex" alignItems="center" gap={0.75} minWidth={0}>
                <MovieOutlinedIcon sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }} />
                <Link
                    to={`/movies/${sub.movieId}`}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {sub.name}
                </Link>
            </Box>
            <Typography variant="caption" color="text.secondary" flexShrink={0} sx={{ fontSize: "0.6875rem" }}>
                {formatSubscriptionDate(sub.date)}
            </Typography>
        </Box>
    );
}

export default function MemberSubscriptionsPopover({ member, subscriptions = [] }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const hiddenCount = Math.max(0, subscriptions.length - SUBSCRIPTION_PREVIEW_LIMIT);
    const hiddenSubscriptions = subscriptions.slice(SUBSCRIPTION_PREVIEW_LIMIT);

    if (hiddenCount <= 0) return null;

    const handleOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const memberName = member?.name || "Member";
    const totalLabel =
        hiddenCount === 1 ? "1 additional subscription" : `${hiddenCount} additional subscriptions`;

    return (
        <>
            <Typography
                component="button"
                type="button"
                variant="caption"
                onClick={handleOpen}
                sx={{
                    pl: 0.75,
                    pt: 0.25,
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: "primary.main",
                    bgcolor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "color 0.2s ease, opacity 0.2s ease",
                    "&:hover": { color: "primary.light", textDecoration: "underline" },
                    "&:focus-visible": {
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: 2,
                        borderRadius: `${radius.control}px`,
                    },
                }}
            >
                +{hiddenCount} more
            </Typography>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                TransitionComponent={Grow}
                transitionDuration={200}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.75,
                            width: { xs: 280, sm: 320 },
                            maxWidth: "calc(100vw - 32px)",
                            bgcolor: colors.surface,
                            backgroundImage: "none",
                            border: "1px solid",
                            borderColor: colors.borderSubtle,
                            borderRadius: `${radius.card}px`,
                            boxShadow: shadows.modal,
                            overflow: "hidden",
                        },
                    },
                }}
            >
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                        <Box minWidth={0}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ letterSpacing: "-0.01em" }}>
                                {memberName} subscriptions
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
                                {totalLabel}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            aria-label="Close subscriptions list"
                            onClick={handleClose}
                            sx={{
                                color: "text.secondary",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: `${radius.control}px`,
                                width: 28,
                                height: 28,
                                "&:hover": { bgcolor: colors.surfaceHover, color: "text.primary" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: "divider" }} />

                <Box
                    sx={{
                        maxHeight: 320,
                        overflowY: "auto",
                        overflowX: "hidden",
                        py: 0.5,
                        px: 0.5,
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255,255,255,0.12) transparent",
                        "&::-webkit-scrollbar": { width: 6 },
                        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                        "&::-webkit-scrollbar-thumb": {
                            bgcolor: "rgba(255,255,255,0.12)",
                            borderRadius: 3,
                            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                        },
                    }}
                >
                    {hiddenSubscriptions.map((sub, index) => (
                        <SubscriptionRow
                            key={`${sub.movieId}-${SUBSCRIPTION_PREVIEW_LIMIT + index}`}
                            sub={sub}
                        />
                    ))}
                </Box>
            </Popover>
        </>
    );
}
