import { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import BrandLogo from "../../design-system/components/BrandLogo";
import { colors, radius } from "../../design-system/tokens";
import RegisterHeroVisual from "./RegisterHeroVisual";

function RegisterHeroPanel({ parallaxX, parallaxY, animate }) {
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
                overflow: "visible",
            }}
        >
            <RegisterHeroVisual parallaxX={parallaxX} parallaxY={parallaxY} animate={animate} />
            <Box sx={{ position: "relative", zIndex: 2 }}>
                <BrandLogo size="lg" />
            </Box>

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                pt={{ md: "7vh", lg: "9vh" }}
                pr={{ md: 8, lg: 10 }}
                maxWidth={380}
                position="relative"
                zIndex={2}
            >
                <Box>
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
                        Start your
                        <Box
                            component="span"
                            display="block"
                            sx={{
                                background: `linear-gradient(90deg, ${colors.primaryLight} 0%, ${colors.accent} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            cinematic journey
                        </Box>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth={360} lineHeight={1.7}>
                        Create a demo account and explore movies, members, and subscriptions.
                    </Typography>
                </Box>

                <Box mt={4}>
                    <Box display="flex" gap={1.5} alignItems="flex-start" maxWidth={360}>
                        <FormatQuoteIcon sx={{ color: "primary.main", fontSize: 28, opacity: 0.7 }} />
                        <Typography variant="body2" color="text.secondary" fontStyle="italic" lineHeight={1.6}>
                            Every great film begins with a single frame and a bold first step.
                            <Typography component="span" display="block" variant="caption" color="text.secondary" mt={0.75} fontStyle="normal">
                                — CinemaHub
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ position: "relative", zIndex: 2 }}>
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
                        Secure demo access
                        <Box component="span" display="block" color="text.secondary">
                            Explore the portfolio in read-only mode.
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </Grid>
    );
}

export default memo(RegisterHeroPanel);
