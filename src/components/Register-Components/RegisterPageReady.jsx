import { useCallback, useEffect, useRef } from "react";
import { RegisterPageReadyContext } from "./useRegisterPageReady";

/**
 * Coordinated composition reveal.
 * Desktop waits for the form and the first WebGL frame.
 * Below md the canvas is not mounted, so the form alone reveals the page.
 */
export function RegisterPageReadyProvider({ onReady, requireCanvas = true, children }) {
    const signalsRef = useRef({ form: false, canvas: false });
    const requireCanvasRef = useRef(requireCanvas);
    const readySentRef = useRef(false);
    requireCanvasRef.current = requireCanvas;

    const tryComplete = useCallback(() => {
        const s = signalsRef.current;
        if (readySentRef.current) return;
        if (!s.form) return;
        if (requireCanvasRef.current && !s.canvas) return;
        readySentRef.current = true;
        onReady();
    }, [onReady]);

    useEffect(() => {
        tryComplete();
    }, [requireCanvas, tryComplete]);

    const signalFormReady = useCallback(() => {
        signalsRef.current.form = true;
        tryComplete();
    }, [tryComplete]);

    const signalCanvasReady = useCallback(() => {
        signalsRef.current.canvas = true;
        tryComplete();
    }, [tryComplete]);

    return (
        <RegisterPageReadyContext.Provider value={{ signalFormReady, signalCanvasReady }}>
            {children}
        </RegisterPageReadyContext.Provider>
    );
}
