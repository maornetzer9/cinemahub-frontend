import { useCallback, useEffect, useMemo } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../design-system/components/PageHeader";
import StatCard from "../design-system/components/StatCard";
import ActivityList from "../design-system/components/ActivityList";
import DSButton from "../design-system/components/DSButton";
import Avatar from "../design-system/components/Avatar";
import { DashboardSkeleton } from "../design-system/components/Skeleton";
import { colors, radius } from "../design-system/tokens";
import { loadingMovies } from "../services/movies";
import { loadingMembers } from "../services/members";
import { loadingUsers } from "../services/users";
import PageWrapper from "./layout/PageWrapper";
import { useTopBarSearch } from "../context/useTopBarSearch";
import { movieMatchesSearch, memberMatchesSearch, userMatchesSearch, normalizeSearchQuery } from "../utils/topBarSearch";
import { readStoredUsername } from "../utils/sessionLogout";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay, ease: "easeOut" } },
});

function parseCreateDate(createAt) {
    if (!createAt) return 0;
    const parts = String(createAt).split("/").map(Number);
    if (parts.length !== 3) return 0;
    const [month, day, year] = parts;
    return new Date(year, month - 1, day).getTime();
}

export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = readStoredUsername();
    const isAdmin = username === "Admin";
    const { search } = useTopBarSearch();
    const hasSearch = normalizeSearchQuery(search).length > 0;

    const { movies, loading: moviesLoading } = useSelector((state) => state.moviesReducer);
    const { members, loading: membersLoading } = useSelector((state) => state.membersReducer);
    const { users, loading: usersLoading } = useSelector((state) => state.userReducer);

    const fetchData = useCallback(async () => {
        try {
            await Promise.all([
                movies.length === 0 ? loadingMovies(dispatch) : Promise.resolve(),
                members.length === 0 ? loadingMembers(dispatch) : Promise.resolve(),
                isAdmin && users.length === 0 ? loadingUsers(dispatch) : Promise.resolve(),
            ]);
        } catch (err) {
            console.error(err.message);
        }
    }, [dispatch, movies.length, members.length, users.length, isAdmin]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const activeSubscriptions = useMemo(
        () => members.reduce((sum, m) => sum + (m.subscriptions?.length ?? 0), 0),
        [members]
    );

    const recentMovies = useMemo(
        () => [...movies]
            .sort((a, b) => new Date(b.premiered || 0) - new Date(a.premiered || 0))
            .slice(0, 5)
            .filter((movie) => movieMatchesSearch(movie, search)),
        [movies, search]
    );

    const recentMembers = useMemo(
        () => [...members]
            .slice(-5)
            .reverse()
            .filter((member) => memberMatchesSearch(member, search)),
        [members, search]
    );

    const recentUsers = useMemo(
        () => [...users]
            .sort((a, b) => parseCreateDate(b.createAt) - parseCreateDate(a.createAt))
            .slice(0, 5)
            .filter((user) => userMatchesSearch(user, search)),
        [users, search]
    );

    const isLoading = moviesLoading || membersLoading || (isAdmin && usersLoading && users.length === 0);

    if (isLoading && movies.length === 0 && members.length === 0) {
        return (
            <PageWrapper>
                <DashboardSkeleton />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <PageHeader
                title="Dashboard"
                subtitle={`Welcome back, ${username}. Here's what's happening across CinemaHub.`}
            />

            <motion.div {...fadeUp(0.05)}>
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard icon={MovieFilterOutlinedIcon} label="Movies" value={movies.length} helper="In catalog" accent={colors.primary} />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard icon={PeopleOutlineIcon} label="Members" value={members.length} helper="Registered members" accent={colors.success} />
                    </Grid>
                    {isAdmin && (
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard icon={AdminPanelSettingsOutlinedIcon} label="Users" value={users.length} helper="System accounts" accent={colors.accent} />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6} lg={isAdmin ? 3 : 6}>
                        <StatCard icon={SubscriptionsOutlinedIcon} label="Active Subscriptions" value={activeSubscriptions} helper="Across all members" accent={colors.warning} />
                    </Grid>
                </Grid>
            </motion.div>

            <motion.div {...fadeUp(0.1)}>
                <Box
                    sx={{
                        borderRadius: `${radius.input}px`,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", letterSpacing: "0.04em", textTransform: "uppercase", mb: 1.5 }}>
                        Quick Actions
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <DSButton variant="primary" startIcon={<MovieFilterOutlinedIcon />} onClick={() => navigate("/movies")}>
                            Browse Movies
                        </DSButton>
                        <DSButton variant="outline" startIcon={<PeopleOutlineIcon />} onClick={() => navigate("/subscriptions")}>
                            View Members
                        </DSButton>
                        {isAdmin && (
                            <DSButton variant="outline" startIcon={<AddIcon />} onClick={() => navigate("/users")}>
                                Manage Users
                            </DSButton>
                        )}
                    </Stack>
                </Box>
            </motion.div>

            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
                    <motion.div {...fadeUp(0.15)} style={{ width: '100%' }}>
                        <ActivityList
                            title="Newest Movies"
                            items={recentMovies.map((m) => ({ ...m, id: m._id }))}
                            emptyTitle={hasSearch ? "No matching movies" : "No movies yet"}
                            emptyDescription={hasSearch ? "Try a different search term." : "Movies will appear here once loaded."}
                            renderIcon={() => <MovieFilterOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />}
                            renderPrimary={(m) => m.name}
                            renderSecondary={(m) => m.genres?.slice(0, 2).join(", ") || "—"}
                            getLink={(m) => `/movies/${m._id}`}
                        />
                    </motion.div>
                </Grid>
                <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
                    <motion.div {...fadeUp(0.2)} style={{ width: '100%' }}>
                        <ActivityList
                            title="Newest Members"
                            items={recentMembers.map((m) => ({ ...m, id: m._id }))}
                            emptyTitle={hasSearch ? "No matching members" : "No members yet"}
                            emptyDescription={hasSearch ? "Try a different search term." : "Members will appear here once added."}
                            renderIcon={(m) => <Avatar name={m.name} username={m.email} size={28} />}
                            renderPrimary={(m) => m.name}
                            renderSecondary={(m) => `${m.subscriptions?.length ?? 0} subscriptions`}
                        />
                    </motion.div>
                </Grid>
                {isAdmin && (
                    <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
                        <motion.div {...fadeUp(0.25)} style={{ width: '100%' }}>
                            <ActivityList
                                title="Recent User Activity"
                                items={recentUsers.map((u) => ({ ...u, id: u._id }))}
                                emptyTitle={hasSearch ? "No matching users" : "No users yet"}
                                emptyDescription={hasSearch ? "Try a different search term." : "User accounts will appear here."}
                                renderIcon={(u) => <Avatar name={`${u.firstName} ${u.lastName}`} username={u.username} size={28} />}
                                renderPrimary={(u) => `${u.firstName} ${u.lastName}`.trim()}
                                renderSecondary={(u) => `@${u.username} · ${u.createAt || "—"}`}
                            />
                        </motion.div>
                    </Grid>
                )}
            </Grid>
        </PageWrapper>
    );
}
