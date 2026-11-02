import { memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { HERO_FLOAT_TRANSITION } from "../Login-Components/loginConstants";
import ClapperboardModel from "./ClapperboardModel";
import RegisterFilmArc from "./RegisterFilmArc";
import { RegisterHeroFog, RegisterHeroParticles } from "./RegisterHeroAtmosphere";
import RegisterHeroPlatform from "./RegisterHeroPlatform";
import RegisterScenePosters from "./RegisterScenePosters";
import { CLAPPERBOARD_SLOT_SX, HERO_FLOAT_LAYER_SX, HERO_VISUAL_ROOT_SX, REGISTER_AMBIENT_DELAY } from "./registerConfig";

function RegisterHeroVisual({ parallaxX, parallaxY, animate }) {
    return (
        <Box sx={HERO_VISUAL_ROOT_SX}>
            <motion.div style={{ x: parallaxX, y: parallaxY, position: "absolute", inset: 0, willChange: "transform" }}>
                <Box
                    component={motion.div}
                    animate={animate ? { y: [0, -4, 0] } : undefined}
                    transition={animate ? { ...HERO_FLOAT_TRANSITION, delay: REGISTER_AMBIENT_DELAY } : HERO_FLOAT_TRANSITION}
                    sx={HERO_FLOAT_LAYER_SX}
                >
                    <RegisterHeroFog animate={animate} />
                    <RegisterFilmArc animate={animate} />
                    <Box
                        sx={{
                            position: "absolute",
                            left: "44%",
                            top: "-4%",
                            width: "20%",
                            height: "72%",
                            zIndex: 3,
                            pointerEvents: "none",
                            opacity: animate ? 0.55 : 0.4,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50% 50% 40% 40%",
                                background:
                                    "radial-gradient(ellipse 50% 70% at 50% 0%, rgba(210,218,240,0.14) 0%, rgba(168,85,247,0.05) 30%, transparent 68%)",
                                filter: "blur(20px)",
                                transform: "perspective(900px) rotateX(10deg)",
                            }}
                        />
                    </Box>
                    <RegisterHeroPlatform />
                    <RegisterScenePosters animate={animate} />

                    <Box sx={CLAPPERBOARD_SLOT_SX}>
                        <ClapperboardModel animate={animate} />
                    </Box>

                    <RegisterHeroParticles animate={animate} />
                </Box>
            </motion.div>
        </Box>
    );
}

export default memo(RegisterHeroVisual);
