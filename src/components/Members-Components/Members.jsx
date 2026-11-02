import { memo, useCallback, useEffect, useState } from "react";
import { Alert, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loadingMembers } from "../../services/members";
import { useLocalError } from "../../hooks/error";
import PermissionButton from "../UI/PermissionButton";
import AllMembers from "./AllMembers";
import AddMember from "./AddMember";
import EditMember from "./EditMember";
import AddIcon from "@mui/icons-material/Add";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { MemberGridSkeleton } from "../../design-system/components/Skeleton";
import EmptyState from "../../design-system/components/EmptyState";
import PageWrapper from "../layout/PageWrapper";

const Members = () => {
    const dispatch = useDispatch();
    const { loading, members } = useSelector((state) => state.membersReducer);
    const { localError, setLocalError } = useLocalError();

    const [addMember, setAddMember] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [membersReady, setMembersReady] = useState(false);

    const openAddMember = useCallback(() => setAddMember(true), []);
    const closeAddMember = useCallback(() => setAddMember(false), []);
    const openEditMember = useCallback((member) => setEditingMember(member), []);
    const closeEditMember = useCallback(() => setEditingMember(null), []);

    const fetchMembers = useCallback(async () => {
        try {
            if (members.length === 0) await loadingMembers(dispatch);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        } finally {
            setMembersReady(true);
        }
    }, [dispatch, members.length, setLocalError]);

    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    if (!membersReady || (loading && members.length === 0)) {
        return (
            <PageWrapper>
                <MemberGridSkeleton count={6} />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            {localError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {localError}
                </Alert>
            )}

            {members.length === 0 ? (
                !localError && (
                    <EmptyState
                        icon={PeopleOutlineIcon}
                        title="No members yet"
                        description="There are no members in the system. Add a member to start managing subscriptions."
                    />
                )
            ) : (
                <AllMembers members={members} onEditMember={openEditMember} />
            )}
            {addMember && <AddMember onClose={closeAddMember} />}
            {editingMember && (
                <EditMember member={editingMember} onClose={closeEditMember} />
            )}

            <Tooltip title="Add Member">
                <PermissionButton
                    resourceType="subscriptions"
                    permissionType="create"
                    type="fab"
                    size="large"
                    color="primary"
                    aria-label="add"
                    onClick={openAddMember}
                >
                    <AddIcon />
                </PermissionButton>
            </Tooltip>
        </PageWrapper>
    );
};

export default memo(Members);
