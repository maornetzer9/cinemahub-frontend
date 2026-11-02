import { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import BrandLogo from "../../design-system/components/BrandLogo";
import { colors, radius } from "../../design-system/tokens";
import { fadeUp } from "./loginConstants";
import LoginHeroVisual from "./LoginHeroVisual";

// Desktop-only left column: the cinematic animation plus the branding,
// headline, quote, and trust badge. Presentational — parallax + motion flags
// are supplied by the page.
function LoginHeroPanel({ parallaxX, parallaxY, animate, reducedMotion }) {
    return (
        <Grid
            item
            md={7}
            sx={{
                position: "relative",
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                px: { md: 5, lg: 8 },
                py: 5,
                textShadow: "0 1px 18px rgba(2,4,10,0.6)",
            }}
        >
            <LoginHeroVisual parallaxX={parallaxX} parallaxY={parallaxY} animate={animate} />

            <motion.div {...fadeUp(0.05, reducedMotion)} style={{ position: "relative", zIndex: 2 }}>
                <BrandLogo size="lg" />
            </motion.div>

            <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" pt={{ md: "7vh", lg: "9vh" }} pr={{ lg: 4 }} position="relative" zIndex={2}>
                <motion.div {...fadeUp(0.12, reducedMotion)}>
                    <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{
                            fontSize: { md: "2.25rem", lg: "2.75rem" },
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                            mb: 2,
                        }}
                    >
                        Welcome back
                        <Box
                            component="span"
                            display="block"
                            sx={{
                                background: `linear-gradient(90deg, ${colors.primaryLight} 0%, ${colors.accent} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            to CinemaHub
                        </Box>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth={420} lineHeight={1.7}>
                        Manage movies, members, and subscriptions in one place.
                    </Typography>
                </motion.div>

                <motion.div {...fadeUp(0.28, reducedMotion)}>
                    <Box display="flex" gap={1.5} alignItems="flex-start" maxWidth={440} mt={4}>
                        <FormatQuoteIcon sx={{ color: "primary.main", fontSize: 28, opacity: 0.7 }} />
                        <Typography variant="body2" color="text.secondary" fontStyle="italic" lineHeight={1.6}>
                            Cinema is a matter of what&apos;s in the frame and what&apos;s out.
                            <Typography component="span" display="block" variant="caption" color="text.secondary" mt={0.75} fontStyle="normal">
                                — Martin Scorsese
                            </Typography>
                        </Typography>
                    </Box>
                </motion.div>
            </Box>

            <motion.div {...fadeUp(0.35, reducedMotion)} style={{ position: "relative", zIndex: 2 }}>
                <Box display="flex" alignItems="center" gap={1.25}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: `${radius.control}px`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(59,130,246,0.12)",
                            border: "1px solid rgba(96,165,250,0.25)",
                        }}
                    >
                        <ShieldOutlinedIcon sx={{ fontSize: 18, color: "primary.light" }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                        Secure. Fast. Reliable.
                        <Box component="span" display="block" color="text.secondary">
                            Built for modern movie businesses.
                        </Box>
                    </Typography>
                </Box>
            </motion.div>
        </Grid>
    );
}

export default memo(LoginHeroPanel);
