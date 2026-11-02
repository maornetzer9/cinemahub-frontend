import { memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import {
    HERO_FLOAT_TRANSITION,
    SEG_H,
    SPOTLIGHT_BEAM_STYLE,
    SPOTLIGHT_OPACITY,
    SPOTLIGHT_ROTATE,
    SPOTLIGHT_TRANSITION,
    STRIP_BASE_ANGLE,
    STRIP_DROP_SHADOW,
} from "./loginConstants";
import FilmReel from "./FilmReel";
import FilmSegment from "./FilmStrip";

// Left-column film object: contact glow, rotating reel, continuous film strip, spotlight.
// Atmosphere comes from LoginBackground — no center seam. Parallax from page motion values.
function LoginHeroVisual({ parallaxX, parallaxY, animate }) {
    return (
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <Box
                sx={{
                    position: "absolute",
                    left: "9%",
                    width: 290,
                    bottom: "23%",
                    height: 100,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse at center, rgba(79,70,229,0.48) 0%, rgba(168,85,247,0.18) 42%, transparent 72%)",
                    filter: "blur(28px)",
                    transform: "scaleY(0.4)",
                }}
            />

            <motion.div style={{ x: parallaxX, y: parallaxY, position: "absolute", inset: 0, willChange: "transform" }}>
                <Box
                    component={motion.div}
                    animate={animate ? { y: [0, -7, 0], rotate: [0.25, -0.25, 0.25] } : undefined}
                    transition={HERO_FLOAT_TRANSITION}
                    sx={{ position: "absolute", inset: 0, perspective: "1400px", willChange: "transform" }}
                >
                    {animate && (
                        <motion.div
                            animate={{ opacity: [0.58, 0.92, 0.58], scale: [1, 1.08, 1] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: "absolute",
                                left: "12%",
                                bottom: "33%",
                                width: "62%",
                                height: "46%",
                                transformOrigin: "left center",
                                transform: `rotate(${STRIP_BASE_ANGLE - 4}deg)`,
                                background:
                                    "radial-gradient(ellipse at 38% 50%, rgba(168,85,247,0.62) 0%, rgba(99,102,241,0.46) 32%, rgba(59,130,246,0.32) 54%, rgba(236,72,153,0.12) 68%, transparent 82%)",
                                filter: "blur(52px)",
                                pointerEvents: "none",
                                zIndex: 1,
                                willChange: "transform, opacity",
                            }}
                        />
                    )}

                    <Box
                        sx={{
                            position: "absolute",
                            left: "12%",
                            bottom: "31%",
                            width: "56%",
                            height: "38%",
                            zIndex: 3,
                            transformOrigin: "left center",
                            transform: `rotateX(6deg) rotate(${STRIP_BASE_ANGLE - 2}deg)`,
                            background:
                                "radial-gradient(ellipse at 28% 55%, rgba(124,58,237,0.22) 0%, rgba(59,130,246,0.14) 45%, transparent 78%)",
                            filter: "blur(38px)",
                            pointerEvents: "none",
                        }}
                    />

                    <FilmReel animate={animate} />

                    <Box
                        sx={{
                            position: "absolute",
                            left: "14%",
                            bottom: "33%",
                            zIndex: 5,
                            transformStyle: "preserve-3d",
                            transformOrigin: "left center",
                            transform: `rotateX(8deg) rotate(${STRIP_BASE_ANGLE}deg) scale(0.9)`,
                            filter: STRIP_DROP_SHADOW,
                        }}
                    >
                        <Box sx={{ position: "relative", top: -SEG_H / 2 }}>
                            <FilmSegment index={0} animate={animate} />
                        </Box>
                    </Box>

                    {animate && (
                        <Box
                            sx={{
                                position: "absolute",
                                left: "4%",
                                top: "8%",
                                width: "48%",
                                height: "92%",
                                zIndex: 30,
                                pointerEvents: "none",
                            }}
                        >
                            <motion.div
                                animate={{
                                    rotate: SPOTLIGHT_ROTATE,
                                    opacity: SPOTLIGHT_OPACITY,
                                }}
                                transition={SPOTLIGHT_TRANSITION}
                                style={SPOTLIGHT_BEAM_STYLE}
                            />
                        </Box>
                    )}
                </Box>
            </motion.div>
        </Box>
    );
}

export default memo(LoginHeroVisual);
