import axios from "axios";

import { putError } from "../../app/duck";
import {
    putResults
} from "./slice";
import errorHandler from "../../../utils/errorHandler";

const searchLink = "https://api.themoviedb.org/3/search/multi?api_key=abed60834d8a74d3044fac789f6c7c07&language=en-US&query=";

export const search = (query) => async dispatch => {
    try {
        if (query == null || query === "") return dispatch(putResults({ searchResults: null }));
        query = escape(query);

        const res = await axios.get(searchLink + query);

        dispatch(putResults({ searchResults: res.data.results }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst searching. Please try again later.",
            "ERR_SEARCH_ERROR",
            false
        ));
    }
};