const pool = require("../../services/db");

const getMovieList = `
    SELECT rating, movie.name, movie.id as "movieID"
    FROM movie_list
        JOIN movie ON movie.id = movie_list.movie_id
    WHERE user_id = ?;
`;

module.exports = (app) => {
    app.post("/lists/get-movies", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(400).send({ code: "ERR_GET_MOVIES_NO_USER" });
        
        const user = req.user || req.body.user;

        pool.query(getMovieList, [user.id], (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_GET_MOVIES" });

            return res.send({ results });
        });
    });
};