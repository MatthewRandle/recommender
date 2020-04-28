import axios from "axios";

import { putError } from "../../app/duck";
import {
    
} from "./slice";
import errorHandler from "../../../utils/errorHandler";
import getRouteString from "../../../utils/getRouteString";

export const getMovieRecommendations = (req) => async dispatch => {
    try {
        const res = await axios.post(getRouteString("/recommendations/get-movies", req), { user: req ? req.user : null });

        let usersMovies = res.data.usersMovies;

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
                        movieRecommendations.push({ movieID: recommendation.movie_id, name: recommendation.name, scores: [score] });
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
            averageRecommendations.push({ movieID: recommendation.movieID, name: recommendation.name, score: average });
        })

        //order recommendations by score
        averageRecommendations.sort((a, b) => b.score - a.score);
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