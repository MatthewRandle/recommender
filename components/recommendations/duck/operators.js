import axios from "axios";

import { putError } from "../../app/duck";
import {
    putMovieRecommendations,
    putTvShowRecommendations,
    putTrendingMovies,
    putTrendingTvShows,
    putActorsMovies,
    putActorsShows
} from "./slice";
import errorHandler from "../../../utils/errorHandler";
import getRouteString from "../../../utils/getRouteString";

export const getTrendingMovies = () => async dispatch => {
    try {
        const trendingMovies = "https://api.themoviedb.org/3/trending/movie/week?api_key=abed60834d8a74d3044fac789f6c7c07";
        const res = await axios.get(trendingMovies);
        dispatch(putTrendingMovies({ trendingMovies: res.data.results }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst getting trending movies.",
            "ERR_MOVIE_TRENDING_ERROR",
            false
        ));
    }
};

export const getTrendingTvShows = () => async dispatch => {
    try {
        const trendingTvShows = "https://api.themoviedb.org/3/trending/tv/week?api_key=abed60834d8a74d3044fac789f6c7c07";
        const res = await axios.get(trendingTvShows);
        dispatch(putTrendingTvShows({ trendingTvShows: res.data.results }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst getting trending tv shows.",
            "ERR_TV_SHOWS_TRENDING_ERROR",
            false
        ));
    }
};

export const getMovieRecommendationsFromActor = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/recommendations/get-movie-actor", req), { user: req ? req.user : null });

        const getMoviesFromActor = `https://api.themoviedb.org/3/person/${res.data.actor.id}/movie_credits?api_key=abed60834d8a74d3044fac789f6c7c07&language=en-US`;
        const movies = await axios.get(getMoviesFromActor);

        dispatch(putActorsMovies({ actorsMovies: movies.data.cast, actorForMovieRecommendations: res.data.actor.name }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst getting recommendations based on movie actor.",
            "ERR_MOVIE_ACTOR_RECOMMENDATION_ERROR",
            false
        ));
    }
};

export const getTVShowRecommendationsFromActor = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/recommendations/get-tv-show-actor", req), { user: req ? req.user : null });

        const getTVShowsFromActor = `https://api.themoviedb.org/3/person/${res.data.actor.id}/tv_credits?api_key=abed60834d8a74d3044fac789f6c7c07&language=en-US`;
        const shows = await axios.get(getTVShowsFromActor);

        dispatch(putActorsShows({ actorShows: shows.data.cast, actorForTVShowRecommendations: res.data.actor.name }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst getting recommendations based on movie actor.",
            "ERR_MOVIE_ACTOR_RECOMMENDATION_ERROR",
            false
        ));
    }
};

export const getMovieRecommendations = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/recommendations/get-movies", req), { user: req ? req.user : null });

        let usersMovies = res.data.usersMovies;

        if(usersMovies.length === 0) return dispatch(putMovieRecommendations({ movieRecommendations: [] }));

        /* 
            We have a list of the users movies, each movie has a recommendations array (if there are any).
            We need to take they recommendations and movie them into a new array, with all of the scores
            from them recommendations. For example if the user has 2 movies, Harry Potter 1 and Inception:
            HP1 has a recommendation: Interstellar with score 1, and Inception also has a recommendation Interstellar
            with score 1, we want to extract both of these scores into one object. So the movieRecommendation array below
            would contain an object like so: { name: "Interstellar", scores: [1, 2] }
        */
        let movieRecommendations = [];
        usersMovies.forEach(movie => {
            if(movie.recommendations && movie.recommendations.length > 0)  {
                movie.recommendations.forEach(recommendation => {
                    const score = Math.abs(recommendation.amount - movie.Exy) / Math.sqrt(movie.Exy);

                    let exists = false;
                    for (let i = 0; i < movieRecommendations.length; i++) {
                        if (movieRecommendations[i].movieID === recommendation.movie_id) {
                            //if (recommendation.name === "Eagle Eye") console.log("Already exists: " + i);
                            exists = i;
                            i = movieRecommendations.length;
                        }
                    }

                    if(exists !== false) {
                        //if (recommendation.name === "Eagle Eye") console.log("Add to Eagle Eye")
                        movieRecommendations[exists].scores.push(score);
                    }
                    else {
                        //if(recommendation.name === "Eagle Eye") console.log("Insert Eagle Eye")
                        movieRecommendations.push({ 
                            movieID: recommendation.movie_id, 
                            name: recommendation.name, 
                            poster_path: recommendation.poster_path,
                            scores: [score] });
                    }
                })
            }
        })

        /* Remove any recommendations that the user already has on their list */
        let filteredRecommendations = [];
        movieRecommendations.forEach(recommendation => {
            let alreadyOnUsersList = false;
            for(let i = 0; i < usersMovies.length; i++) {
                if (recommendation.movieID === usersMovies[i].movie_id) {
                    alreadyOnUsersList = true;
                    i = usersMovies.length;
                }
            }

            if (!alreadyOnUsersList) filteredRecommendations.push(recommendation);
        });

        /* Calculate an average of all the scores, per movie */
        let averageRecommendations = [];
        filteredRecommendations.forEach(recommendation => {
            let average = 0;
            recommendation.scores.forEach(score => {
                average += parseFloat(score);
            })
            
            average = average / recommendation.scores.length;
            averageRecommendations.push({ 
                movieID: recommendation.movieID, 
                name: recommendation.name,
                poster_path: recommendation.poster_path,
                score: average 
            });
        })

        //order recommendations by score
        averageRecommendations = averageRecommendations.sort((a, b) => b.score - a.score);
        dispatch(putMovieRecommendations({ movieRecommendations: averageRecommendations }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst getting movie recommendations.",
            "ERR_MOVIE_RECOMMENDATIONS_ERROR",
            false
        ));
    }
};

