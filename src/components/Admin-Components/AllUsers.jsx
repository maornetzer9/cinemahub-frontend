import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { deleteUserById, loadingUsers } from "../../services/users";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import { PERMISSIONS } from "../../utils/constants";
import EditUser from "./EditUser";
import PageHeader from "../../design-system/components/PageHeader";
import StatCard from "../../design-system/components/StatCard";
import Avatar from "../../design-system/components/Avatar";
import PermissionBadgeGroup from "../../design-system/components/PermissionBadgeGroup";
import StatusBadge from "../../design-system/components/StatusBadge";
import EmptyState from "../../design-system/components/EmptyState";
import { TableSkeleton } from "../../design-system/components/Skeleton";
import CardContainer from "../../design-system/components/CardContainer";
import { deleteActionIconSx, editActionIconSx, tableSurfaceSx, tableHeadCellSx, tableRowSx } from "../../design-system/styles";
import { colors } from "../../design-system/tokens";

const FILTER_OPTIONS = [
    { id: "all", label: "All Users" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
];

function getUserIdentityKey(user) {
    const id = user?._id != null ? String(user._id).trim() : "";
    if (id) return `id:${id}`;
    const username = String(user?.username ?? "").trim();
    const firstName = String(user?.firstName ?? "").trim();
    const lastName = String(user?.lastName ?? "").trim();
    const createAt = String(user?.createAt ?? "").trim();
    return `fallback:${username}|${firstName}|${lastName}|${createAt}`;
}

/** Drop corrupt placeholder rows; never mutates the source array */
function dedupeUsers(users) {
    const seen = new Set();
    return users.filter((user) => {
        if (!user || typeof user !== "object") return false;

        const id = user._id != null ? String(user._id).trim() : "";
        const username = String(user?.username ?? "").trim();
        const firstName = String(user?.firstName ?? "").trim();
        const lastName = String(user?.lastName ?? "").trim();

        if (!id && !username && !firstName && !lastName) return false;

        const key = getUserIdentityKey(user);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function isCreatedThisMonth(createAt) {
    if (!createAt) return false;
    const parts = String(createAt).split("/");
    if (parts.length !== 3) return false;
    const [month, , year] = parts.map(Number);
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
}

function deriveAccessLabel(permissions = []) {
    if (!permissions.length) return { label: "No Access", color: "default" };
    if (permissions.length >= PERMISSIONS.length) return { label: "Full Access", color: "primary" };
    const hasCreate = permissions.some((p) => p.startsWith("Create"));
    const hasDelete = permissions.some((p) => p.startsWith("Delete"));
    if (hasCreate && hasDelete) return { label: "Manager", color: "secondary" };
    if (permissions.some((p) => p.startsWith("View"))) return { label: "Viewer", color: "secondary" };
    return { label: "Standard", color: "default" };
}

function UserRowCard({ user, onEdit, onDelete }) {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const access = deriveAccessLabel(user.permissions);
    const isActive = (user.sessionTimeout ?? 0) > 0;

    return (
        <CardContainer hover={false} sx={{ p: 1.75 }}>
            <Box display="flex" gap={1.5} alignItems="flex-start">
                <Avatar name={fullName} username={user.username} size={44} />
                <Box flex={1} minWidth={0}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Box minWidth={0}>
                            <Typography fontWeight={700} noWrap>
                                {fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                @{user.username}
                            </Typography>
                        </Box>
                        <Box display="flex" gap={0.75}>
                            <Tooltip title="Edit">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => onEdit(user)}
                                    sx={editActionIconSx}
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => onDelete(user._id)}
                                    sx={deleteActionIconSx}
                                >
                                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Stack direction="row" flexWrap="wrap" gap={0.75} mt={1.25}>
                        <Chip size="small" label={access.label} color={access.color} variant="outlined" sx={{ height: 24 }} />
                        <StatusBadge status={isActive ? "active" : "inactive"} />
                        <Chip size="small" label={`${user.sessionTimeout ?? 0}m session`} variant="outlined" sx={{ height: 24 }} />
                    </Stack>
                    <Box mt={1.25}>
                        <PermissionBadgeGroup permissions={user.permissions} compact />
                    </Box>
                </Box>
            </Box>
        </CardContainer>
    );
}

export default function AllUsers() {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const dispatch = useDispatch();
    const { localError, setLocalError } = useLocalError();
    const { users, loading } = useSelector((state) => state.userReducer);

    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [filterAnchor, setFilterAnchor] = useState(null);
    const hasRequestedUsers = useRef(false);
    const hasLoadedUsersRef = useRef(false);

    const openEditUser = useCallback((user) => setEditingUser(user), []);
    const closeEditUser = useCallback(() => setEditingUser(null), []);

    const fetchUsers = useCallback(async () => {
        try {
            await loadingUsers(dispatch);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    }, [dispatch, setLocalError]);

    const deleteUser = useCallback(async (_id) => {
        if (!_id) return setLocalError("Id cannot be provided");
        try {
            await deleteUserById(_id, dispatch);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    }, [dispatch, setLocalError]);

    useEffect(() => {
        if (hasRequestedUsers.current || users.length > 0) return;
        hasRequestedUsers.current = true;
        fetchUsers();
    }, [users.length, fetchUsers]);

    const uniqueUsers = useMemo(() => dedupeUsers(users), [users]);

    const stats = useMemo(() => {
        const total = uniqueUsers.length;
        const active = uniqueUsers.filter((u) => (u.sessionTimeout ?? 0) > 0).length;
        const newThisMonth = uniqueUsers.filter((u) => isCreatedThisMonth(u.createAt)).length;
        const fullAccess = uniqueUsers.filter((u) => (u.permissions?.length ?? 0) >= PERMISSIONS.length).length;
        return { total, active, newThisMonth, fullAccess };
    }, [uniqueUsers]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        return uniqueUsers.filter((user) => {
            const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
            const matchesSearch =
                !query ||
                fullName.toLowerCase().includes(query) ||
                String(user.username || "").toLowerCase().includes(query);

            const isActive = (user.sessionTimeout ?? 0) > 0;
            const matchesFilter =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "inactive" && !isActive);

            return matchesSearch && matchesFilter;
        });
    }, [uniqueUsers, search, statusFilter]);

    useEffect(() => {
        if (!loading && users.length > 0) hasLoadedUsersRef.current = true;
    }, [loading, users.length]);

    if ((loading || users.length <= 0) && !hasLoadedUsersRef.current) return <TableSkeleton rows={5} cols={7} />;

    const activeFilterLabel = FILTER_OPTIONS.find((f) => f.id === statusFilter)?.label ?? "Filters";

    return (
        <>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <PageHeader
                title="Users Management"
                subtitle="Manage user accounts, permissions, and session settings across the platform."
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search users..."
                onFilterClick={(e) => setFilterAnchor(e.currentTarget)}
                filterLabel={activeFilterLabel}
            />

            <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
                {FILTER_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.id}
                        selected={statusFilter === option.id}
                        onClick={() => {
                            setStatusFilter(option.id);
                            setFilterAnchor(null);
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>

            {localError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {localError}
                </Alert>
            )}

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={PeopleOutlineIcon}
                        label="Total Users"
                        value={stats.total}
                        helper={`${stats.active} with active sessions`}
                        accent={colors.primary}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={PersonOutlineIcon}
                        label="Active Users"
                        value={stats.active}
                        helper={stats.total ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "—"}
                        accent={colors.success}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={PersonAddAltOutlinedIcon}
                        label="New This Month"
                        value={stats.newThisMonth}
                        helper="Based on account create date"
                        accent={colors.accent}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={AdminPanelSettingsOutlinedIcon}
                        label="Full Access"
                        value={stats.fullAccess}
                        helper={stats.total ? `${Math.round((stats.fullAccess / stats.total) * 100)}% of total` : "—"}
                        accent={colors.primary}
                    />
                </Grid>
            </Grid>

            {isDesktop ? (
                <Card sx={tableSurfaceSx}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["User", "Access", "Session", "Created", "Status", "Permissions", "Actions"].map((head) => (
                                        <TableCell key={head} sx={tableHeadCellSx}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const fullName = `${user.firstName} ${user.lastName}`.trim();
                                    const access = deriveAccessLabel(user.permissions);
                                    const isActive = (user.sessionTimeout ?? 0) > 0;

                                    return (
                                        <TableRow key={getUserIdentityKey(user)} hover sx={tableRowSx}>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1.25}>
                                                    <Avatar name={fullName} username={user.username} size={32} />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {fullName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            @{user.username}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ borderColor: "divider" }}>
                                                <Chip size="small" label={access.label} color={access.color} variant="outlined" />
                                            </TableCell>
                                            <TableCell sx={{ borderColor: "divider" }}>
                                                <Typography variant="body2">{user.sessionTimeout ?? 0} min</Typography>
                                            </TableCell>
                                            <TableCell sx={{ borderColor: "divider" }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.createAt ?? "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ borderColor: "divider" }}>
                                                <StatusBadge status={isActive ? "active" : "inactive"} />
                                            </TableCell>
                                            <TableCell sx={{ borderColor: "divider", minWidth: 180 }}>
                                                <PermissionBadgeGroup permissions={user.permissions} compact />
                                            </TableCell>
                                            <TableCell sx={{ borderColor: "divider" }}>
                                                <Box display="flex" gap={0.75}>
                                                    <Tooltip title="Edit">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="inherit"
                                                            onClick={() => openEditUser(user)}
                                                            sx={editActionIconSx}
                                                        >
                                                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="inherit"
                                                            onClick={() => deleteUser(user._id)}
                                                            sx={deleteActionIconSx}
                                                        >
                                                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {!filteredUsers.length && (
                        <EmptyState
                            compact
                            title="No users found"
                            description="Try adjusting your search or filter criteria."
                        />
                    )}
                </Card>
            ) : (
                <Stack spacing={2}>
                    {filteredUsers.map((user) => (
                        <Box key={getUserIdentityKey(user)}>
                            <UserRowCard user={user} onEdit={openEditUser} onDelete={deleteUser} />
                        </Box>
                    ))}
                    {!filteredUsers.length && (
                        <EmptyState
                            title="No users found"
                            description="Try adjusting your search or filter criteria."
                        />
                    )}
                </Stack>
            )}
        </motion.div>

        {editingUser && <EditUser user={editingUser} onClose={closeEditUser} />}
        </>
    );
}
