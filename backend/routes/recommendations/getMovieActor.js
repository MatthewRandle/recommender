const pool = require("../../services/db");

const getRandomActorFromUsersList = `
    SELECT 
        actor.name, 
        actor.id
    FROM movie_list
        JOIN movie ON movie.id = movie_list.movie_id
        JOIN movie_has_actor ON movie_has_actor.movie_id = movie_list.movie_id
        JOIN actor ON actor.id = movie_has_actor.actor_id
    WHERE movie_list.user_id = 1
    GROUP BY actor.id
    ORDER BY RAND()
    LIMIT 1;
`;

module.exports = (app) => {
    app.post("/recommendations/get-movie-actor", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(401).send({ code: "ERR_MOVIE_RECOMMENDATIONS_ACTOR_NO_USER" });
        
        const user = req.user || req.body.user;

        pool.query(getRandomActorFromUsersList, [user.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_MOVIE_RECOMMENDATIONS_ACTOR_USERS_MOVIES" });

            return res.send({ actor: results[0] });
        });
    });
};