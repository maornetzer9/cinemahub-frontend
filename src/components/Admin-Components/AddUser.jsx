import { Alert, Box } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useEffect } from "react";
import { validateUserFields, useUsersFormHandler } from "../../hooks/validations";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import { addNewUserService } from "../../services/users";
import useModalCloseAnimation from "../../hooks/useModalCloseAnimation";
import InputModel from "../UI/InputModel";
import { CRUD_MODAL_EXIT_MS, crudAlertSx } from "../../design-system/styles";
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

export default function AddUser({ selectedComponent = "", componentsHandler = () => {} }) {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.userReducer);

    const { localError, setLocalError } = useLocalError();
    const { isOpen, isClosing, closeWithAnimation } = useModalCloseAnimation(
        () => componentsHandler("All Users"),
        CRUD_MODAL_EXIT_MS
    );
    const { form, formError, formHandler, setFormError } = useUsersFormHandler({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        sessionTimeout: 0,
        permissions: [],
    });

    const FORM_ATTRIBUTES = [
        { label: "First Name", name: "firstName", type: "text", autoComplete: "firstName", inputLabel: "Enter first name" },
        { label: "Last Name", name: "lastName", type: "text", autoComplete: "lastName", inputLabel: "Enter last name" },
        { label: "Username", name: "username", type: "text", autoComplete: "username", inputLabel: "Enter username" },
        { label: "Email Address", name: "email", type: "email", autoComplete: "email", inputLabel: "Welcome email with temporary password" },
        { label: "Session Timeout (Minutes)", name: "sessionTimeout", type: "number", autoComplete: "sessionTimeout", inputLabel: "Minutes", helperText: "Set to 0 for no automatic logout." },
    ];

    const addNewUser = async () => {
        const isValid = validateUserFields(form, setFormError, { requireAdminCreateOnboardingFields: true });
        if (!isValid) return;
        try {
            const { code, message } = await addNewUserService(form, dispatch);
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

    const isVisible = selectedComponent === "Add User" && isOpen;

    return (
        <CrudDialog open={isVisible} onClose={closeWithAnimation} size="lg" compact>
            <CrudModalHeader
                icon={PersonAddOutlinedIcon}
                title="Create New User"
                subtitle="Add a new account. A temporary password will be generated and emailed automatically."
                onClose={closeWithAnimation}
                accent="user"
                compact
            />

            <CrudPanelBody compact>
                <CrudModalSection title="User Information" icon={BadgeOutlinedIcon} compact>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={1.25}>
                        {FORM_ATTRIBUTES.map((field) => (
                            <CrudModalField
                                key={field.name}
                                label={field.label}
                                helperText={field.helperText}
                                fullWidth={field.name === "sessionTimeout"}
                                compact
                            >
                                <InputModel
                                    compact
                                    hideLabel
                                    error={!!formError[field.name]}
                                    helperText={formError[field.name]}
                                    label={field.inputLabel}
                                    type={field.type}
                                    name={field.name}
                                    autoComplete={field.autoComplete}
                                    onChange={formHandler}
                                />
                            </CrudModalField>
                        ))}
                    </Box>
                </CrudModalSection>

                <PermissionCards
                    form={form}
                    formHandler={formHandler}
                    formError={formError}
                    showError
                    compact
                />
            </CrudPanelBody>

            <CrudPanelFooter>
                <CrudModalActions
                    onCancel={closeWithAnimation}
                    onSave={addNewUser}
                    saveLabel="Create User"
                    disabled={isClosing}
                    accent="user"
                    saveIcon={SaveOutlinedIcon}
                    compact
                />

                {localError && (
                    <Alert severity="error" variant="filled" sx={{ ...crudAlertSx, py: 0.5 }}>
                        {localError || error}
                    </Alert>
                )}
            </CrudPanelFooter>
        </CrudDialog>
    );
}
