import { useEffect } from "react";
import { Alert, Box, Typography } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputModel from "../UI/InputModel";
import { useDispatch, useSelector } from "react-redux";
import { validateUserFields, useUsersFormHandler } from "../../hooks/validations";
import { editUserService } from "../../services/users";
import { useLocalError } from "../../hooks/error";
import useModalCloseAnimation from "../../hooks/useModalCloseAnimation";
import { CRUD_MODAL_EXIT_MS, crudAlertSx, crudReadOnlyFieldSx } from "../../design-system/styles";
import {
    CrudDialog,
    CrudModalActions,
    CrudModalField,
    CrudModalHeader,
    CrudModalSection,
    CrudPanelBody,
    CrudPanelFooter,
    PermissionCards,
} from "../../design-system/components/crudModalParts";

export default function EditUser({ user = {}, onClose = () => {} }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.userReducer);

    const { localError, setLocalError } = useLocalError();
    const { isOpen, isClosing, closeWithAnimation } = useModalCloseAnimation(onClose, CRUD_MODAL_EXIT_MS);
    const { form, formError = {}, formHandler, setFormError } = useUsersFormHandler(
        {
            _id: user._id || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            sessionTimeout: user.sessionTimeout || 0,
            createAt: user.createAt || new Date().toLocaleDateString(),
            permissions: user?.permissions || [],
        },
        setLocalError
    );

    const EDIT_FORM_ATTRIBUTES = [
        { label: "First Name", name: "firstName", type: "text", autoComplete: "First Name", value: user?.firstName || "", placeholder: "Enter first name" },
        { label: "Last Name", name: "lastName", type: "text", autoComplete: "Last Name", value: user?.lastName || "", placeholder: "Enter last name" },
        { label: "Username", name: "username", type: "text", autoComplete: "username", value: user?.username || "", placeholder: "Enter username" },
        { label: "Session Timeout (Minutes)", name: "sessionTimeout", type: "number", autoComplete: "sessionTimeout", value: user?.sessionTimeout || 0, placeholder: "Minutes" },
        { label: "Created At", name: "createAt", type: "text", autoComplete: "createAt", value: user?.createAt || "—", readOnly: true },
    ];

    const editUser = async (formData) => {
        const isValid = validateUserFields(formData, setFormError);
        if (!isValid) return;
        if (formData.permissions.length <= 0) return setLocalError("User permissions are required.");

        try {
            const { code, message } = await editUserService(formData, dispatch);
            if (code === 200) return closeWithAnimation();
            if (code !== 200) return setLocalError(message);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    useEffect(() => {
        if (Object.keys(formError).length > 0) {
            const timer = setTimeout(() => setFormError({}), 3000);
            return () => clearTimeout(timer);
        }
    }, [formError, setFormError]);

    useEffect(() => {
        if (error) setLocalError(error);
    }, [error, setLocalError]);

    return (
        <CrudDialog open={isOpen} onClose={closeWithAnimation} size="lg" compact>
            <CrudModalHeader
                icon={PersonOutlinedIcon}
                title="Edit User Account"
                subtitle={
                    <>
                        Update profile details and access permissions for{" "}
                        <Box component="span" color="text.primary" fontWeight={600}>
                            {`${user.firstName} ${user.lastName}`}
                        </Box>
                        .
                    </>
                }
                onClose={closeWithAnimation}
                accent="user"
                compact
            />

            <CrudPanelBody compact>
                <CrudModalSection title="User Information" icon={BadgeOutlinedIcon} compact>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={1.25}>
                        {EDIT_FORM_ATTRIBUTES.map((field) => (
                            <CrudModalField key={field.name} label={field.label} compact>
                                {field.name === "createAt" ? (
                                    <Box sx={crudReadOnlyFieldSx}>
                                        <Typography variant="body2">{field.value}</Typography>
                                    </Box>
                                ) : (
                                    <InputModel
                                        compact
                                        hideLabel
                                        name={field.name}
                                        label={field.placeholder}
                                        type={field.type}
                                        onChange={formHandler}
                                        defaultValue={field.value}
                                        autoComplete={field.autoComplete}
                                        helperText={formError[field.name]}
                                        error={Boolean(formError[field.name])}
                                    />
                                )}
                            </CrudModalField>
                        ))}
                    </Box>
                </CrudModalSection>

                <PermissionCards form={form} formHandler={formHandler} formError={formError} compact />
            </CrudPanelBody>

            <CrudPanelFooter>
                <CrudModalActions
                    onCancel={closeWithAnimation}
                    onSave={() => editUser(form)}
                    saveLabel="Save User"
                    saving={loading}
                    savingLabel="Saving..."
                    disabled={isClosing}
                    accent="user"
                    saveIcon={SaveOutlinedIcon}
                    compact
                />

                {(localError || formError.permissions) && (
                    <Alert severity="error" variant="filled" sx={crudAlertSx}>
                        {localError || formError.permissions}
                    </Alert>
                )}
            </CrudPanelFooter>
        </CrudDialog>
    );
}
