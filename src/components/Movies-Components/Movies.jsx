import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loadingMovies } from "../../services/movies";
import { loadingMembers } from "../../services/members";
import { useLocalError } from "../../hooks/error";
import { useParams } from "react-router-dom";
import { CardGridSkeleton } from "../../design-system/components/Skeleton";
import EmptyState from "../../design-system/components/EmptyState";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import AddIcon from "@mui/icons-material/Add";
import AddMovie from "./AddMovie";
import PermissionButton from "../UI/PermissionButton";
import PermissionsLoader from "../UI/PermissionsLoader";
import MoviesTabs from "./MoviesTabs";
import PageWrapper from "../layout/PageWrapper";

const Movies = () => {
    const dispatch = useDispatch();
    const { localError, setLocalError } = useLocalError();
    const { members } = useSelector((state) => state.membersReducer);
    const { movies, loading } = useSelector((state) => state.moviesReducer);

    const { movieId } = useParams();
    const selectedMovieParam = useMemo(
        () => movies.filter((m) => m._id.toString() === movieId),
        [movies, movieId]
    );

    const [addMovie, setAddMovie] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(0);
    const [moviesReady, setMoviesReady] = useState(false);

    const toggleAddMovieComponent = useCallback(() => setAddMovie((prev) => !prev), []);

    const fetchData = useCallback(async () => {
        try {
            await Promise.all([
                movies.length === 0 ? loadingMovies(dispatch) : Promise.resolve(),
                members.length === 0 ? loadingMembers(dispatch) : Promise.resolve(),
            ]);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        } finally {
            setMoviesReady(true);
        }
    }, [dispatch, movies.length, members.length, setLocalError]);

    const moviesByGenres = useMemo(() => {
        const grouped = {};
        const moviesToGroup = selectedMovieParam.length > 0 ? selectedMovieParam : movies;
        moviesToGroup.forEach((movie) => {
            movie.genres.forEach((genre) => {
                if (!grouped[genre]) grouped[genre] = [];
                grouped[genre].push(movie);
            });
        });
        return grouped;
    }, [movies, selectedMovieParam]);

    const genres = useMemo(() => Object.keys(moviesByGenres), [moviesByGenres]);

    useEffect(() => { fetchData(); }, [movies.length, members.length, fetchData]);

    if (!moviesReady || (loading && movies.length === 0)) {
        return (
            <PermissionsLoader>
                <PageWrapper>
                    <CardGridSkeleton count={8} />
                </PageWrapper>
            </PermissionsLoader>
        );
    }

    return (
        <PermissionsLoader>
            <PageWrapper>
                {localError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {localError}
                    </Alert>
                )}

                {movies.length === 0 ? (
                    <EmptyState
                        icon={MovieFilterOutlinedIcon}
                        title="No movies yet"
                        description="The catalog is empty. Add a movie to get started."
                    />
                ) : (
                <MoviesTabs
                    genres={genres}
                    moviesByGenres={moviesByGenres}
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                />
                )}

                {addMovie && <AddMovie toggleAddMovieComponent={toggleAddMovieComponent} />}

                <Tooltip title="Add Movie">
                    <PermissionButton
                        permissionType="create"
                        resourceType="movies"
                        type="fab"
                        color="primary"
                        aria-label="add"
                        onClick={toggleAddMovieComponent}
                    >
                        <AddIcon />
                    </PermissionButton>
                </Tooltip>
            </PageWrapper>
        </PermissionsLoader>
    );
};

export default Movies;
