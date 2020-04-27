const pool = require("../../services/db");

const getTVShowList = `
    SELECT rating, tv_show.name, tv_show.id as "showID"
    FROM tv_show_list
        JOIN tv_show ON tv_show.id = tv_show_list.tv_show_id
    WHERE user_id = ?;
`;

module.exports = (app) => {
    app.post("/lists/get-tv-shows", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(400).send({ code: "ERR_GET_TV_SHOWS_NO_USER" });
        
        const user = req.user || req.body.user;

        pool.query(getTVShowList, [user.id], (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_GET_TV_SHOWS" });

            return res.send({ results });
        });
    });
};