import {
    Alert, Box, CircularProgress, FormControl, MenuItem, Select, TextField,
} from "@mui/material";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import { loadingMovies } from "../../services/movies";
import { newSubscriptionService } from "../../services/members";
import {
    CrudDialog,
    CrudModalActions,
    CrudModalField,
    CrudModalHeader,
    CrudModalSection,
} from "../../design-system/components/crudModalParts";
import { CRUD_MODAL_EXIT_MS, crudAlertSx, crudSelectMenuProps, inputRootSx, selectRootSx } from "../../design-system/styles";

export default function NewSubscription({ member = {}, open = false, onClose = () => {} }) {
    const dispatch = useDispatch();
    const { loading, error, movies } = useSelector((state) => state.moviesReducer);
    const { localError, setLocalError } = useLocalError();
    const closeTimerRef = useRef(null);
    const [movieId, setMovieId] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const movieIdHandler = ({ target: { value } }) => setMovieId(value);
    const movieDateHandler = ({ target: { value } }) => setSelectedDate(value);

    const resetForm = useCallback(() => {
        setMovieId("");
        setSelectedDate(new Date().toISOString().split("T")[0]);
        setLocalError("");
    }, [setLocalError]);

    const closeWithAnimation = useCallback(() => {
        if (isClosing) return;
        setIsClosing(true);
        setIsDialogOpen(false);
        closeTimerRef.current = setTimeout(() => {
            resetForm();
            setIsClosing(false);
            onClose();
        }, CRUD_MODAL_EXIT_MS);
    }, [isClosing, onClose, resetForm]);

    const filteredMovies = useMemo(() => {
        const subscribedMovieIds = new Set(
            (member?.subscriptions ?? []).map((sub) => String(sub.movieId))
        );
        return movies.filter((movie) => !subscribedMovieIds.has(String(movie._id)));
    }, [member?.subscriptions, movies]);

    const newSubscription = async () => {
        if (!movieId) return setLocalError("Pick a movie if you want to subscribe.");
        try {
            const payload = { movieId, date: selectedDate, memberId: member._id };
            await newSubscriptionService(payload, dispatch);
            closeWithAnimation();
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    const fetchMovies = useCallback(async () => {
        try {
            await loadingMovies(dispatch);
        } catch (err) {
            console.error(err.message);
        }
    }, [dispatch]);

    useEffect(() => {
        if (open) {
            setIsClosing(false);
            setIsDialogOpen(true);
        }
    }, [open]);

    useEffect(() => {
        if (open && movies.length === 0) fetchMovies();
    }, [open, movies.length, fetchMovies]);

    useEffect(() => () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }, []);

    return (
        <CrudDialog open={isDialogOpen} onClose={closeWithAnimation} size="sm">
            <CrudModalHeader
                icon={SubscriptionsOutlinedIcon}
                title="Add New Subscription"
                subtitle={
                    <>
                        Link a movie to{" "}
                        <Box component="span" color="text.primary" fontWeight={600}>
                            {member?.name}
                        </Box>{" "}
                        with a watch date.
                    </>
                }
                onClose={closeWithAnimation}
                accent="subscription"
            />

            <CrudModalSection title="Subscription Information" icon={MovieFilterOutlinedIcon}>
                {!loading ? (
                    <FormControl fullWidth>
                        <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
                            <CrudModalField label="Movie">
                                <Select
                                    value={movieId}
                                    labelId={`movies-label-${member?._id ?? "new"}`}
                                    onChange={movieIdHandler}
                                    displayEmpty
                                    fullWidth
                                    sx={selectRootSx}
                                    MenuProps={crudSelectMenuProps}
                                >
                                    {filteredMovies.map((movie) => (
                                        <MenuItem key={movie._id} value={movie._id} aria-hidden="false">
                                            {movie.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </CrudModalField>

                            <CrudModalField label="Watch Date">
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    value={selectedDate}
                                    onChange={movieDateHandler}
                                    fullWidth
                                    InputProps={{ sx: inputRootSx }}
                                />
                            </CrudModalField>
                        </Box>
                    </FormControl>
                ) : (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <CircularProgress color="primary" />
                    </Box>
                )}
            </CrudModalSection>

            {(localError || error) && (
                <Alert variant="filled" severity="error" sx={crudAlertSx}>
                    {localError || error}
                </Alert>
            )}

            <CrudModalActions
                onCancel={closeWithAnimation}
                onSave={newSubscription}
                saveLabel="Save Subscription"
                disabled={isClosing || loading}
                accent="subscription"
                saveIcon={AddCircleOutlineOutlinedIcon}
            />
        </CrudDialog>
    );
}
