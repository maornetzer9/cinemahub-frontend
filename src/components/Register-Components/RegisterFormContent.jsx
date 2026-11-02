import { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerService } from "../../services/users";
import { useLocalError } from "../../hooks/error";
import { useValidForm } from "../../hooks/validations";
import RegisterFormShell from "./RegisterFormShell";
import { useRegisterPageReady } from "./useRegisterPageReady";

export default function RegisterFormContent({ reducedMotion, cardParallaxX, cardParallaxY, animate }) {
    const { signalFormReady } = useRegisterPageReady();
    const { loading } = useSelector((state) => state.userReducer);
    const { validRegisterForm } = useValidForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
    const { localError, setLocalError } = useLocalError();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        signalFormReady();
    }, [signalFormReady]);

    const handleForm = ({ target: { name, value } }) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    const register = async (e) => {
        e.preventDefault();
        if (!validRegisterForm(form, setLocalError)) return;

        try {
            const { code, message } = await registerService(
                { username: form.username, password: form.password },
                dispatch
            );
            if (code !== 200) return setLocalError({ general: message });
            navigate("/", { state: { registerSuccess: true } });
        } catch (err) {
            console.error(err.message);
            setLocalError({ general: err.message });
        }
    };

    return (
        <RegisterFormShell
            title="Create demo account"
            subtitle="Sign up for read-only access to explore the portfolio."
            footer={
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                    Already have an account?{" "}
                    <Link href="/" underline="hover" color="primary.main">Sign in</Link>
                </Typography>
            }
            reducedMotion={reducedMotion}
            cardParallaxX={cardParallaxX}
            cardParallaxY={cardParallaxY}
            animate={animate}
        >
            <Box component="form" onSubmit={register} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <FormControl>
                    <FormLabel htmlFor="register-username" sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Username</FormLabel>
                    <TextField
                        id="register-username"
                        name="username"
                        placeholder="Choose a username"
                        autoComplete="username"
                        size="small"
                        onChange={handleForm}
                        error={!!localError?.username}
                        helperText={localError?.username}
                        FormHelperTextProps={{ role: "alert" }}
                        fullWidth
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="register-password" sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Password</FormLabel>
                    <TextField
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        size="small"
                        onChange={handleForm}
                        error={!!localError?.password}
                        helperText={localError?.password}
                        FormHelperTextProps={{ role: "alert" }}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    type="button"
                                    size="small"
                                    onClick={() => setShowPassword((v) => !v)}
                                    edge="end"
                                    sx={{ color: "text.secondary" }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    aria-controls="register-password"
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            ),
                        }}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="register-confirm-password" sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>Confirm password</FormLabel>
                    <TextField
                        id="register-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        size="small"
                        onChange={handleForm}
                        error={!!localError?.confirmPassword}
                        helperText={localError?.confirmPassword}
                        FormHelperTextProps={{ role: "alert" }}
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
                                    aria-controls="register-confirm-password"
                                >
                                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            ),
                        }}
                    />
                </FormControl>

                {localError?.general && <Alert severity="error" role="alert" sx={{ py: 0.5 }}>{localError.general}</Alert>}

                <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </Button>
            </Box>
        </RegisterFormShell>
    );
}
