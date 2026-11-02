import { useCallback, useMemo, useState } from "react";
import { Box, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MemberCard from "./MemberCard";
import NewSubscription from "./NewSubscription";
import PageHeader from "../../design-system/components/PageHeader";
import StatCard from "../../design-system/components/StatCard";
import { colors } from "../../design-system/tokens";

const FILTER_OPTIONS = [
    { id: "all", label: "All Members" },
    { id: "subscribed", label: "With Subscriptions" },
    { id: "empty", label: "No Subscriptions" },
];

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function parseSubscriptionDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function isExpiringSoon(dateValue, withinDays = 30) {
    const date = parseSubscriptionDate(dateValue);
    if (!date) return false;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return diff >= 0 && diff <= withinDays * MS_IN_DAY;
}

export default function AllMembers({ members, onEditMember = () => {} }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [subscriptionMember, setSubscriptionMember] = useState(null);
    const [subscriptionOpen, setSubscriptionOpen] = useState(false);

    const handleOpenSubscription = useCallback((member) => {
        setSubscriptionMember(member);
        setSubscriptionOpen(true);
    }, []);

    const handleCloseSubscription = useCallback(() => {
        setSubscriptionOpen(false);
    }, []);

    const stats = useMemo(() => {
        const total = members.length;
        const withSubscriptions = members.filter((m) => (m.subscriptions?.length ?? 0) > 0).length;
        const totalSubscriptions = members.reduce((sum, m) => sum + (m.subscriptions?.length ?? 0), 0);
        const expiringSoon = members.reduce((sum, member) => {
            const count = (member.subscriptions ?? []).filter((sub) => isExpiringSoon(sub.date)).length;
            return sum + count;
        }, 0);
        return { total, withSubscriptions, totalSubscriptions, expiringSoon };
    }, [members]);

    const filteredMembers = useMemo(() => {
        const query = search.trim().toLowerCase();
        return members.filter((member) => {
            const matchesSearch =
                !query ||
                String(member.name || "").toLowerCase().includes(query) ||
                String(member.email || "").toLowerCase().includes(query) ||
                String(member.city || "").toLowerCase().includes(query);

            const subCount = member.subscriptions?.length ?? 0;
            const matchesFilter =
                statusFilter === "all" ||
                (statusFilter === "subscribed" && subCount > 0) ||
                (statusFilter === "empty" && subCount === 0);

            return matchesSearch && matchesFilter;
        });
    }, [members, search, statusFilter]);

    const activeFilterLabel = FILTER_OPTIONS.find((f) => f.id === statusFilter)?.label ?? "Filters";

    return (
        <>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <PageHeader
                title="Subscriptions"
                subtitle="Manage member subscriptions and track movie access across your platform."
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search members..."
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

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={PeopleOutlineIcon}
                        label="Total Members"
                        value={stats.total}
                        helper={`${stats.withSubscriptions} with subscriptions`}
                        accent="#60a5fa"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={SubscriptionsOutlinedIcon}
                        label="Active Subscriptions"
                        value={stats.totalSubscriptions}
                        helper={stats.total ? `Across ${stats.withSubscriptions} members` : "—"}
                        accent="#34d399"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={TrendingUpOutlinedIcon}
                        label="Subscribed Members"
                        value={stats.withSubscriptions}
                        helper={stats.total ? `${Math.round((stats.withSubscriptions / stats.total) * 100)}% of members` : "—"}
                        accent="#818cf8"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        icon={EventOutlinedIcon}
                        label="Expiring Soon"
                        value={stats.expiringSoon}
                        helper="Within the next 30 days"
                        accent={colors.warning}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {filteredMembers.map((member, index) => (
                    <Grid item xs={12} sm={6} xl={4} key={member._id ?? index}>
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.03 }}
                            style={{ height: "100%" }}
                        >
                            <MemberCard member={member} onEditMember={onEditMember} onSubscribe={handleOpenSubscription} />
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {!filteredMembers.length && (
                <Box py={6} textAlign="center">
                    <Typography color="text.secondary">No members match your search or filter.</Typography>
                </Box>
            )}
        </motion.div>

        <NewSubscription
            member={subscriptionMember ?? {}}
            open={subscriptionOpen}
            onClose={handleCloseSubscription}
        />
        </>
    );
}
