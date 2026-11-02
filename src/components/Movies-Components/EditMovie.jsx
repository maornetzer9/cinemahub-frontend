import { useState } from "react";
import { Alert, Box, TextField } from "@mui/material";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import { editMovieService } from "../../services/movies";
import useModalCloseAnimation from "../../hooks/useModalCloseAnimation";
import { CRUD_MODAL_EXIT_MS, crudAlertSx, crudTextFieldProps } from "../../design-system/styles";
import {
    CrudDialog,
    CrudModalActions,
    CrudModalField,
    CrudModalHeader,
    CrudModalSection,
} from "../../design-system/components/crudModalParts";

export default function EditMovie({ movie, toggleEditMovieComponent }) {
    const dispatch = useDispatch();
    const { localError, setLocalError } = useLocalError();
    const { loading } = useSelector((state) => state.moviesReducer);
    const { isOpen, isClosing, closeWithAnimation } = useModalCloseAnimation(
        toggleEditMovieComponent,
        CRUD_MODAL_EXIT_MS
    );

    const [editMovieDetails, setEditMovieDetails] = useState({
        _id: movie._id || "",
        name: movie.name || "",
        genres: movie.genres || [],
        image: movie.image || {},
        premiered: movie.premiered || new Date().toLocaleDateString(),
    });

    const editMovieDetailsHandler = ({ target: { name, value } }) => {
        if (name === "genres") {
            const genresArray = value.split(",").map((genre) => genre.trim()).filter((genre) => genre.length > 0);
            setEditMovieDetails({ ...editMovieDetails, genres: genresArray });
        } else {
            setEditMovieDetails({ ...editMovieDetails, [name]: value });
        }
    };

    const editMovie = async () => {
        const { name, genres, image, premiered } = editMovieDetails;
        if (!name || genres.length === 0 || !image || !premiered) return setLocalError("All fields are required...");

        try {
            const { code, message } = await editMovieService(editMovieDetails, dispatch);
            if (code === 200) return closeWithAnimation();
            setLocalError(message);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    return (
        <Box component="div">
            <CrudDialog open={isOpen} onClose={closeWithAnimation} size="md">
                <CrudModalHeader
                    icon={EditOutlinedIcon}
                    title="Edit Movie Details"
                    subtitle={
                        <>
                            Update movie metadata and publishing details for{" "}
                            <Box component="span" color="text.primary" fontWeight={600}>
                                {movie.name}
                            </Box>
                            .
                        </>
                    }
                    onClose={closeWithAnimation}
                    accent="movie"
                />

                <CrudModalSection title="Movie Information" icon={MovieFilterOutlinedIcon}>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
                        <CrudModalField label="Movie Name">
                            <TextField
                                {...crudTextFieldProps}
                                name="name"
                                placeholder="Enter movie name"
                                defaultValue={movie?.name}
                                onChange={editMovieDetailsHandler}
                            />
                        </CrudModalField>
                        <CrudModalField label="Premiered">
                            <TextField
                                {...crudTextFieldProps}
                                type="date"
                                name="premiered"
                                defaultValue={movie?.premiered ? new Date(movie.premiered).toISOString().split("T")[0] : ""}
                                onChange={editMovieDetailsHandler}
                            />
                        </CrudModalField>
                    </Box>
                </CrudModalSection>

                <CrudModalSection title="Content Details">
                    <Box display="grid" gap={2}>
                        <CrudModalField label="Genres" helperText="Enter genres separated by commas.">
                            <TextField
                                {...crudTextFieldProps}
                                name="genres"
                                placeholder="Action, Drama, Sci-Fi"
                                defaultValue={movie?.genres ? movie.genres.join(", ") : ""}
                                onChange={editMovieDetailsHandler}
                            />
                        </CrudModalField>
                        <CrudModalField label="Image URL" helperText="Enter full URL to movie poster image.">
                            <TextField
                                {...crudTextFieldProps}
                                name="image"
                                placeholder="https://..."
                                defaultValue={movie?.image}
                                onChange={editMovieDetailsHandler}
                            />
                        </CrudModalField>
                    </Box>
                </CrudModalSection>

                {localError && (
                    <Alert variant="filled" severity="error" sx={crudAlertSx}>
                        {localError}
                    </Alert>
                )}

                <CrudModalActions
                    onCancel={closeWithAnimation}
                    onSave={editMovie}
                    saveLabel="Save Movie"
                    saving={loading}
                    disabled={isClosing}
                    accent="movie"
                    saveIcon={SaveOutlinedIcon}
                />
            </CrudDialog>
        </Box>
    );
}
