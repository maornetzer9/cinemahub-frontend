import { memo, useMemo } from "react";
import { Box } from "@mui/material";
import { STARS } from "./loginConstants";

const DEPTH_LAYERS = [
    { key: "far", depth: 0, driftDuration: 60, driftX: 41, driftY: 18 },
    { key: "mid", depth: 1, driftDuration: 43, driftX: 66, driftY: 34 },
    { key: "near", depth: 2, driftDuration: 32, driftX: 94, driftY: 48 },
];

const LAYER_DRIFT_KEYFRAMES = Object.fromEntries(
    DEPTH_LAYERS.map((layer) => [
        `@keyframes loginStarLayerDrift${layer.key}`,
        {
            "0%, 100%": { transform: "translate3d(0, 0, 0)" },
            "50%": { transform: `translate3d(${layer.driftX}px, ${-layer.driftY}px, 0)` },
        },
    ]),
);

function StarDot({ star, animate }) {
    const driftX = ((star.id * 13) % 15) - 7;
    const driftY = ((star.id * 11) % 7) - 3;
    const driftDuration = 35 + (star.id % 12) * 4;

    return (
        <Box
            sx={{
                position: "absolute",
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                borderRadius: "50%",
                bgcolor: `rgba(${star.tint},0.95)`,
                filter: star.blur ? `blur(${star.blur}px)` : "none",
                boxShadow: star.size > 1.3 ? `0 0 6px rgba(${star.tint},0.7)` : "none",
                opacity: animate ? undefined : star.baseOpacity + 0.15,
                ...(animate && {
                    "--star-min": star.baseOpacity,
                    "--star-max": Math.min(0.95, star.baseOpacity + 0.5),
                    "--drift-x": `${driftX}px`,
                    "--drift-y": `${driftY}px`,
                    animation: `
                        loginStarTwinkle ${star.duration}s ease-in-out infinite,
                        loginStarDrift ${driftDuration}s ease-in-out infinite
                    `,
                    animationDelay: `${star.delay}s, ${star.delay * 0.6}s`,
                    willChange: "opacity, transform",
                }),
            }}
        />
    );
}

function StarDepthLayer({ stars, layer, animate }) {
    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                ...(animate && {
                    animation: `loginStarLayerDrift${layer.key} ${layer.driftDuration}s ease-in-out infinite`,
                    animationDelay: `${layer.depth * 4}s`,
                    willChange: "transform",
                }),
            }}
        >
            {stars.map((star) => (
                <StarDot key={star.id} star={star} animate={animate} />
            ))}
        </Box>
    );
}

// Deterministic cosmic dust field — depth-layer drift + per-star twinkle/drift when motion allowed.
function StarDustLayer({ animate = true }) {
    const starsByDepth = useMemo(
        () =>
            DEPTH_LAYERS.map((layer) => ({
                layer,
                stars: STARS.filter((star) => star.id % 3 === layer.depth),
            })),
        [],
    );

    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                ...(animate && {
                    ...LAYER_DRIFT_KEYFRAMES,
                    "@keyframes loginStarTwinkle": {
                        "0%, 100%": { opacity: "var(--star-min, 0.2)" },
                        "50%": { opacity: "var(--star-max, 0.85)" },
                    },
                    "@keyframes loginStarDrift": {
                        "0%, 100%": { transform: "translate3d(0, 0, 0)" },
                        "33%": { transform: "translate3d(var(--drift-x), var(--drift-y), 0)" },
                        "66%": {
                            transform:
                                "translate3d(calc(var(--drift-x) * -0.55), calc(var(--drift-y) * 0.75), 0)",
                        },
                    },
                }),
            }}
        >
            {starsByDepth.map(({ layer, stars }) => (
                <StarDepthLayer key={layer.key} stars={stars} layer={layer} animate={animate} />
            ))}
        </Box>
    );
}

export default memo(StarDustLayer);
