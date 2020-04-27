const pool = require("../../services/db");
const moment = require("moment");

const updateMovieRating = `
    UPDATE movie_list
    SET
        rating = ?,
        changed = ?
    WHERE user_id = ? AND movie_id = ?;
`;

module.exports = (app) => {
    app.post("/lists/update-movie-rating", (req, res) => {
        if (req.body.movieID == null || req.body.rating == null) return res.status(400).send({ code: "ERR_UPDATE_MOVIE_NO_BODY" });
        if (req.user == null) return res.status(401).send({ code: "ERR_UPDATE_MOVIE_NO_USER" });

        pool.query(updateMovieRating, [req.body.rating, moment().format(), req.user.id, req.body.movieID], async (err) => {
            if (err) return res.status(500).send({ code: "ERR_UPDATE_MOVIE" });
            
            return res.end();
        });
    });
};