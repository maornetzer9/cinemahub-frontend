import { useEffect, useState } from "react";
import { Alert, Box, TextField } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import { addNewMemberService } from "../../services/members";
import useModalCloseAnimation from "../../hooks/useModalCloseAnimation";
import { CRUD_MODAL_EXIT_MS, crudAlertSx, crudTextFieldProps } from "../../design-system/styles";
import {
    CrudDialog,
    CrudModalActions,
    CrudModalField,
    CrudModalHeader,
    CrudModalSection,
} from "../../design-system/components/crudModalParts";

export default function AddMember({ onClose = () => {} }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.membersReducer);
    const { localError, setLocalError } = useLocalError();
    const { isOpen, isClosing, closeWithAnimation } = useModalCloseAnimation(
        onClose,
        CRUD_MODAL_EXIT_MS
    );
    const [newMember, setNewMember] = useState({ name: "", email: "", city: "" });

    const newMemberHandler = ({ target: { name, value } }) => setNewMember({ ...newMember, [name]: value });

    const addNewMember = async (memberData) => {
        const { name, email, city } = memberData;
        if (!name || !email || !city) return setLocalError("All fields are required...");

        try {
            const { code, message } = await addNewMemberService(memberData, dispatch);
            if (code === 200) {
                closeWithAnimation();
            } else {
                setLocalError(message);
            }
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    useEffect(() => {
        if (error) setLocalError(error);
    }, [error, setLocalError]);

    return (
        <Box component="div">
            <CrudDialog open={isOpen} onClose={closeWithAnimation} size="sm">
                <CrudModalHeader
                    icon={PersonAddOutlinedIcon}
                    title="Add Member"
                    subtitle="Create a new member profile for subscriptions management."
                    onClose={closeWithAnimation}
                    accent="member"
                />

                <CrudModalSection title="Member Information" icon={BadgeOutlinedIcon}>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
                        <CrudModalField label="Name">
                            <TextField {...crudTextFieldProps} name="name" placeholder="Enter name" onChange={newMemberHandler} />
                        </CrudModalField>
                        <CrudModalField label="Email">
                            <TextField {...crudTextFieldProps} name="email" placeholder="Enter email" onChange={newMemberHandler} />
                        </CrudModalField>
                        <CrudModalField label="City" fullWidth>
                            <TextField {...crudTextFieldProps} name="city" placeholder="Enter city" onChange={newMemberHandler} />
                        </CrudModalField>
                    </Box>
                </CrudModalSection>

                {localError && (
                    <Alert variant="filled" severity="error" sx={crudAlertSx}>
                        {localError}
                    </Alert>
                )}

                <CrudModalActions
                    onCancel={closeWithAnimation}
                    onSave={() => addNewMember(newMember)}
                    saveLabel="Save Member"
                    saving={loading}
                    savingLabel="Saving..."
                    disabled={isClosing}
                    accent="member"
                    saveIcon={SaveOutlinedIcon}
                />
            </CrudDialog>
        </Box>
    );
}
