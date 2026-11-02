import { memo } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { surfaceCardSx } from "../../design-system/styles";

// Presentational shell — renders children (form) without any auth logic.
function RegisterFormShell({ title, subtitle, footer, children, cardParallaxX, cardParallaxY, animate }) {
    return (
        <Grid
            item
            xs={12}
            md={5}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 2, sm: 3 },
                py: { xs: 4, md: 5 },
            }}
        >
            <motion.div
                style={{ width: "100%", maxWidth: 420, x: cardParallaxX, y: cardParallaxY, willChange: "transform" }}
            >
                <Box
                    component={motion.div}
                    animate={animate ? { y: [0, -4, 0] } : undefined}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ willChange: "transform" }}
                >
                    <Box sx={{ ...surfaceCardSx, p: { xs: 3, sm: 4 }, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
                        {title && (
                            <Typography variant="h6" fontWeight={600} mb={0.5}>
                                {title}
                            </Typography>
                        )}
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                {subtitle}
                            </Typography>
                        )}
                        <Divider sx={{ mb: 3 }} />
                        {children}
                        {footer}
                    </Box>
                </Box>
            </motion.div>
        </Grid>
    );
}

export default memo(RegisterFormShell);
