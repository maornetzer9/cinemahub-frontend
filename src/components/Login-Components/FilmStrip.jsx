import { memo } from "react";
import { Box } from "@mui/material";
import { FILM_FRAMES, SEG_W, SEG_H, SEG_OVERLAP, SEGMENT_DELTAS, SEGMENT_FADE } from "./loginConstants";

// Perforation rail with optional travel animation (the film-moving illusion).
function PerfRail({ animate }) {
    return (
        <Box
            sx={{
                height: 12,
                flexShrink: 0,
                backgroundColor: "#050506",
                backgroundImage:
                    // Smooth brightness waveform: many feathered stops spanning the
                    // full pitch so each highlight fades in → peaks → fades out with
                    // no flat plateau or flat black gap (kills the tiled/block look).
                    "repeating-linear-gradient(90deg, " +
                    "rgba(255,255,255,0) 0px, " +
                    "rgba(255,255,255,0.03) 1.6px, " +
                    "rgba(255,255,255,0.10) 3.2px, " +
                    "rgba(255,255,255,0.24) 4.6px, " +
                    "rgba(255,255,255,0.46) 6px, " +
                    "rgba(255,255,255,0.74) 7.4px, " +
                    "rgba(255,255,255,1) 9px, " +
                    "rgba(255,255,255,0.74) 10.6px, " +
                    "rgba(255,255,255,0.46) 12px, " +
                    "rgba(255,255,255,0.24) 13.4px, " +
                    "rgba(255,255,255,0.10) 14.8px, " +
                    "rgba(255,255,255,0.03) 16.4px, " +
                    "rgba(255,255,255,0) 18px), " +
                    // Long-period dark modulation desyncs the repeat so the eye can't
                    // lock onto identical cells (subtle, brightness only — no new color).
                    "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 19px, rgba(0,0,0,0.10) 37px, rgba(0,0,0,0) 55px), " +
                    "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.52) 100%)",
                backgroundSize: "18px 100%, 55px 100%, 100% 100%",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.6)",
                ...(animate && {
                    "@keyframes filmTravel": {
                        from: { backgroundPositionX: "0px, 0px, 0px" },
                        to: { backgroundPositionX: "18px, 55px, 0px" },
                    },
                    animation: "filmTravel 2.6s linear infinite",
                    willChange: "background-position",
                }),
            }}
        />
    );
}

// One frame of the ribbon. Each segment renders the next one anchored to its
// own right edge and rotated by SEGMENT_DELTAS, so the nested chain bends as a
// single continuous strip (no gaps, constant width, joined borders).
function FilmSegment({ index, animate }) {
    const frame = FILM_FRAMES[index % FILM_FRAMES.length];
    const delta = SEGMENT_DELTAS[index] ?? 0;
    const hasNext = index + 1 < SEGMENT_DELTAS.length;

    // Tail dissolve for this segment only (applied to the body box, never the
    // recursive child wrapper, so masks don't multiply down the chain).
    const fade = SEGMENT_FADE[index] ?? SEGMENT_FADE[SEGMENT_FADE.length - 1];
    const isFading = fade.maskL < 1 || fade.maskR < 1;
    const needsSoftEnd = fade.blur > 0 || fade.saturate < 1 || fade.contrast < 1;
    const maskGradient = `linear-gradient(to right, rgba(0,0,0,${fade.maskL}) 0%, rgba(0,0,0,${fade.maskR}) 100%)`;
    const fadeSx = {
        ...(isFading && {
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
        }),
        ...(needsSoftEnd && {
            filter: `blur(${fade.blur}px) saturate(${fade.saturate}) contrast(${fade.contrast})`,
        }),
    };

    return (
        <Box
            sx={{
                position: "absolute",
                left: index === 0 ? 0 : SEG_W - SEG_OVERLAP,
                top: 0,
                width: SEG_W,
                height: SEG_H,
                transformOrigin: "left center",
                transform: `rotate(${delta}deg)`,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    background: "linear-gradient(180deg, #141828 0%, #0a0c16 45%, #04050c 100%)",
                    borderRight: "1px solid rgba(150,162,255,0.08)",
                    borderLeft: "1px solid rgba(0,0,0,0.22)",
                    borderBottom: "2px solid #03040a",
                    boxShadow:
                        "inset 0 2px 6px rgba(180,195,255,0.10), inset 0 -10px 18px rgba(0,0,0,0.55), 0 0 18px rgba(99,102,241,0.12)",
                    ...fadeSx,
                }}
            >
                <PerfRail animate={animate} />
                <Box sx={{ position: "relative", flex: 1, overflow: "hidden" }}>
                    <Box
                        component="img"
                        src={frame.src}
                        alt=""
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            userSelect: "none",
                            filter: "brightness(1.16) saturate(1.24) contrast(1.06)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(8,10,20,0) 28%, rgba(6,8,18,0.26) 100%)",
                            boxShadow: `inset 0 0 38px ${frame.glow}, inset 0 0 0 1.5px rgba(150,162,255,0.48), 0 0 22px rgba(99,102,241,0.14)`,
                            pointerEvents: "none",
                        }}
                    />
                </Box>
                <PerfRail animate={animate} />
            </Box>
            {hasNext && <FilmSegment index={index + 1} animate={animate} />}
        </Box>
    );
}

export default memo(FilmSegment);
