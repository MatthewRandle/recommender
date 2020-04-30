const pool = require("../../services/db");

/* 
    Get the list of movies on a users list, also get a calculation 
    for Exy that is used in recommendation formula.
    Order by rating desc, so if a user has a HUGE list, we will
    only generate recommendations on a limited amount, we want the recommendations
    to be based off of their favorite movies
*/
const getUsersTvShowWithExy = `
    SELECT 
        tv_show.name, 
        tv_show_list.tv_show_id,
        1 - POWER((1 - (count(total.tv_show_id) / (SELECT count(id) FROM tv_show))), (SELECT count(tv_show_id) - 1 FROM tv_show_list WHERE user_id = 1)) as "Exy"
    FROM tv_show_list
        JOIN tv_show ON tv_show.id = tv_show_list.tv_show_id
        JOIN tv_show_list total ON total.tv_show_id = tv_show_list.tv_show_id
    WHERE tv_show_list.user_id = ?
    GROUP BY tv_show_list.tv_show_id
    ORDER BY tv_show_list.rating DESC;
`;

/* 
    This takes a movies ID, X, and returns a list of other movies that 
    occur on the same list as X. It return a column 'amount' that represents
    the amount of times a particular movie occurs.

    user_id = current users ID (we don't want to search a users own list for recommendations)
    movie_id (x2) = movie ID that we are searching for similar movies
 */
const getAmountOfTvShowsThatShareListWithSpecifiedMovie = `
    SELECT compare.tv_show_id, count(compare.tv_show_id) as "amount", tv_show.name, tv_show.poster_path
    FROM tv_show_list
        JOIN tv_show_list compare ON compare.user_id = tv_show_list.user_id
        JOIN tv_show ON tv_show.id = compare.tv_show_id
    WHERE tv_show_list.user_id <> ? AND tv_show_list.tv_show_id = ? AND compare.tv_show_id <> ?
    GROUP BY tv_show.name;
`;

module.exports = (app) => {
    app.post("/recommendations/get-tv-shows", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(401).send({ code: "ERR_TV_SHOW_RECOMMENDATIONS_NO_USER" });
        
        const user = req.user || req.body.user;

        pool.query(getUsersTvShowWithExy, [user.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_TV_SHOW_RECOMMENDATIONS_USERS_MOVIES" });

            if (results.length === 0) return res.send({ usersTvShows: [] });

            let usersTvShows = await getRecommendations(results, user.id);

            return res.send({ usersTvShows });
        });
    });
};

async function getRecommendations(shows, userID) {
    let usersTvShows = shows;

    await Promise.all(usersTvShows.map(async show => {
        await new Promise(resolve => {
            pool.query(getAmountOfTvShowsThatShareListWithSpecifiedMovie, [userID, show.tv_show_id, show.tv_show_id], (err, results) => {
                if (err) return resolve();

                if (results.length > 0) {
                    show.recommendations = results;
                }
                resolve();
            });
        })
    }))

    return usersTvShows;
}   