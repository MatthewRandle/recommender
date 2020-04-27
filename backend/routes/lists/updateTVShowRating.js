const pool = require("../../services/db");
const moment = require("moment");

const updateTVShowRating = `
    UPDATE tv_show_list
    SET
        rating = ?,
        changed = ?
    WHERE user_id = ? AND tv_show_id = ?;
`;

module.exports = (app) => {
    app.post("/lists/update-tv-show-rating", (req, res) => {
        if (req.body.showID == null || req.body.rating == null) return res.status(400).send({ code: "ERR_UPDATE_TV_SHOW_NO_BODY" });
        if (req.user == null) return res.status(401).send({ code: "ERR_UPDATE_TV_SHOW_NO_USER" });

        pool.query(updateTVShowRating, [req.body.rating, moment().format(), req.user.id, req.body.showID], async (err) => {
            if (err) return res.status(500).send({ code: "ERR_UPDATE_TV_SHOW" });
            
            return res.end();
        });
    });
};