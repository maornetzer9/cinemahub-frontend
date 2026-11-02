import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { REGISTER_AMBIENT_DELAY, REGISTER_PARTICLES } from "./registerConfig";

const FOG_LAYERS = [
    {
        left: "18%",
        top: "20%",
        width: "64%",
        height: "58%",
        background: "radial-gradient(ellipse at 50% 55%, rgba(88,28,135,0.28) 0%, rgba(49,46,129,0.14) 42%, transparent 72%)",
        blur: 64,
        duration: 18,
    },
    {
        left: "28%",
        top: "32%",
        width: "48%",
        height: "46%",
        background: "radial-gradient(ellipse at 48% 50%, rgba(59,130,246,0.16) 0%, rgba(30,27,75,0.12) 50%, transparent 74%)",
        blur: 48,
        duration: 22,
    },
    {
        left: "34%",
        top: "48%",
        width: "38%",
        height: "32%",
        background: "radial-gradient(ellipse at 50% 40%, rgba(15,10,30,0.55) 0%, transparent 68%)",
        blur: 36,
        duration: 26,
    },
];

export function RegisterHeroFog({ animate }) {
    return (
        <>
            {FOG_LAYERS.map((layer, i) => (
                <Box
                    key={`fog-${i}`}
                    component={motion.div}
                    animate={
                        animate
                            ? {
                                  opacity: [0.55, 0.78, 0.55],
                                  scale: [1, 1.04, 1],
                              }
                            : undefined
                    }
                    transition={{
                        duration: layer.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: animate ? REGISTER_AMBIENT_DELAY : 0,
                    }}
                    sx={{
                        position: "absolute",
                        left: layer.left,
                        top: layer.top,
                        width: layer.width,
                        height: layer.height,
                        background: layer.background,
                        filter: `blur(${layer.blur}px)`,
                        zIndex: 0,
                        pointerEvents: "none",
                        willChange: "transform, opacity",
                    }}
                />
            ))}
        </>
    );
}

export function RegisterHeroParticles({ animate }) {
    return (
        <>
            {REGISTER_PARTICLES.map((p) => (
                <Box
                    key={p.id}
                    component={motion.div}
                    animate={
                        animate
                            ? {
                                  y: [0, -28 - p.id * 2, 0],
                                  x: [0, p.driftX, 0],
                                  opacity: [0, 0.55, 0],
                              }
                            : undefined
                    }
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (animate ? REGISTER_AMBIENT_DELAY : 0) + p.delay,
                    }}
                    sx={{
                        position: "absolute",
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(196,132,252,0.9) 0%, rgba(124,58,237,0.4) 50%, transparent 100%)",
                        boxShadow: "0 0 6px rgba(168,85,247,0.5)",
                        zIndex: 8,
                        pointerEvents: "none",
                        willChange: "transform, opacity",
                    }}
                />
            ))}
        </>
    );
}
