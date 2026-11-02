import { memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { LOGIN_VIGNETTE, PARTICLES } from "./loginConstants";
import StarDustLayer from "./StarDustLayer";

// Static nebula layers — same gradients as the animated version, fixed at mid-opacity
// so reduced-motion users still get the full atmosphere without movement.
function StaticNebulaLayers() {
    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(95% 105% at 38% 62%, rgba(79,70,229,0.22) 0%, rgba(59,130,246,0.12) 46%, rgba(168,85,247,0.06) 68%, transparent 84%)",
                    filter: "blur(64px)",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(50% 65% at 82% 42%, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.08) 46%, rgba(236,72,153,0.04) 62%, transparent 78%)",
                    filter: "blur(72px)",
                    opacity: 0.48,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    left: "-4%",
                    bottom: "6%",
                    width: "90%",
                    height: "72%",
                    background:
                        "radial-gradient(closest-side at 34% 58%, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0.12) 46%, transparent 72%)",
                    filter: "blur(46px)",
                    opacity: 0.56,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    left: "6%",
                    bottom: "20%",
                    width: "72%",
                    height: "56%",
                    background:
                        "radial-gradient(closest-side at 40% 50%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0.11) 48%, transparent 72%)",
                    filter: "blur(40px)",
                    opacity: 0.58,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    left: "16%",
                    bottom: "28%",
                    width: "38%",
                    height: "42%",
                    background:
                        "radial-gradient(closest-side at 48% 48%, rgba(192,38,211,0.24) 0%, rgba(236,72,153,0.08) 42%, transparent 72%)",
                    filter: "blur(34px)",
                    opacity: 0.44,
                }}
            />
        </>
    );
}

function AnimatedNebulaLayers() {
    return (
        <>
            <motion.div
                animate={{ opacity: [0.34, 0.52, 0.34] }}
                transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(95% 105% at 38% 62%, rgba(79,70,229,0.22) 0%, rgba(59,130,246,0.12) 46%, rgba(168,85,247,0.06) 68%, transparent 84%)",
                    filter: "blur(64px)",
                    willChange: "opacity",
                }}
            />
            <motion.div
                animate={{ opacity: [0.44, 0.6, 0.44], scale: [1, 1.05, 1] }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(50% 65% at 82% 42%, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.08) 46%, rgba(236,72,153,0.04) 62%, transparent 78%)",
                    filter: "blur(72px)",
                    willChange: "transform, opacity",
                }}
            />
            <motion.div
                animate={{ opacity: [0.54, 0.72, 0.54], scale: [1, 1.05, 1] }}
                transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    left: "-4%",
                    bottom: "6%",
                    width: "90%",
                    height: "72%",
                    background:
                        "radial-gradient(closest-side at 34% 58%, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0.12) 46%, transparent 72%)",
                    filter: "blur(46px)",
                    willChange: "transform, opacity",
                }}
            />
            <motion.div
                animate={{ opacity: [0.42, 0.56, 0.42], x: [0, 16, 0], y: [0, -10, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                    position: "absolute",
                    left: "6%",
                    bottom: "20%",
                    width: "72%",
                    height: "56%",
                    background:
                        "radial-gradient(closest-side at 40% 50%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0.11) 48%, transparent 72%)",
                    filter: "blur(40px)",
                    willChange: "transform, opacity",
                }}
            />
            <motion.div
                animate={{ opacity: [0.28, 0.42, 0.28], scale: [1.04, 1, 1.04] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{
                    position: "absolute",
                    left: "16%",
                    bottom: "28%",
                    width: "38%",
                    height: "42%",
                    background:
                        "radial-gradient(closest-side at 48% 48%, rgba(192,38,211,0.24) 0%, rgba(236,72,153,0.08) 42%, transparent 72%)",
                    filter: "blur(34px)",
                    willChange: "transform, opacity",
                }}
            />
        </>
    );
}

function AmbientMotionLayers() {
    return (
        <>
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                style={{
                    position: "absolute",
                    top: "-40%",
                    left: "-25%",
                    width: "150%",
                    height: "150%",
                    background:
                        "conic-gradient(from 0deg, rgba(37,99,235,0) 0%, rgba(59,130,246,0.18) 25%, rgba(99,102,241,0.20) 50%, rgba(168,85,247,0.16) 72%, rgba(236,72,153,0.06) 85%, rgba(37,99,235,0) 100%)",
                    filter: "blur(90px)",
                    opacity: 0.42,
                    willChange: "transform",
                }}
            />
            <motion.div
                animate={{ x: [0, 28, -12, 0], y: [0, -18, 10, 0], scale: [1, 1.06, 0.98, 1], opacity: [0.12, 0.18, 0.14, 0.12] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: "-15%",
                    right: "-12%",
                    width: "50%",
                    height: "55%",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(129,140,248,0.14) 0%, transparent 70%)",
                    willChange: "transform, opacity",
                }}
            />
            <motion.div
                animate={{ x: [0, -20, 14, 0], y: [0, 14, -8, 0], opacity: [0.18, 0.28, 0.22, 0.18] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                style={{
                    position: "absolute",
                    bottom: "-8%",
                    left: "-6%",
                    width: "48%",
                    height: "52%",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
                    willChange: "transform, opacity",
                }}
            />
            <motion.div
                animate={{ x: [0, 36, 0], y: [0, -14, 0], opacity: [0.16, 0.24, 0.16] }}
                transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: "4%",
                    left: "-8%",
                    width: "78%",
                    height: "46%",
                    background: "radial-gradient(closest-side at 50% 50%, rgba(126,160,255,0.16) 0%, rgba(150,140,255,0.06) 48%, transparent 76%)",
                    filter: "blur(60px)",
                    transform: "rotate(-7deg)",
                    willChange: "transform, opacity",
                }}
            />
            <motion.div
                animate={{ x: [0, -28, 0], y: [0, 12, 0], opacity: [0.12, 0.2, 0.12] }}
                transition={{ duration: 23, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                    position: "absolute",
                    top: "52%",
                    right: "-10%",
                    width: "72%",
                    height: "52%",
                    background: "radial-gradient(closest-side at 50% 50%, rgba(150,140,255,0.14) 0%, rgba(126,160,255,0.05) 50%, transparent 78%)",
                    filter: "blur(64px)",
                    transform: "rotate(6deg)",
                    willChange: "transform, opacity",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    "@keyframes loginParticleDrift": {
                        "0%, 100%": { transform: "translate3d(0, 0, 0)", opacity: 0.15 },
                        "50%": { transform: "translate3d(0, -14px, 0)", opacity: 0.4 },
                    },
                }}
            >
                {PARTICLES.map((p) => (
                    <Box
                        key={p.id}
                        sx={{
                            position: "absolute",
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.32)",
                            animation: `loginParticleDrift ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            willChange: "transform, opacity",
                        }}
                    />
                ))}
            </Box>
        </>
    );
}

// Full-page cosmic atmosphere behind the login layout. Visual only.
function LoginBackground({ animate }) {
    return (
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            {animate ? <AnimatedNebulaLayers /> : <StaticNebulaLayers />}
            <StarDustLayer animate={animate} />
            {animate && <AmbientMotionLayers />}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: LOGIN_VIGNETTE,
                }}
            />
        </Box>
    );
}

export default memo(LoginBackground);
