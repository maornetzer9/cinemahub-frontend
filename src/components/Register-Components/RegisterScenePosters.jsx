import { memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { REGISTER_AMBIENT_DELAY, REGISTER_POSTERS } from "./registerConfig";

const POSTER_W = 88;

function RegisterScenePosters({ animate }) {
    return (
        <>
            {REGISTER_POSTERS.map((poster) => (
                <Box
                    key={poster.frame.src}
                    component={motion.div}
                    animate={
                        animate
                            ? {
                                  y: [0, -poster.floatY, 0],
                                  rotate: [poster.rotate - poster.rotateDelta, poster.rotate + poster.rotateDelta, poster.rotate - poster.rotateDelta],
                              }
                            : undefined
                    }
                    transition={{
                        duration: poster.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: REGISTER_AMBIENT_DELAY + poster.delay,
                    }}
                    sx={{
                        position: "absolute",
                        left: poster.left,
                        top: poster.top,
                        width: POSTER_W * poster.scale,
                        height: POSTER_W * poster.scale * 1.38,
                        zIndex: poster.zIndex,
                        borderRadius: "7px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.14)",
                        boxShadow: `0 16px 40px rgba(0,0,0,0.58), 0 0 28px ${poster.frame.glow}`,
                        transform: `rotate(${poster.rotate}deg)`,
                        opacity: 0.8,
                        filter: poster.blur > 0 ? `blur(${poster.blur}px)` : "none",
                        willChange: "transform",
                        pointerEvents: "none",
                    }}
                >
                    <Box
                        component="img"
                        src={poster.frame.src}
                        alt=""
                        loading="eager"
                        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                </Box>
            ))}
        </>
    );
}

export default memo(RegisterScenePosters);
