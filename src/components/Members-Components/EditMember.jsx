import { useEffect, useState } from "react";
import { Alert, Box, TextField } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDispatch, useSelector } from "react-redux";
import { editMemberService } from "../../services/members";
import { useLocalError } from "../../hooks/error";
import useModalCloseAnimation from "../../hooks/useModalCloseAnimation";
import { CRUD_MODAL_EXIT_MS, crudAlertSx, crudTextFieldProps } from "../../design-system/styles";
import {
    CrudDialog,
    CrudModalActions,
    CrudModalField,
    CrudModalHeader,
    CrudModalSection,
} from "../../design-system/components/crudModalParts";

export default function EditMember({ member, onClose = () => {} }) {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.membersReducer);

    const { localError, setLocalError } = useLocalError();
    const { isOpen, isClosing, closeWithAnimation } = useModalCloseAnimation(
        onClose,
        CRUD_MODAL_EXIT_MS
    );
    const [form, setForm] = useState({
        _id: member._id || "",
        name: member.name || "",
        email: member.email || "",
        city: member.city || "",
    });

    const formHandler = ({ target: { name, value } }) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    const editMember = async () => {
        const { _id, name, email, city } = form;
        if (!_id || !name || !email || !city) return setLocalError("All fields are required...");

        try {
            const { code } = await editMemberService(form, dispatch);
            if (code === 200) return closeWithAnimation();
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    useEffect(() => {
        if (error) return setLocalError(error);
    }, [error, setLocalError]);

    return (
        <Box component="div">
            <CrudDialog open={isOpen} onClose={closeWithAnimation} size="sm">
                <CrudModalHeader
                    icon={PersonOutlinedIcon}
                    title="Edit Member Details"
                    subtitle={
                        <>
                            Update member details for{" "}
                            <Box component="span" color="text.primary" fontWeight={600}>
                                {member.name}
                            </Box>
                            .
                        </>
                    }
                    onClose={closeWithAnimation}
                    accent="member"
                />

                <CrudModalSection title="Member Information" icon={BadgeOutlinedIcon}>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
                        <CrudModalField label="Name">
                            <TextField
                                {...crudTextFieldProps}
                                defaultValue={member.name}
                                onChange={formHandler}
                                placeholder="Enter name"
                                name="name"
                            />
                        </CrudModalField>
                        <CrudModalField label="Email">
                            <TextField
                                {...crudTextFieldProps}
                                defaultValue={member.email}
                                onChange={formHandler}
                                placeholder="Enter email"
                                name="email"
                            />
                        </CrudModalField>
                        <CrudModalField label="City" fullWidth>
                            <TextField
                                {...crudTextFieldProps}
                                defaultValue={member.city}
                                onChange={formHandler}
                                placeholder="Enter city"
                                name="city"
                            />
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
                    onSave={editMember}
                    saveLabel="Save Member"
                    disabled={isClosing}
                    accent="member"
                    saveIcon={SaveOutlinedIcon}
                />
            </CrudDialog>
        </Box>
    );
}
