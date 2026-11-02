import { useState } from "react";
import { Alert, Box, Button, FormControl, FormLabel, IconButton, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Navigate } from "react-router-dom";
import { changePasswordAfterFirstLoginService } from "../services/users";
import { readStoredBoolean, readStoredToken } from "../utils/sessionLogout";
import AuthCard from "../design-system/components/AuthCard";

export default function ChangePasswordFirstLogin() {
    const navigate = useNavigate();
    const token = readStoredToken();
    const mustChangePassword = readStoredBoolean("mustChangePassword");
    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (!token) return <Navigate to="/" replace />;
    if (!mustChangePassword) return <Navigate to="/home" replace />;

    const handleForm = ({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const savePassword = async (e) => {
        e.preventDefault();
        const mustChangePassword = readStoredBoolean("mustChangePassword");

        if (!mustChangePassword) return navigate("/home");
        if (!form.newPassword || form.newPassword.length < 6) return setError("Password must be at least 6 characters.");
        if (form.newPassword !== form.confirmPassword) return setError("Passwords do not match.");

        try {
            setSaving(true);
            const { code, message, token } = await changePasswordAfterFirstLoginService(form.newPassword);
            if (code !== 200) {
                setError(message);
                return;
            }
            // Replace the temporary-password token with a fresh one (tokenVersion incremented).
            // Without this, every subsequent API call would get a 401 from enforcePasswordChanged
            // because the DB tokenVersion is now ahead of the stale claim in the old token.
            if (token) {
                localStorage.setItem("token", JSON.stringify(token));
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    if (payload.exp) {
                        localStorage.setItem("sessionExpirationTime", String(payload.exp * 1000));
                    }
                } catch {
                    // non-fatal — SessionTimeout will fall back to mount-time scheduling
                }
            }
            localStorage.setItem("mustChangePassword", JSON.stringify(false));
            navigate("/home");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthCard
            title="Set your new password"
            subtitle="For security, you must replace your temporary password before continuing."
        >
            <Box component="form" onSubmit={savePassword} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <FormControl>
                    <FormLabel htmlFor="change-password-new" sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>New password</FormLabel>
                    <TextField
                        id="change-password-new"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        size="small"
                        onChange={handleForm}
                        value={form.newPassword}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    type="button"
                                    size="small"
                                    onClick={() => setShowNewPassword((v) => !v)}
                                    edge="end"
                                    sx={{ color: "text.secondary" }}
                                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                    aria-pressed={showNewPassword}
                                    aria-controls="change-password-new"
                                >
                                    {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            ),
                        }}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="change-password-confirm" sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Confirm new password</FormLabel>
                    <TextField
                        id="change-password-confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        size="small"
                        onChange={handleForm}
                        value={form.confirmPassword}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    type="button"
                                    size="small"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    edge="end"
                                    sx={{ color: "text.secondary" }}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    aria-pressed={showConfirmPassword}
                                    aria-controls="change-password-confirm"
                                >
                                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            ),
                        }}
                    />
                </FormControl>

                {error && <Alert severity="error" role="alert" sx={{ py: 0.5 }}>{error}</Alert>}

                <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={saving}>
                    {saving ? "Saving…" : "Save new password"}
                </Button>
            </Box>
        </AuthCard>
    );
}
