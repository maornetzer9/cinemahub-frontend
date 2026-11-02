import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { pageFadeVariants } from '../../design-system/styles';
import { layout } from '../../design-system/tokens';

const PageWrapper = ({ children, sx = {} }) => (
    <motion.div
        variants={pageFadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%' }}
    >
        <Box
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2.5, md: 3 },
                maxWidth: layout.contentMaxWidth,
                mx: 'auto',
                ...sx,
            }}
        >
            {children}
        </Box>
    </motion.div>
);

export default PageWrapper;
