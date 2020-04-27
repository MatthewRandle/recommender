import axios from "axios";
import Router from "next/router";

import { putError } from "../../app/duck";
import {
    putTvShowList
} from "./slice";
import errorHandler from "../../../utils/errorHandler";
import getRouteString from "../../../utils/getRouteString";

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

export const getTVShowList = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/lists/get-tv-shows", req), { user: req ? req.user : null });

        let tvShows = [];

        res.data.results.forEach(show => {
            let groupExists = false;
            tvShows.forEach(group => {
                if(group.rating === show.rating) {
                    group.shows.push(show);
                    groupExists = true;
                }
            })

            //console.log(show)
            if(!groupExists) tvShows.push({ rating: show.rating, shows: [show] })
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