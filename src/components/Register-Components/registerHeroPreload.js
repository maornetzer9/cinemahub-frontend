import clapperboardGlb from "../../assets/models/cc0_-_clapperboard.glb";
import platformGlb from "../../assets/models/clipboard_display_platform.glb";
import { REGISTER_ARC_FRAMES, REGISTER_POSTERS } from "./registerConfig";

/**
 * Early asset scheduling for Register — no sync drei/three import here so the
 * first paint of Login is not blocked. GLB fetch + async GLTF warm start immediately.
 */
const posterSrcs = [
    ...new Set([
        ...REGISTER_POSTERS.map((p) => p.frame.src),
        ...REGISTER_ARC_FRAMES.map((f) => f.frame.src),
    ]),
];

const glbSrcs = [clapperboardGlb, platformGlb];

function injectFetchPreload(href) {
    if (typeof document === "undefined") return;
    if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "fetch";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
}

[...glbSrcs, ...posterSrcs].forEach(injectFetchPreload);

/** Kick HTTP download immediately (overlaps React bootstrap / Login paint). */
if (typeof fetch === "function") {
    glbSrcs.forEach((href) => {
        fetch(href, { mode: "cors", credentials: "omit" }).catch(() => {});
    });
}

let postersStarted = false;

export const posterPreloadPromise = Promise.all(
    posterSrcs.map(
        (src) =>
            new Promise((resolve) => {
                const img = new Image();
                img.decoding = "async";
                img.onload = () => resolve(src);
                img.onerror = () => resolve(src);
                img.src = src;
            }),
    ),
);

export function preloadRegisterHeroAssets() {
    if (postersStarted) return;
    postersStarted = true;
    posterSrcs.forEach((src) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
    });
}

preloadRegisterHeroAssets();

// Start drei useGLTF.preload immediately (async chunk) — do not wait for idle.
if (typeof window !== "undefined") {
    import("./registerGltfPreload").catch(() => {});
}
