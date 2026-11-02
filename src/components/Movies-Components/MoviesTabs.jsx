import { Tabs, Tab, Grid } from "@mui/material";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "./MovieCard";
import PageHeader from "../../design-system/components/PageHeader";
import EmptyState from "../../design-system/components/EmptyState";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import { useTopBarSearch } from "../../context/useTopBarSearch";
import { movieMatchesSearch, normalizeSearchQuery } from "../../utils/topBarSearch";

export default function MoviesTabs({ genres, moviesByGenres, selectedGenre, setSelectedGenre }) {
    const { search } = useTopBarSearch();
    const hasSearch = normalizeSearchQuery(search).length > 0;
    const currentGenre = genres[selectedGenre];
    const currentMovies = useMemo(
        () => (currentGenre ? moviesByGenres[currentGenre] : []),
        [currentGenre, moviesByGenres]
    );

    const visibleMovies = useMemo(
        () => currentMovies.filter((movie) => movieMatchesSearch(movie, search)),
        [currentMovies, search]
    );

    return (
        <>
            <PageHeader
                title="Movies"
                subtitle="Browse and manage your cinema catalog organized by genre."
            />

            <Tabs
                value={selectedGenre}
                onChange={(_, newValue) => setSelectedGenre(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="genre tabs"
                sx={{
                    mb: 3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    ".MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
                }}
            >
                {genres.map((genre, index) => (
                    <Tab key={index} label={genre} />
                ))}
            </Tabs>

            <AnimatePresence mode="wait">
                {currentGenre && (
                    <motion.div
                        key={currentGenre}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        {visibleMovies.length === 0 ? (
                            <EmptyState
                                icon={MovieFilterOutlinedIcon}
                                title={hasSearch ? "No matching movies" : "No movies in this genre"}
                                description={
                                    hasSearch
                                        ? "Try a different search term or select another genre."
                                        : "Try selecting a different genre or add a new movie."
                                }
                            />
                        ) : (
                            <Grid container spacing={2.5}>
                                {visibleMovies.map((movie) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                                        <MovieCard movie={movie} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
