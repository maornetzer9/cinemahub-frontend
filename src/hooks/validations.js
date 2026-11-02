import { useState } from "react";

export const useValidForm = () => {
    const [ error, setError ] = useState({
        username: '',
        password: '',
        general: ''
    });

    const validForm = ( form, setLocalError) => {

        let valid = true;
        let newErrors = { username: "", password: "" };

        // Username validation
        if (!form.username) 
        {
            newErrors.username = "Username is required.";
            valid = false;
        }

        // Password validation
        if (!form.password) 
        {
            newErrors.password = "Password is required.";
            valid = false;
        } else if (form.password.length < 6) 
        {
            newErrors.password = "Password must be at least 6 characters.";
            valid = false;
        }

        setLocalError(newErrors);
        return valid;
    };

    const validRegisterForm = (form, setLocalError) => {
        let valid = true;
        let newErrors = { username: "", password: "", confirmPassword: "" };

        if (!form.username) {
            newErrors.username = "Username is required.";
            valid = false;
        }

        if (!form.password) {
            newErrors.password = "Password is required.";
            valid = false;
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            valid = false;
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
            valid = false;
        } else if (form.password && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        }

        setLocalError(newErrors);
        return valid;
    };

    return { error, setError, validForm, validRegisterForm };
};


// Hook handler that will handle valid form of adding new user.0*-
export const validateUserFields = (form, setFormError, options = {}) => {
    const { requireAdminCreateOnboardingFields = false } = options;
    const errors = {};
    const { firstName, lastName, username, email, sessionTimeout, permissions } = form;

    if (!firstName || !String(firstName).trim())  errors.firstName = 'Please enter first name';
    if (!lastName || !String(lastName).trim())  errors.lastName = 'Please enter last name';
    if (!username || !String(username).trim())  errors.username = 'Please enter username';

    if (requireAdminCreateOnboardingFields) {
        const emailValue = (email && String(email).trim()) || '';
        if (!emailValue) {
            errors.email = 'Please enter an email address';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            errors.email = 'Please enter a valid email address';
        }
    }

    if (!sessionTimeout || sessionTimeout <= 0)  errors.sessionTimeout = 'Please enter session timeout';
    if (!permissions.length)                     errors.permissions = 'Please choose user permissions';

    setFormError(errors);

    return Object.keys(errors).length === 0;
};


// Hook handler that will handle all the checkbox and the input to user permissions and other data.
export const useUsersFormHandler = (initialState = {}, initialErrors = {}) => {
    const [form, setForm] = useState(initialState);
    const [formError, setFormError] = useState(initialErrors);

    const formHandler = ({ target: { name, checked, value } }) => {
        if (name === "permissions") 
        {
            setForm((prevForm) => {
                let updatedPermissions = checked
                    ? [...prevForm.permissions, value]
                    : prevForm.permissions.filter((permission) => permission !== value);

                // Handle automatic "View" permission logic
                const relatedPermissions = {
                    "View-Subscriptions": ["Create-Subscriptions", "Delete-Subscriptions", "Update-Subscriptions"],
                    "View-Movies": ["Create-Movies", "Delete-Movies", "Update-Movies"],
                };

                for (const [viewPermission, actions] of Object.entries(relatedPermissions)) 
                {
                    if (checked && actions.includes(value) && !updatedPermissions.includes(viewPermission)) 
                    {
                        updatedPermissions.push(viewPermission);
                    }
                    if (!checked && value === viewPermission) 
                    {
                        updatedPermissions = updatedPermissions.filter((perm) => !actions.includes(perm));
                    }
                    if (
                        !checked &&
                        actions.includes(value) &&
                        !updatedPermissions.some((perm) => actions.includes(perm))
                    ) {
                        updatedPermissions = updatedPermissions.filter((perm) => perm !== viewPermission);
                    }
                }

                return { ...prevForm, permissions: updatedPermissions };
            });
        } 
        else 
        {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: name === "sessionTimeout" ? parseInt(value, 10) || 0 : value,
            }));
        }

        setFormError((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    return { form, formError, formHandler, setForm, setFormError };
};
