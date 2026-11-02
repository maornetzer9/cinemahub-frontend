import { memo } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import {
    Alert,
    Box,
    CardContent,
    Chip,
    Slide,
    Tooltip,
    Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import PermissionButton from "../UI/PermissionButton";
import DSButton from "../../design-system/components/DSButton";
import { deleteMemberById } from "../../services/members";
import { Link } from "react-router-dom";
import Avatar from "../../design-system/components/Avatar";
import CardContainer from "../../design-system/components/CardContainer";
import EmptyState from "../../design-system/components/EmptyState";
import { deleteActionIconSx, editActionIconSx, chipSx } from "../../design-system/styles";
import { radius } from "../../design-system/tokens";
import MemberSubscriptionsPopover, { SUBSCRIPTION_PREVIEW_LIMIT } from "./MemberSubscriptionsPopover";

function MemberCard({ member, onEditMember = () => {}, onSubscribe = () => {} }) {
    const dispatch = useDispatch();
    const { buttonsPermissions } = useSelector((state) => state.buttonsReducer);
    const canCreateSubscription = Boolean(buttonsPermissions?.subscriptions?.create);
    const { localError, setLocalError } = useLocalError();

    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const deleteMember = async (id) => {
        if (!id) return setLocalError("Missing id, cannot delete member");
        try {
            await deleteMemberById(id, dispatch);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    const subscriptions = member?.subscriptions ?? [];
    const previewSubscriptions = subscriptions.slice(0, SUBSCRIPTION_PREVIEW_LIMIT);

    return (
        <CardContainer hover sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 2 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={1.5}>
                    <Box display="flex" alignItems="center" gap={1.25} minWidth={0}>
                        <Avatar name={member?.name} username={member?.email} size={40} />
                        <Box minWidth={0}>
                            <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: "0.875rem" }}>
                                {member?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                {member?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" gap={0.75} flexShrink={0}>
                        <Tooltip title="Edit">
                            <PermissionButton
                                resourceType="subscriptions"
                                permissionType="update"
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => onEditMember(member)}
                                sx={editActionIconSx}
                            >
                                <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            </PermissionButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <PermissionButton
                                resourceType="subscriptions"
                                permissionType="delete"
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => deleteMember(member._id)}
                                sx={deleteActionIconSx}
                            >
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </PermissionButton>
                        </Tooltip>
                    </Box>
                </Box>

                {member?.city && (
                    <Typography variant="caption" color="text.disabled" display="block" mb={1.25}>
                        {member.city}
                    </Typography>
                )}

                {localError && (
                    <Slide direction="right" in={!!localError} mountOnEnter unmountOnExit>
                        <Alert severity="error" sx={{ mb: 1.25, py: 0, fontSize: "0.75rem", borderRadius: `${radius.control}px` }}>
                            {localError}
                        </Alert>
                    </Slide>
                )}

                <Box
                    sx={{
                        flex: 1,
                        borderRadius: `${radius.input}px`,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(255,255,255,0.02)",
                        p: 1.25,
                        mb: 1.25,
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: "0.05em", fontSize: "0.6875rem" }}>
                            SUBSCRIPTIONS
                        </Typography>
                        <Chip size="small" label={subscriptions.length} variant="outlined" sx={{ ...chipSx, minWidth: 28 }} />
                    </Box>

                    {subscriptions.length > 0 ? (
                        <Box display="flex" flexDirection="column" gap={0.5}>
                            {previewSubscriptions.map((sub, i) => (
                                <Box
                                    key={`${sub.movieId}-${i}`}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    gap={1}
                                    sx={{
                                        px: 0.75,
                                        py: 0.5,
                                        borderRadius: `${radius.control}px`,
                                        transition: "background-color 0.2s ease",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
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
                                        {formatDate(sub.date)}
                                    </Typography>
                                </Box>
                            ))}
                            <MemberSubscriptionsPopover member={member} subscriptions={subscriptions} />
                        </Box>
                    ) : (
                        <EmptyState compact title="No subscriptions" description="Add a movie subscription below." />
                    )}
                </Box>

                {canCreateSubscription && (
                    <DSButton variant="outline" fullWidth size="small" onClick={() => onSubscribe(member)}>
                        Subscribe To New Movie
                    </DSButton>
                )}
            </CardContent>
        </CardContainer>
    );
}

export default memo(MemberCard);
