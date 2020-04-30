const pool = require("../../services/db");
const moment = require("moment");

const checkDuplicate = `
    SELECT tv_show.id
    FROM tv_show
        JOIN tv_show_list ON tv_show_list.tv_show_id = tv_show.id
    WHERE user_id = ? AND tv_show.id = ?;
`;

const insertShow = `
    INSERT INTO tv_show
    (id, name, backdrop_path, poster_path, vote_average)
    VALUES(?, ?, ?, ?, ?);
`;

const insertToShowList = `
    INSERT INTO tv_show_list
    (user_id, tv_show_id, rating, added)
    VALUES(?, ?, ?, ?);
`; 

module.exports = (app) => {
    app.post("/lists/add-tv-show", (req, res) => {
        if (req.body.details == null || req.body.rating == null) return res.status(400).send({ code: "ERR_ADD_TV_SHOW_NO_BODY" });
        
        const details = req.body.details;
        
        if (details.name == null || details.name == "") return res.status(400).send({ code: "ERR_ADD_TV_SHOW_NO_NAME" });

        pool.query(checkDuplicate, [req.user.id, details.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_ADD_TV_SHOW_CHECK_DUPLICATE" });

            if (results.length > 0) return res.status(400).send({ message: `You already have ${details.name} on your list.`, code: "ERR_ADD_TV_SHOW_DUPLICATE" });

            pool.getConnection((err, connection) => {
                if (err) return res.status(500).send({ code: "ERR_ADD_TV_SHOW_ADD_CONNECTION" });

                connection.beginTransaction((err) => {
                    if (err) {
                        connection.release();
                        return res.status(500).send({ code: "ERR_ADD_TV_SHOW_ADD_TRANS" });
                    }

                    connection.query(insertShow, [details.id, details.name, details.backdrop_path, details.poster_path, details.vote_average], async (err) => {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release();
                                return res.status(500).send({ code: "ERR_ADD_TV_SHOW" });
                            });
                        }

                        connection.query(insertToShowList, [req.user.id, details.id, req.body.rating, moment().format()], (err) => {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release();
                                    return res.status(500).send({ code: "ERR_ADD_TV_SHOW_TOO_LIST" });
                                });
                            }

                            if(details.credits && details.credits.cast && details.credits.cast.length > 0) {
                                const { script, params } = createInsertActorScript(details.credits.cast);

                                connection.query(script, params, (err) => {
                                    if (err) {
                                        return connection.rollback(function () {
                                            connection.release();
                                            return res.status(500).send({ code: "ERR_ADD_TV_SHOW_ACTORS" });
                                        });
                                    }

                                    const { linkScript, linkParams } = createInsertActorLinkScript(details.credits.cast, details.id);

                                    connection.query(linkScript, linkParams, (err) => {
                                        if (err) {
                                            return connection.rollback(function () {
                                                connection.release();
                                                return res.status(500).send({ code: "ERR_ADD_TV_SHOW_ACTORS_LINKS" });
                                            });
                                        }

                                        connection.commit((err) => {
                                            if (err) {
                                                return connection.rollback(function () {
                                                    connection.release();
                                                    return res.status(500).send({ code: "ERR_ADD_TV_SHOW_ACTORS_COMMIT" });
                                                });
                                            }
                                        });

                                        connection.release();
                                        return res.end();
                                    });
                                });
                            }
                            else {
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(function () {
                                            connection.release();
                                            return res.status(500).send({ code: "ERR_ADD_TV_SHOW_COMMIT" });
                                        });
                                    }
                                });

                                connection.release();
                                return res.end();
                            }
                        });
                    });
                });
            });
        });
    });
};

function createInsertActorScript(actors) {
    let script = "INSERT IGNORE INTO actor (id, name) VALUES ";
    let params = [];

    actors.forEach(actor => {
        script += "(?, ?),";

        params.push(actor.id);
        params.push(actor.name);
    });

    script = script.substring(0, script.length - 1); //remove the , from the end of query
    script += ";";

    return { script, params };
}

function createInsertActorLinkScript(actors, showID) {
    let script = "INSERT IGNORE INTO tv_show_has_actor (tv_show_id, actor_id) VALUES ";
    let params = [];

    actors.forEach(actor => {
        script += "(?, ?),";
        params.push(showID);
        params.push(actor.id);
    });

    script = script.substring(0, script.length - 1); //remove the , from the end of query
    script += ";";

    return { linkScript: script, linkParams: params };
}