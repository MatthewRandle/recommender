const pool = require("../../services/db");

const removeMovie = `
    DELETE FROM movie_list
    WHERE user_id = ? AND movie_id = ?;
`;

module.exports = (app) => {
    app.post("/lists/remove-movie", (req, res) => {
        if (req.body.movieID == null) return res.status(400).send({ code: "ERR_REMOVE_MOVIE_NO_BODY" });
        if (req.user == null) return res.status(401).send({ code: "ERR_REMOVE_MOVIE_NO_USER" });

        pool.query(removeMovie, [req.user.id, req.body.movieID], async (err) => {
            if (err) return res.status(500).send({ code: "ERR_REMOVE_MOVIE" });
            
            return res.end();
        });
    });
};