export const getTvShowRecommendations = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/recommendations/get-tv-shows", req), { user: req ? req.user : null });

        let usersTvShows = res.data.usersTvShows;

        if (usersTvShows.length === 0) return dispatch(putTvShowRecommendations({ tvShowRecommendations: [] }));

        /* 
            We have a list of the users movies, each movie has a recommendations array (if there are any).
            We need to take they recommendations and movie them into a new array, with all of the scores
            from them recommendations. For example if the user has 2 movies, Harry Potter 1 and Inception:
            HP1 has a recommendation: Interstellar with score 1, and Inception also has a recommendation Interstellar
            with score 1, we want to extract both of these scores into one object. So the movieRecommendation array below
            would contain an object like so: { name: "Interstellar", scores: [1, 2] }
        */
        let tvShowRecommendations = [];
        usersTvShows.forEach(show => {
            if (show.recommendations && show.recommendations.length > 0) {
                show.recommendations.forEach(recommendation => {
                    const score = Math.abs(recommendation.amount - show.Exy) / Math.sqrt(show.Exy);

                    let exists = false;
                    for (let i = 0; i < tvShowRecommendations.length; i++) {
                        if (tvShowRecommendations[i].showID === recommendation.tv_show_id) {
                            //if (recommendation.name === "Eagle Eye") console.log("Already exists: " + i);
                            exists = i;
                            i = tvShowRecommendations.length;
                        }
                    }

                    if (exists !== false) {
                        //if (recommendation.name === "Eagle Eye") console.log("Add to Eagle Eye")
                        tvShowRecommendations[exists].scores.push(score);
                    }
                    else {
                        //if(recommendation.name === "Eagle Eye") console.log("Insert Eagle Eye")
                        tvShowRecommendations.push({ showID: recommendation.tv_show_id, name: recommendation.name, scores: [score] });
                    }
                })
            }
        })

        /* Remove any recommendations that the user already has on their list */
        let filteredRecommendations = [];
        tvShowRecommendations.forEach(recommendation => {
            let alreadyOnUsersList = false;
            for (let i = 0; i < usersTvShows.length; i++) {
                if (recommendation.showID === usersTvShows[i].tv_show_id) {
                    alreadyOnUsersList = true;
                    i = usersTvShows.length;
                }
            }

            if (!alreadyOnUsersList) filteredRecommendations.push(recommendation);
        });

        /* Calculate an average of all the scores, per movie */
        let averageRecommendations = [];
        filteredRecommendations.forEach(recommendation => {
            let average = 0;
            recommendation.scores.forEach(score => {
                average += parseFloat(score);
            })

            average = average / recommendation.scores.length;
            averageRecommendations.push({ showID: recommendation.showID, name: recommendation.name, score: average });
        })

        //order recommendations by score
        averageRecommendations = averageRecommendations.sort((a, b) => b.score - a.score);
        dispatch(putTvShowRecommendations({ tvShowRecommendations: averageRecommendations }));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem whilst getting tv show recommendations.",
            "ERR_TV_SHOW_RECOMMENDATIONS_ERROR",
            false
        ));
    }
};