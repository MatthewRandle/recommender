const pool = require("../../services/db");

const getRandomGenreFromUsersList = `
    SELECT 
        genre.type, 
        genre.id
    FROM genre
        JOIN movie_has_genre ON movie_has_genre.genre_id = genre.id
        JOIN movie_list ON movie_list.movie_id = movie_has_genre.movie_id
    WHERE movie_list.user_id = ?
    ORDER BY RAND()
    LIMIT 1;
`;

module.exports = (app) => {
    app.post("/recommendations/get-movie-genre", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(401).send({ code: "ERR_MOVIE_GENRE_RECOMMENDATIONS_NO_USER" });

        const user = req.user || req.body.user;

        pool.query(getRandomGenreFromUsersList, [user.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_MOVIE_GENRE_RECOMMENDATIONS" });

            return res.send({ genre: results[0] });
        });
    });
};