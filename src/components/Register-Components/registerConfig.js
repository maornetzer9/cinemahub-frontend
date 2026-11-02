import { FILM_FRAMES } from "../Login-Components/loginConstants";
import { loginPageSx } from "../../design-system/styles";

// --- Layout data (posters, arc frames, particles) ---

export const REGISTER_POSTERS = [
    {
        frame: FILM_FRAMES[0],
        left: "74%",
        top: "6%",
        rotate: 11,
        scale: 1.02,
        blur: 0,
        zIndex: 7,
        floatDuration: 11.5,
        floatY: 5,
        rotateDelta: 1.1,
        delay: 0,
    },
    {
        frame: FILM_FRAMES[2],
        left: "2%",
        top: "56%",
        rotate: -13,
        scale: 0.94,
        blur: 0.4,
        zIndex: 5,
        floatDuration: 13.2,
        floatY: 4,
        rotateDelta: 0.85,
        delay: 1.4,
    },
    {
        frame: FILM_FRAMES[4],
        left: "80%",
        top: "46%",
        rotate: 7,
        scale: 0.9,
        blur: 1.1,
        zIndex: 6,
        floatDuration: 9.8,
        floatY: 6,
        rotateDelta: 1.3,
        delay: 0.7,
    },
];

export const REGISTER_ARC_FRAMES = [
    { frame: FILM_FRAMES[1], left: "8%", top: "18%", rotate: -28, opacity: 0.52, blur: 1.5, zIndex: 1 },
    { frame: FILM_FRAMES[3], left: "22%", top: "8%", rotate: -14, opacity: 0.48, blur: 0.8, zIndex: 1 },
    { frame: FILM_FRAMES[0], left: "38%", top: "4%", rotate: 0, opacity: 0.55, blur: 0, zIndex: 2 },
    { frame: FILM_FRAMES[4], left: "54%", top: "8%", rotate: 14, opacity: 0.48, blur: 0.8, zIndex: 1 },
    { frame: FILM_FRAMES[2], left: "68%", top: "18%", rotate: 28, opacity: 0.42, blur: 1.8, zIndex: 1 },
];

export const REGISTER_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${38 + ((i * 19) % 42)}%`,
    top: `${42 + ((i * 13) % 38)}%`,
    size: 1.5 + (i % 3) * 0.6,
    duration: 14 + (i % 4) * 2.5,
    delay: i * 0.9,
    driftX: (i % 2 === 0 ? 1 : -1) * (6 + (i % 3) * 3),
}));

// --- Hero / GLB sx tokens ---

export const CLAPPERBOARD_SLOT_SX = {
    position: "absolute",
    left: "50%",
    top: "2%",
    width: { md: 420, lg: 460 },
    height: { md: 500, lg: 540 },
    marginLeft: { md: "-210px", lg: "-230px" },
    zIndex: 10,
    contain: "layout style",
};

export const GLB_SHELL_SX = {
    width: "100%",
    height: "100%",
    minWidth: 380,
    minHeight: 480,
    position: "relative",
    background: "transparent",
    contain: "layout style paint",
    overflow: "hidden",
    isolation: "isolate",
};

export const GLB_SHADOW_SX = {
    position: "absolute",
    left: "50%",
    bottom: "14%",
    width: "46%",
    height: "6%",
    marginLeft: "-23%",
    borderRadius: "50%",
    background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.65) 0%, transparent 72%)",
    filter: "blur(14px)",
    opacity: 0.1,
    zIndex: 0,
    pointerEvents: "none",
};

/** Register page shell — fixed viewport height prevents transient body scrollbar on load. */
export const registerPageSx = {
    ...loginPageSx,
    minHeight: "100dvh",
    height: "100dvh",
    maxHeight: "100dvh",
    overflow: "hidden",
};

export const REGISTER_GRID_SX = {
    height: "100%",
    maxHeight: "100dvh",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
};

/** Page content wrapper — hidden until coordinated hero+form reveal. */
export const REGISTER_PAGE_CONTENT_SX = {
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 1,
    background: "transparent",
};

/** Single coordinated reveal for Register composition (hero + form together). */
export const REGISTER_PAGE_REVEAL = {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const REGISTER_ENTRANCE_TRANSITION = { duration: 0.65, ease: [0.22, 1, 0.36, 1] };

/** Form column — no y offset (avoids transient overflow during entrance). */
export const REGISTER_ENTRANCE = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: REGISTER_ENTRANCE_TRANSITION,
};

/** Hero column — opacity only; no y/scale (WebGL + overflow safe). */
export const REGISTER_HERO_ENTRANCE = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: REGISTER_ENTRANCE_TRANSITION,
};

/** Delay ambient loops until the page entrance finishes (delayChildren + duration). */
export const REGISTER_AMBIENT_DELAY = 0.73;

export const registerEntranceContainer = (reduced = false) =>
    reduced
        ? { initial: false }
        : {
              initial: "initial",
              animate: "animate",
              variants: {
                  initial: {},
                  animate: {
                      transition: { staggerChildren: 0.06, delayChildren: 0.08 },
                  },
              },
          };

export const registerEntranceItem = (reduced = false) =>
    reduced
        ? {}
        : {
              variants: {
                  initial: REGISTER_ENTRANCE.initial,
                  animate: {
                      ...REGISTER_ENTRANCE.animate,
                      transition: REGISTER_ENTRANCE.transition,
                  },
              },
          };

export const registerHeroEntranceItem = (reduced = false) =>
    reduced
        ? {}
        : {
              variants: {
                  initial: REGISTER_HERO_ENTRANCE.initial,
                  animate: {
                      ...REGISTER_HERO_ENTRANCE.animate,
                      transition: REGISTER_HERO_ENTRANCE.transition,
                  },
              },
          };

/** Coordinated GLB reveal after first rendered frames — wrapper only, not internal animation. */
export const CLAPPERBOARD_REVEAL = {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/** @deprecated use CLAPPERBOARD_REVEAL */
export const CLAPPERBOARD_ENTRANCE = {
    initial: CLAPPERBOARD_REVEAL.hidden,
    animate: CLAPPERBOARD_REVEAL.visible,
    transition: CLAPPERBOARD_REVEAL.transition,
};

export const HERO_VISUAL_ROOT_SX = {
    position: "absolute",
    left: 0,
    right: 0,
    top: { md: "24%", lg: "22%" },
    bottom: { md: "2%", lg: "4%" },
    pointerEvents: "none",
    zIndex: 1,
};

export const HERO_FLOAT_LAYER_SX = {
    position: "absolute",
    inset: 0,
    perspective: "1400px",
    perspectiveOrigin: "50% 40%",
    transformStyle: "preserve-3d",
    willChange: "transform",
};
