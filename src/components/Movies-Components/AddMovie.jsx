import { useState } from "react";
import { Alert, Box, TextField } from "@mui/material";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useLocalError } from "../../hooks/error";
import { addMovieService } from "../../services/movies";
import useModalCloseAnimation from "../../hooks/useModalCloseAnimation";
import { CRUD_MODAL_EXIT_MS, crudAlertSx, crudTextFieldProps } from "../../design-system/styles";
import {
    CrudDialog,
    CrudModalActions,
    CrudModalField,
    CrudModalHeader,
    CrudModalSection,
} from "../../design-system/components/crudModalParts";

export default function AddMovie({ toggleAddMovieComponent = () => {} }) {
    const dispatch = useDispatch();
    const dateFormat = new Date().toISOString().split("T")[0];
    const { localError, setLocalError } = useLocalError();
    const { loading } = useSelector((state) => state.moviesReducer);
    const { isOpen, isClosing, closeWithAnimation } = useModalCloseAnimation(
        toggleAddMovieComponent,
        CRUD_MODAL_EXIT_MS
    );

    const [newMovie, setNewMovie] = useState({
        name: "",
        genres: [],
        image: "",
        premiered: dateFormat,
    });

    const newMovieHandler = ({ target: { name, value } }) => {
        if (name === "genres") {
            const genresArray = value.split(",").map((genre) => genre.trim()).filter((genre) => genre.length > 0);
            setNewMovie({ ...newMovie, genres: genresArray });
        } else {
            setNewMovie({ ...newMovie, [name]: value });
        }
    };

    const addMovie = async () => {
        const { name, genres, image } = newMovie;
        if (!name || genres.length === 0 || !image) return setLocalError("All fields are required...");
        try {
            const { code, message } = await addMovieService(newMovie, dispatch);
            if (code === 200) return closeWithAnimation();
            if (code !== 200) return setLocalError(message);
        } catch (err) {
            console.error(err.message);
            setLocalError(err.message);
        }
    };

    return (
        <Box component="div">
            <CrudDialog open={isOpen} onClose={closeWithAnimation} size="md">
                <CrudModalHeader
                    icon={MovieCreationOutlinedIcon}
                    title="Add New Movie"
                    subtitle="Create a movie entry with publishing details and metadata."
                    onClose={closeWithAnimation}
                    accent="movie"
                />

                <CrudModalSection title="Movie Information" icon={MovieFilterOutlinedIcon}>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
                        <CrudModalField label="Movie Name">
                            <TextField {...crudTextFieldProps} name="name" placeholder="Enter movie name" onChange={newMovieHandler} />
                        </CrudModalField>
                        <CrudModalField label="Premiered">
                            <TextField
                                {...crudTextFieldProps}
                                type="date"
                                name="premiered"
                                defaultValue={dateFormat}
                                onChange={newMovieHandler}
                            />
                        </CrudModalField>
                    </Box>
                </CrudModalSection>

                <CrudModalSection title="Content Details">
                    <Box display="grid" gap={2}>
                        <CrudModalField label="Genres" helperText="Enter genres separated by commas.">
                            <TextField
                                {...crudTextFieldProps}
                                placeholder="Action, Drama, Sci-Fi"
                                name="genres"
                                onChange={newMovieHandler}
                            />
                        </CrudModalField>
                        <CrudModalField label="Image URL" helperText="Enter full URL to movie poster image.">
                            <TextField {...crudTextFieldProps} placeholder="https://..." name="image" onChange={newMovieHandler} />
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
                    onSave={addMovie}
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
