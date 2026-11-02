import { memo, useCallback, useMemo, useState } from "react";
import {
    Box, CardContent, Typography,
    Stack, Chip, Alert, Collapse, List, ListItem,
    ListItemText, Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch, useSelector } from "react-redux";
import { deleteMovieById } from "../../services/movies";
import { useLocalError } from "../../hooks/error";
import PermissionButton from "../UI/PermissionButton";
import EditMovie from "./EditMovie";
import CardContainer from "../../design-system/components/CardContainer";
import { chipSx, deleteActionIconSx, editActionIconSx } from "../../design-system/styles";
import { moviePosterTopRadiusSx, radius } from "../../design-system/tokens";

/** Fixed poster slot — all cards share the same image height */
const POSTER_HEIGHT = 180;

function MovieCard({ movie }) {
    const dispatch = useDispatch();
    const { localError, setLocalError } = useLocalError();
    const { members } = useSelector((state) => state.membersReducer);

    const [edit, setEdit] = useState(false);
    const [showWatchers, setShowWatchers] = useState(false);

    const toggleEdit = useCallback(() => setEdit((prev) => !prev), []);

    const deleteMovie = async (_id) => {
        try {
            const { code, message } = await deleteMovieById(_id, dispatch);
            if (code !== 200) setLocalError(message);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    const formattedDate = useMemo(() => {
        if (!movie.premiered) return "—";
        return new Date(movie.premiered).toLocaleDateString();
    }, [movie.premiered]);

    const watchers = useMemo(() => {
        return members
            ?.filter((m) => m.subscriptions?.some((s) => s.movieId === movie._id))
            .map((m) => ({
                name: m.name,
                subs: m.subscriptions.filter((s) => s.movieId === movie._id),
            }));
    }, [members, movie._id]);

    return (
        <CardContainer
            hover={false}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
                p: 0,
            }}
        >
            <Box
                sx={{
                    height: POSTER_HEIGHT,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    bgcolor: "rgba(0,0,0,0.28)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    ...moviePosterTopRadiusSx,
                }}
            >
                <Box
                    component="img"
                    src={movie.image}
                    alt={movie.name}
                    loading="lazy"
                    sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        objectPosition: "center",
                        display: "block",
                    }}
                />
            </Box>

            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 1.5,
                    pt: 1.25,
                    "&:last-child": { pb: 1.5 },
                }}
            >
                <Typography variant="body2" fontWeight={600} noWrap title={movie.name} sx={{ fontSize: "0.875rem" }}>
                    {movie.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.25} mb={1}>
                    {formattedDate}
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={0.5} mb={1}>
                    {movie.genres.slice(0, 3).map((genre, i) => (
                        <Chip key={i} label={genre} size="small" variant="outlined" sx={chipSx} />
                    ))}
                    {movie.genres.length > 3 && (
                        <Chip label={`+${movie.genres.length - 3}`} size="small" variant="outlined" sx={chipSx} />
                    )}
                </Stack>

                {localError && (
                    <Alert severity="error" sx={{ py: 0, mb: 1, fontSize: "0.75rem", borderRadius: `${radius.control}px` }}>
                        {localError}
                    </Alert>
                )}

                {watchers.length > 0 && (
                    <Box mb={1}>
                        <Divider sx={{ mb: 0.75 }} />
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            onClick={() => setShowWatchers((v) => !v)}
                            sx={{ cursor: "pointer", userSelect: "none", py: 0.25 }}
                        >
                            <Typography variant="caption" color="primary.main" fontWeight={600}>
                                {watchers.length} watcher{watchers.length !== 1 ? "s" : ""}
                            </Typography>
                            {showWatchers ? (
                                <ExpandLessIcon sx={{ fontSize: 16, color: "primary.main" }} />
                            ) : (
                                <ExpandMoreIcon sx={{ fontSize: 16, color: "primary.main" }} />
                            )}
                        </Box>
                        <Collapse in={showWatchers}>
                            <List dense disablePadding sx={{ mt: 0.25, maxHeight: 88, overflowY: "auto" }}>
                                {watchers.map((w, i) =>
                                    w.subs.map((s, j) => (
                                        <ListItem key={`${i}-${j}`} disableGutters sx={{ py: 0 }}>
                                            <ListItemText
                                                primary={w.name}
                                                secondary={new Date(s.date).toLocaleDateString()}
                                                primaryTypographyProps={{ variant: "caption", fontWeight: 500, fontSize: "0.75rem" }}
                                                secondaryTypographyProps={{ variant: "caption", fontSize: "0.6875rem" }}
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Collapse>
                    </Box>
                )}

                <Box
                    display="flex"
                    gap={0.75}
                    justifyContent="flex-end"
                    mt="auto"
                    pt={1.25}
                    borderTop="1px solid"
                    borderColor="divider"
                >
                    <PermissionButton
                        resourceType="movies"
                        permissionType="update"
                        size="small"
                        variant="outlined"
                        color="inherit"
                        onClick={toggleEdit}
                        sx={editActionIconSx}
                    >
                        <EditOutlinedIcon sx={{ fontSize: 17 }} />
                    </PermissionButton>
                    <PermissionButton
                        size="small"
                        variant="outlined"
                        color="inherit"
                        resourceType="movies"
                        permissionType="delete"
                        onClick={() => deleteMovie(movie._id)}
                        sx={deleteActionIconSx}
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                    </PermissionButton>
                </Box>
            </CardContent>

            {edit && <EditMovie movie={movie} toggleEditMovieComponent={toggleEdit} />}
        </CardContainer>
    );
}

export default memo(MovieCard);
