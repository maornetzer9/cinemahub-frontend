import { memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { REGISTER_AMBIENT_DELAY, REGISTER_ARC_FRAMES } from "./registerConfig";

const FRAME_W = 108;
const FRAME_H = 72;

function ArcFrame({ frame, left, top, rotate, opacity, blur, animate }) {
    return (
        <Box
            sx={{
                position: "absolute",
                left,
                top,
                width: FRAME_W,
                height: FRAME_H + 16,
                opacity,
                transform: `rotate(${rotate}deg) rotateX(14deg)`,
                transformStyle: "preserve-3d",
                filter: blur > 0 ? `blur(${blur}px) brightness(0.92)` : "brightness(0.95)",
                zIndex: 1,
                pointerEvents: "none",
            }}
        >
            <Box sx={{ height: 8, bgcolor: "#050506", borderRadius: "2px 2px 0 0", opacity: 0.9 }} />
            <Box
                sx={{
                    height: FRAME_H,
                    border: "2px solid #0a0a0c",
                    borderTop: "none",
                    borderRadius: "0 0 3px 3px",
                    overflow: "hidden",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.55), 0 0 16px rgba(124,58,237,0.2)",
                }}
            >
                <Box
                    component="img"
                    src={frame.src}
                    alt=""
                    loading="eager"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            </Box>
            <Box
                component={motion.div}
                animate={animate ? { opacity: [0.6, 0.85, 0.6] } : undefined}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: animate ? REGISTER_AMBIENT_DELAY : 0 }}
                sx={{ height: 8, bgcolor: "#050506", borderRadius: "0 0 2px 2px", opacity: 0.85 }}
            />
        </Box>
    );
}

function RegisterFilmArc({ animate }) {
    return (
        <Box
            sx={{
                position: "absolute",
                left: "4%",
                top: "6%",
                width: "92%",
                height: "42%",
                zIndex: 1,
                opacity: 0.5,
                pointerEvents: "none",
                transform: "rotateX(18deg)",
                transformStyle: "preserve-3d",
            }}
        >
            {REGISTER_ARC_FRAMES.map((item) => (
                <ArcFrame key={`${item.left}-${item.frame.src}`} {...item} animate={animate} />
            ))}
        </Box>
    );
}

export default memo(RegisterFilmArc);
