import { useMemo } from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import {
    loginGlassCardSx,
    loginIconGlowSx,
    loginInputSx,
    loginPrimaryButtonSx,
} from "../../design-system/styles";
import { colors } from "../../design-system/tokens";

// Animated cinema icon shown at the top of the card.
function LoginCinemaIcon({ animate }) {
    return (
        <Box sx={{ position: "relative", width: 88, height: 88, mx: "auto", mb: 2 }}>
            {animate && (
                <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "1px dashed rgba(168,85,247,0.3)",
                            willChange: "transform",
                        }}
                    />
                    <motion.div
                        animate={{ rotate: -360, scale: [1, 1.03, 1] }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        }}
                        style={{
                            position: "absolute",
                            inset: 6,
                            borderRadius: "50%",
                            border: "1px solid rgba(147,112,246,0.28)",
                            boxShadow: "0 0 24px rgba(124,58,237,0.2)",
                            willChange: "transform",
                        }}
                    />
                </>
            )}
            <Box
                component={motion.div}
                animate={animate ? { scale: [1, 1.045, 1], boxShadow: [
                    "0 0 32px rgba(124,58,237,0.24)",
                    "0 0 58px rgba(147,112,246,0.42)",
                    "0 0 32px rgba(124,58,237,0.24)",
                ] } : undefined}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                sx={{ ...loginIconGlowSx, mx: "auto", border: "1px solid rgba(168,85,247,0.4)", bgcolor: "rgba(124,58,237,0.1)" }}
            >
                <MovieFilterOutlinedIcon sx={{ fontSize: 32, color: colors.accent }} />
            </Box>
        </Box>
    );
}

// Presentational sign-in card. All authentication state and handlers are owned
// by the page and passed in as props — this component contains no auth logic.
export default function LoginFormCard({
    animate,
    reducedMotion,
    cardParallaxX,
    cardParallaxY,
    onSubmit,
    onChange,
    showPassword,
    onTogglePassword,
    localError,
    loading,
    registerSuccess,
}) {
    const glassCardSx = useMemo(
        () => (animate ? loginGlassCardSx : { ...loginGlassCardSx, "&::after": { animation: "none" } }),
        [animate],
    );

    return (
        <Grid
            item
            xs={12}
            md={5}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 2, sm: 3 },
                py: { xs: 4, md: 5 },
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: reducedMotion ? 0 : 28, scale: reducedMotion ? 1 : 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", maxWidth: 440, x: cardParallaxX, y: cardParallaxY, willChange: "transform" }}
            >
                <Box
                    component={motion.div}
                    animate={animate ? { y: [0, -6, 0] } : undefined}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ willChange: "transform" }}
                >
                    <Box sx={glassCardSx}>
                        <LoginCinemaIcon animate={animate} />

                        <Typography variant="h5" fontWeight={700} textAlign="center" mb={0.5}>
                            Sign in
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                            Welcome back enter your details to continue.
                        </Typography>

                        {registerSuccess && (
                            <Alert severity="success" sx={{ mb: 2.5, py: 0.5 }}>
                                Account created successfully. Sign in to continue.
                            </Alert>
                        )}

                        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                            <FormControl>
                                <FormLabel htmlFor="login-username" sx={{ mb: 0.75, fontSize: "0.8125rem", fontWeight: 500, color: "text.secondary" }}>
                                    Username
                                </FormLabel>
                                <TextField
                                    id="login-username"
                                    name="username"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    size="small"
                                    onChange={onChange}
                                    error={!!localError?.username}
                                    helperText={localError?.username}
                                    FormHelperTextProps={{ role: "alert" }}
                                    fullWidth
                                    InputProps={{
                                        sx: loginInputSx,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon sx={{ fontSize: 18, color: colors.textMuted }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="login-password" sx={{ mb: 0.75, fontSize: "0.8125rem", fontWeight: 500, color: "text.secondary" }}>
                                    Password
                                </FormLabel>
                                <TextField
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    size="small"
                                    onChange={onChange}
                                    error={!!localError?.password}
                                    helperText={localError?.password}
                                    FormHelperTextProps={{ role: "alert" }}
                                    fullWidth
                                    InputProps={{
                                        sx: loginInputSx,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon sx={{ fontSize: 18, color: colors.textMuted }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="button"
                                                    size="small"
                                                    onClick={onTogglePassword}
                                                    edge="end"
                                                    sx={{ color: "text.secondary" }}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                    aria-pressed={showPassword}
                                                    aria-controls="login-password"
                                                >
                                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>

                            {localError?.general && <Alert severity="error" role="alert" sx={{ py: 0.5 }}>{localError.general}</Alert>}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    ...loginPrimaryButtonSx,
                                    ...(animate ? {} : { animation: "none" }),
                                }}
                            >
                                {loading ? "Signing in…" : "Sign in"}
                            </Button>
                        </Box>

                        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" underline="hover" color="primary.main">Sign up</Link>
                        </Typography>
                    </Box>
                </Box>
            </motion.div>

            <Typography variant="caption" color="text.secondary" mt={3} textAlign="center">
                © 2026 CinemaHub. All rights reserved.
            </Typography>
        </Grid>
    );
}
