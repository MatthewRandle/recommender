import axios from "axios";
import Router from "next/router";

import { putError } from "../../app/duck";
import {
    
} from "./slice";
import errorHandler from "../../../utils/errorHandler";

export const addTvShowToList = (details, rating) => async dispatch => {
    try {
        await axios.post("/lists/add-tv-show", { details, rating });
        return Router.push("/my-tv-shows");
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem adding the specified TV Show. Please try again later.",
            "ERR_TV_SHOW_ADD_ERROR",
            false
        ));
    }
};

export const addMovieToList = (details, rating) => async dispatch => {
    try {
        await axios.post("/lists/add-movie", { details, rating });
        return Router.push("/my-movies");
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem adding the specified movie. Please try again later.",
            "ERR_MOVIE_ADD_ERROR",
            false
        ));
    }
};