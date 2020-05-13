const pool = require("../../services/db");

const removeShow = `
    DELETE FROM tv_show_list
    WHERE user_id = ? AND tv_show_id = ?;
`;

module.exports = (app) => {
    app.post("/lists/remove-tv-show", (req, res) => {
        if (req.body.showID == null) return res.status(400).send({ code: "ERR_REMOVE_SHOW_NO_BODY" });
        if (req.user == null) return res.status(401).send({ code: "ERR_REMOVE_SHOW_NO_USER" });

        pool.query(removeShow, [req.user.id, req.body.showID], async (err) => {
            if (err) return res.status(500).send({ code: "ERR_REMOVE_SHOW" });
            
            return res.end();
        });
    });
};