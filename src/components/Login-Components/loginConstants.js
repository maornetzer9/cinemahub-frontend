// Shared visual constants + helpers for the Login hero. Pure data only — no
// authentication, Redux, or routing logic lives here.

export const FILM_FRAMES = [
    { src: "/posters/poster-astronaut.jpg", glow: "rgba(96,165,250,0.55)" },
    { src: "/posters/poster-detective.jpg", glow: "rgba(167,139,250,0.55)" },
    { src: "/posters/poster-warrior.jpg", glow: "rgba(129,140,248,0.55)" },
    { src: "/posters/poster-city.jpg", glow: "rgba(59,130,246,0.55)" },
    { src: "/posters/poster-forest.jpg", glow: "rgba(96,165,250,0.55)" },
];

export const SEG_W = 118;
export const SEG_H = 150;
export const SEG_OVERLAP = 10;
export const STRIP_BASE_ANGLE = -10;

// Incremental joint angles. The sign flip (negative → positive) creates the
// continuous S-curve inflection while keeping every segment physically joined.
// Kept gentle so the per-joint rotation never opens a visible wedge wider than
// the segment overlap.
export const SEGMENT_DELTAS = [0, -5, -7, -5, 3, 7, 8];

// Progressive dissolve of the strip's tail into the atmosphere. Each segment
// fades its OWN slice via a left→right mask alpha; neighbouring edge alphas
// match (e.g. seg4.maskR === seg5.maskL) so the falloff is continuous across
// joints with no band. Because each mask runs along its segment's local x, the
// dissolve follows the curve. The last frames also gain rising blur and falling
// saturation/contrast so the tip loses definition before vanishing into space.
export const SEGMENT_FADE = [
    { maskL: 1, maskR: 1, blur: 0, saturate: 1, contrast: 1 },
    { maskL: 1, maskR: 1, blur: 0, saturate: 1, contrast: 1 },
    { maskL: 1, maskR: 1, blur: 0, saturate: 1, contrast: 1 },
    { maskL: 1, maskR: 1, blur: 0, saturate: 1, contrast: 1 },
    { maskL: 1, maskR: 1, blur: 0, saturate: 1, contrast: 1 },
    { maskL: 1, maskR: 0.88, blur: 0, saturate: 0.97, contrast: 1 },
    { maskL: 0.88, maskR: 0, blur: 0.8, saturate: 0.82, contrast: 0.95 },
];

export const REEL_SPOKES = [0, 60, 120, 180, 240, 300];

export const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${6 + ((i * 17) % 88)}%`,
    top: `${8 + ((i * 13) % 84)}%`,
    size: 1.5 + (i % 3),
    duration: 16 + (i % 5) * 2,
    delay: i * 0.65,
}));

// Star-dust palette — white-blue, cyan, soft purple, dim blue. Mixed so the
// field reads as varied cosmic dust rather than uniform white dots.
export const STAR_TINTS = [
    "232,237,255", // white-blue
    "165,243,252", // cyan
    "196,181,253", // purple
    "147,197,253", // dim blue
    "224,231,255", // pale
];

// Deterministic starfield — dense, varied, slow-twinkling dust for cosmic depth.
// A subset is larger + blurred to read as soft glowing motes that dissolve.
export const STARS = Array.from({ length: 140 }, (_, i) => {
    const isDust = i % 6 === 0;
    return {
        id: i,
        left: `${(i * 47 + (i % 7) * 11) % 100}%`,
        top: `${(i * 29 + (i % 5) * 17) % 100}%`,
        size: isDust ? 2.6 + (i % 3) * 0.8 : i % 4 === 0 ? 1.6 : 1.1,
        duration: 4 + (i % 7) * 0.95,
        delay: (i % 17) * 0.4,
        baseOpacity: isDust ? 0.1 + (i % 3) * 0.06 : 0.26 + (i % 5) * 0.13,
        tint: STAR_TINTS[i % STAR_TINTS.length],
        blur: isDust ? 1.5 : 0,
    };
});

export const fadeUp = (delay = 0, reduced = false) => ({
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
});

// ── Login page motion + visual tuning (shared across hero components) ──

export const LOGIN_PARALLAX_SPRING = { stiffness: 45, damping: 22, mass: 0.6 };
export const LOGIN_PARALLAX_SCALE = { heroX: 0.55, heroY: 0.4, cardX: 0.12, cardY: 0.1 };
export const LOGIN_MOUSE_RANGE = { x: 18, y: 14 };

export const SPOTLIGHT_ROTATE = [-50, 12];
export const SPOTLIGHT_OPACITY = 0.84;
export const SPOTLIGHT_TRANSITION = { duration: 6.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" };

export const HERO_FLOAT_TRANSITION = { duration: 22, repeat: Infinity, ease: [0.45, 0, 0.55, 1] };

export const STRIP_DROP_SHADOW =
    "drop-shadow(0 28px 48px rgba(0,0,0,0.72)) drop-shadow(0 0 38px rgba(168,85,247,0.68)) drop-shadow(0 0 72px rgba(59,130,246,0.48)) drop-shadow(0 0 96px rgba(236,72,153,0.28)) drop-shadow(0 0 120px rgba(99,102,241,0.16))";

export const LOGIN_VIGNETTE =
    "radial-gradient(125% 105% at 42% 44%, transparent 46%, rgba(3,4,10,0.42) 78%, rgba(1,2,6,0.82) 100%)";

export const SPOTLIGHT_BEAM_STYLE = {
    width: "100%",
    height: "100%",
    background:
        "linear-gradient(105deg, transparent 32%, rgba(196,210,255,0.12) 42%, rgba(210,220,255,0.42) 50%, rgba(236,201,255,0.28) 56%, rgba(180,160,255,0.14) 62%, transparent 70%)",
    transformOrigin: "50% 0%",
    filter: "blur(16px) brightness(1.08)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
    maskImage: "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
    mixBlendMode: "screen",
    pointerEvents: "none",
    willChange: "transform, opacity",
};
