import axios from "axios";
import Router from "next/router";

import { putError } from "../../app/duck";
import {
    putTvShowList,
    putMovieList
} from "./slice";
import errorHandler from "../../../utils/errorHandler";
import getRouteString from "../../../utils/getRouteString";

export const addTvShowToList = (details, rating) => async dispatch => {
    try {
        const trimmedDetails = {
            id: details.id,
            name: details.name,
            genres: details.genres,
            credits: {
                cast: details.credits.cast
            },
            backdrop_path: details.backdrop_path,
            poster_path: details.poster_path
        }

        await axios.post("/lists/add-tv-show", { details: trimmedDetails, rating });
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
        const trimmedDetails = {
            id: details.id,
            name: details.title,
            genres: details.genres,
            credits: {
                cast: details.credits.cast
            },
            backdrop_path: details.backdrop_path,
            poster_path: details.poster_path
        }

        await axios.post("/lists/add-movie", { details: trimmedDetails, rating });
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

export const deleteMovieFromList = (movieID) => async dispatch => {
    try {
        await axios.post("/lists/remove-movie", { movieID });
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem removing the specified movie. Please try again later.",
            "ERR_MOVIE_REMOVE_ERROR",
            false
        ));
    }
};

export const deleteTVShowFromList = (showID) => async dispatch => {
    try {
        await axios.post("/lists/remove-tv-show", { showID });
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem removing the specified movie. Please try again later.",
            "ERR_MOVIE_REMOVE_ERROR",
            false
        ));
    }
};

export const getTVShowList = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/lists/get-tv-shows", req), { user: req ? req.user : null });

        let tvShows = [];

        res.data.results.forEach(show => {
            let groupExists = false;
            tvShows.forEach(group => {
                if(group.rating === show.rating) {
                    group.mediaList.push(show);
                    groupExists = true;
                }
            })
            
            if (!groupExists) tvShows.push({ rating: show.rating, mediaList: [show] })
        });

        dispatch(putTvShowList({ tvShowList: tvShows }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem getting your tv shows. Please try again later.",
            "ERR_GET_TV_SHOWS_ERROR",
            true
        ));
    }
};

export const updateTVShowRating = (showID, rating) => async dispatch => {
    try {
        await axios.post("/lists/update-tv-show-rating", { showID, rating });
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem updating the rating. Please try again later.",
            "ERR_TV_SHOW_UPDATE_ERROR",
            false
        ));
    }
};

export const updateMovieRating = (movieID, rating) => async dispatch => {
    try {
        await axios.post("/lists/update-movie-rating", { movieID, rating });
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem updating the rating. Please try again later.",
            "ERR_MOVIE_UPDATE_ERROR",
            false
        ));
    }
};

export const getMovieList = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/lists/get-movies", req), { user: req ? req.user : null });

        let movies = [];

        res.data.results.forEach(movie => {
            let groupExists = false;
            movies.forEach(group => {
                if (group.rating === movie.rating) {
                    group.mediaList.push(movie);
                    groupExists = true;
                }
            })

            if (!groupExists) movies.push({ rating: movie.rating, mediaList: [movie] })
        });

        dispatch(putMovieList({ movieList: movies }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem getting your movies. Please try again later.",
            "ERR_GET_MOVIES_ERROR",
            true
        ));
    }
};