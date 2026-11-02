import { useCallback, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginService } from "../services/users";
import { useValidForm } from "../hooks/validations";
import { loginPageSx } from "../design-system/styles";
import { LOGIN_MOUSE_RANGE, LOGIN_PARALLAX_SCALE, LOGIN_PARALLAX_SPRING } from "./Login-Components/loginConstants";
import LoginBackground from "./Login-Components/LoginBackground";
import LoginHeroPanel from "./Login-Components/LoginHeroPanel";
import LoginFormCard from "./Login-Components/LoginFormCard";

function signInErrorMessage(code, message) {
    if (code === 401 || code === 1) return "Incorrect username or password.";
    if (message === "Failed to login user") return "Sign-in failed. Check your connection and try again.";
    if (typeof message === "string" && message.trim()) return message;
    return "Sign-in failed. Try again.";
}

export default function Login() {
    const { loading } = useSelector((state) => state.userReducer);
    const { validForm } = useValidForm();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ username: "", password: "" });
    // The shared error hook hides every message after three seconds, including a rejected sign-in.
    const [localError, setLocalError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const registerSuccess = location.state?.registerSuccess;
    const reducedMotion = useReducedMotion();
    const animate = !reducedMotion;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, LOGIN_PARALLAX_SPRING);
    const springY = useSpring(mouseY, LOGIN_PARALLAX_SPRING);
    const parallaxX = useTransform(springX, (v) => v * LOGIN_PARALLAX_SCALE.heroX);
    const parallaxY = useTransform(springY, (v) => v * LOGIN_PARALLAX_SCALE.heroY);
    const cardParallaxX = useTransform(springX, (v) => v * LOGIN_PARALLAX_SCALE.cardX);
    const cardParallaxY = useTransform(springY, (v) => v * LOGIN_PARALLAX_SCALE.cardY);

    const handleMouseMove = useCallback((event) => {
        if (reducedMotion) return;
        const x = (event.clientX / window.innerWidth - 0.5) * LOGIN_MOUSE_RANGE.x;
        const y = (event.clientY / window.innerHeight - 0.5) * LOGIN_MOUSE_RANGE.y;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY, reducedMotion]);

    const handleForm = ({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setLocalError((current) => {
            if (!current || (!current[name] && !current.general)) return current;
            return { ...current, [name]: "", general: "" };
        });
    };

    const login = async (e) => {
        e.preventDefault();
        if (!validForm(form, setLocalError)) return;
        try {
            const result = await loginService(form.username, form.password, dispatch);
            const code = result && result.code;
            const message = result && result.message;
            if (code !== 200) {
                setLocalError({ general: signInErrorMessage(code, message) });
                return;
            }
            if (result.mustChangePassword) return navigate("/change-password");
            navigate("/home");
        } catch (err) {
            console.error(err && err.message);
            setLocalError({ general: "Sign-in failed. Check your connection and try again." });
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onMouseMove={handleMouseMove}
            sx={loginPageSx}
        >
            <LoginBackground animate={animate} />

            <Grid container sx={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
                <LoginHeroPanel
                    parallaxX={parallaxX}
                    parallaxY={parallaxY}
                    animate={animate}
                    reducedMotion={reducedMotion}
                />

                <LoginFormCard
                    animate={animate}
                    reducedMotion={reducedMotion}
                    cardParallaxX={cardParallaxX}
                    cardParallaxY={cardParallaxY}
                    onSubmit={login}
                    onChange={handleForm}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword((v) => !v)}
                    localError={localError}
                    loading={loading}
                    registerSuccess={registerSuccess}
                />
            </Grid>
        </Box>
    );
}
