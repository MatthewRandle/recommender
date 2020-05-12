const pool = require("../../services/db");

/* 
    Get the list of movies on a users list, also get a calculation 
    for Exy that is used in recommendation formula.
    Order by rating desc, so if a user has a HUGE list, we will
    only generate recommendations on a limited amount, we want the recommendations
    to be based off of their favorite movies
*/
const getUsersMoviesWithExy = `
    SELECT 
        movie.name, 
        movie_list.movie_id,
        1 - POWER((1 - (count(total.movie_id) / (SELECT count(id) FROM movie))), (SELECT count(movie_id) - 1 FROM movie_list WHERE user_id = 1)) as "Exy"
    FROM movie_list
        JOIN movie ON movie.id = movie_list.movie_id
        JOIN movie_list total ON total.movie_id = movie_list.movie_id
    WHERE movie_list.user_id = ?
    GROUP BY movie_list.movie_id
    ORDER BY movie_list.rating DESC
    LIMIT 100;
`;

/* 
    This takes a movies ID, X, and returns a list of other movies that 
    occur on the same list as X. It return a column 'amount' that represents
    the amount of times a particular movie occurs.

    user_id = current users ID (we don't want to search a users own list for recommendations)
    movie_id (x2) = movie ID that we are searching for similar movies
 */
const getAmountOfMoviesThatShareListWithSpecifiedMovie = `
    SELECT compare.movie_id, count(compare.movie_id) as "amount", movie.name, movie.poster_path
    FROM movie_list
        JOIN movie_list compare ON compare.user_id = movie_list.user_id
        JOIN movie ON movie.id = compare.movie_id
    WHERE movie_list.user_id <> ? AND movie_list.movie_id = ? AND compare.movie_id <> ?
    GROUP BY movie.name;
`;

module.exports = (app) => {
    app.post("/recommendations/get-movies", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(401).send({ code: "ERR_MOVIE_RECOMMENDATIONS_NO_USER" });
        
        const user = req.user || req.body.user;

        pool.query(getUsersMoviesWithExy, [user.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_MOVIE_RECOMMENDATIONS_USERS_MOVIES" });

            if (results.length === 0) return res.send({ usersMovies: [] });

            let usersMovies = await getRecommendations(results, user.id);

            return res.send({ usersMovies });
        });
    });
};

async function getRecommendations(movies, userID) {
    let usersMovies = movies;

    await Promise.all(usersMovies.map(async movie => {
        await new Promise(resolve => {
            pool.query(getAmountOfMoviesThatShareListWithSpecifiedMovie, [userID, movie.movie_id, movie.movie_id], (err, results) => {
                if (err) return resolve();

                if (results.length > 0) {
                    movie.recommendations = results;
                }
                resolve();
            });
        })
    }))

    return usersMovies;
}   