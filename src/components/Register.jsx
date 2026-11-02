import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
    registerPageSx,
    REGISTER_GRID_SX,
    REGISTER_PAGE_CONTENT_SX,
    REGISTER_PAGE_REVEAL,
} from "./Register-Components/registerConfig";
import { LOGIN_MOUSE_RANGE, LOGIN_PARALLAX_SCALE, LOGIN_PARALLAX_SPRING } from "./Login-Components/loginConstants";
import LoginBackground from "./Login-Components/LoginBackground";
import RegisterFormContent from "./Register-Components/RegisterFormContent";
import { RegisterPageReadyProvider } from "./Register-Components/RegisterPageReady";

const RegisterHeroPanel = lazy(() => import("./Register-Components/RegisterHeroPanel"));

const heroColumnSx = {
    position: "relative",
    display: { xs: "none", md: "flex" },
    flexDirection: "column",
    minHeight: "100%",
};

export default function Register() {
    const theme = useTheme();
    const isDesktopHero = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
    const reducedMotion = useReducedMotion();
    const animate = !reducedMotion;
    const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        if (!isDesktopHero) return undefined;
        import("./Register-Components/registerHeroPreload");
        return undefined;
    }, [isDesktopHero]);

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
        mouseX.set((event.clientX / window.innerWidth - 0.5) * LOGIN_MOUSE_RANGE.x);
        mouseY.set((event.clientY / window.innerHeight - 0.5) * LOGIN_MOUSE_RANGE.y);
    }, [mouseX, mouseY, reducedMotion]);

    const handlePageReady = useCallback(() => {
        setPageReady(true);
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        const root = document.getElementById("root");
        const prevHtml = html.style.overflow;
        const prevBody = body.style.overflow;
        const prevRoot = root?.style.overflow ?? "";

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        if (root) root.style.overflow = "hidden";

        return () => {
            html.style.overflow = prevHtml;
            body.style.overflow = prevBody;
            if (root) root.style.overflow = prevRoot;
        };
    }, []);

    return (
        <Box onMouseMove={handleMouseMove} sx={registerPageSx}>
            <LoginBackground animate={animate} />

            <RegisterPageReadyProvider onReady={handlePageReady} requireCanvas={isDesktopHero}>
                <Box
                    component={motion.div}
                    data-register-content
                    initial={REGISTER_PAGE_REVEAL.hidden}
                    animate={pageReady ? REGISTER_PAGE_REVEAL.visible : REGISTER_PAGE_REVEAL.hidden}
                    transition={reducedMotion ? { duration: 0 } : REGISTER_PAGE_REVEAL.transition}
                    sx={{
                        ...REGISTER_PAGE_CONTENT_SX,
                        /* opacity-only hide: keeps WebGL/rAF active while coordinated gate waits */
                        opacity: pageReady ? 1 : 0,
                        pointerEvents: pageReady ? "auto" : "none",
                    }}
                    aria-hidden={!pageReady}
                    style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
                >
                    <Grid container sx={REGISTER_GRID_SX}>
                        {isDesktopHero && (
                            <Suspense
                                fallback={<Grid item md={7} sx={heroColumnSx} aria-hidden="true" />}
                            >
                                <RegisterHeroPanel
                                    parallaxX={parallaxX}
                                    parallaxY={parallaxY}
                                    animate={animate}
                                    reducedMotion={reducedMotion}
                                />
                            </Suspense>
                        )}

                        <RegisterFormContent
                            reducedMotion={reducedMotion}
                            cardParallaxX={cardParallaxX}
                            cardParallaxY={cardParallaxY}
                            animate={animate}
                        />
                    </Grid>
                </Box>
            </RegisterPageReadyProvider>
        </Box>
    );
}
