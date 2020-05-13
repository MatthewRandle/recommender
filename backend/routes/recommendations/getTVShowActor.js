const pool = require("../../services/db");

const getRandomActorFromUsersList = `
    SELECT 
        actor.name, 
        actor.id
    FROM tv_show_list
        JOIN tv_show ON tv_show.id = tv_show_list.tv_show_id
        JOIN tv_show_has_actor ON tv_show_has_actor.tv_show_id = tv_show_list.tv_show_id
        JOIN actor ON actor.id = tv_show_has_actor.actor_id
    WHERE tv_show_list.user_id = 1
    GROUP BY actor.id
    ORDER BY RAND()
    LIMIT 1;
`;

module.exports = (app) => {
    app.post("/recommendations/get-tv-show-actor", (req, res) => {
        if (req.body.user == null && req.user == null) return res.status(401).send({ code: "ERR_TV_RECOMMENDATIONS_ACTOR_NO_USER" });
        
        const user = req.user || req.body.user;

        pool.query(getRandomActorFromUsersList, [user.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_TV_RECOMMENDATIONS_ACTOR_USERS_TVS" });

            return res.send({ actor: results[0] });
        });
    });
};