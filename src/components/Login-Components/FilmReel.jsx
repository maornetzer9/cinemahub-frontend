import { memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { REEL_SPOKES } from "./loginConstants";

// Metallic film reel SVG — brushed-metal body, recessed spoke holes, glowing
// hub. Reused for both the live reel and its floor reflection.
function ReelSvg() {
    return (
        <Box
            component="svg"
            viewBox="0 0 100 100"
            sx={{ width: "100%", height: "100%", display: "block", filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.6))" }}
        >
            <defs>
                <radialGradient id="reelMetal" cx="34%" cy="26%" r="84%">
                    <stop offset="0%" stopColor="#8a91bf" />
                    <stop offset="26%" stopColor="#565d84" />
                    <stop offset="58%" stopColor="#262b45" />
                    <stop offset="100%" stopColor="#070912" />
                </radialGradient>
                <linearGradient id="reelBrush" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="20%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="80%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                </linearGradient>
                <radialGradient id="reelHub" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(147,158,255,0.85)" />
                    <stop offset="100%" stopColor="rgba(129,140,248,0)" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="47" fill="url(#reelMetal)" stroke="rgba(159,170,255,0.8)" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="47" fill="url(#reelBrush)" />
            <circle cx="50" cy="50" r="44.5" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.1" />
            {REEL_SPOKES.map((a) => {
                const rad = (a * Math.PI) / 180;
                const cx = 50 + Math.cos(rad) * 27;
                const cy = 50 + Math.sin(rad) * 27;
                return (
                    <g key={a}>
                        <circle cx={cx} cy={cy} r="9.5" fill="#070a14" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" />
                        <circle cx={cx} cy={cy} r="9.5" fill="none" stroke="rgba(147,158,255,0.5)" strokeWidth="1" />
                        <circle cx={cx - 2.6} cy={cy - 2.6} r="2.4" fill="rgba(180,195,255,0.25)" />
                    </g>
                );
            })}
            <circle cx="50" cy="50" r="13" fill="#070a14" stroke="rgba(120,170,255,0.75)" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="13" fill="url(#reelHub)" />
            <circle cx="50" cy="50" r="3.8" fill="rgba(180,190,255,0.95)" />
        </Box>
    );
}

const MemoReelSvg = memo(ReelSvg);

function FilmReel({ animate }) {
    return (
        <Box sx={{ position: "absolute", left: "8%", bottom: "24%", width: 216, height: 216, zIndex: 9, pointerEvents: "none" }}>
            <Box
                component={motion.div}
                animate={animate ? { opacity: [0.68, 0.96, 0.68], scale: [1, 1.08, 1] } : undefined}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    inset: "-26%",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(99,102,241,0.52) 0%, rgba(168,85,247,0.22) 38%, rgba(59,130,246,0.12) 58%, transparent 68%)",
                    filter: "blur(26px)",
                    willChange: "transform, opacity",
                }}
            />
            <Box
                component={motion.div}
                animate={animate ? { rotate: 360 } : undefined}
                transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
                sx={{ position: "relative", width: "100%", height: "100%", willChange: "transform" }}
            >
                <MemoReelSvg />
            </Box>
            <Box
                component={motion.div}
                aria-hidden
                animate={animate ? { opacity: [0.45, 0.75, 0.45] } : undefined}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 33% 27%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%)",
                    mixBlendMode: "screen",
                    willChange: "opacity",
                }}
            />
            <Box
                aria-hidden
                sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    height: "100%",
                    mt: "-14px",
                    transform: "scaleY(-1)",
                    opacity: 0.24,
                    filter: "blur(2px)",
                    WebkitMaskImage: "linear-gradient(to top, transparent 8%, rgba(0,0,0,0.85) 85%)",
                    maskImage: "linear-gradient(to top, transparent 8%, rgba(0,0,0,0.85) 85%)",
                }}
            >
                <MemoReelSvg />
            </Box>
        </Box>
    );
}

export default memo(FilmReel);
