import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import RegisterHeroErrorBoundary from "./RegisterHeroErrorBoundary";
import { GLB_SHADOW_SX, GLB_SHELL_SX } from "./registerConfig";
import { useRegisterPageReady } from "./useRegisterPageReady";
import ClapperboardScene from "./ClapperboardScene";

/**
 * Safety only — must never leave the hero canvas hidden if the frame signal stalls.
 * High enough that it cannot race normal GLB parse + first frames.
 */
const SCENE_READY_FALLBACK_MS = 8000;

function ClapperboardModel({ animate }) {
    const { signalCanvasReady } = useRegisterPageReady();
    const [sceneReady, setSceneReady] = useState(false);
    const revealedRef = useRef(false);

    const reveal = useCallback(() => {
        if (revealedRef.current) return;
        revealedRef.current = true;
        // Shell + page gate in the same turn so the composition fades in together.
        setSceneReady(true);
        signalCanvasReady();
    }, [signalCanvasReady]);

    const handleSceneReady = useCallback(() => {
        reveal();
    }, [reveal]);

    useEffect(() => {
        const id = window.setTimeout(() => reveal(), SCENE_READY_FALLBACK_MS);
        return () => window.clearTimeout(id);
    }, [reveal]);

    return (
        <RegisterHeroErrorBoundary>
            <Box
                data-glb-shell
                sx={GLB_SHELL_SX}
                // INLINE from first React commit (Emotion sx is too late for first paint).
                // visibility:hidden — WebGL can still paint through opacity:0 alone.
                style={{
                    background: "transparent",
                    backgroundColor: "transparent",
                    opacity: sceneReady ? 1 : 0,
                    visibility: sceneReady ? "visible" : "hidden",
                    transition: "none",
                    backfaceVisibility: "hidden",
                }}
            >
                <Box sx={GLB_SHADOW_SX} />
                <ClapperboardScene animate={animate} onSceneReady={handleSceneReady} />
            </Box>
        </RegisterHeroErrorBoundary>
    );
}

export default memo(ClapperboardModel);
