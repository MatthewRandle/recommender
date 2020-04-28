const pool = require("../../services/db");
const moment = require("moment");

const checkDuplicate = `
    SELECT movie.id
    FROM movie
        JOIN movie_list ON movie_list.movie_id = movie.id
    WHERE user_id = ? AND movie.id = ?;
`;

const insertMovie = `
    INSERT IGNORE INTO movie
    (id, name)
    VALUES(?, ?);
`;

const insertToMovieList = `
    INSERT IGNORE INTO movie_list
    (user_id, movie_id, rating, added)
    VALUES(?, ?, ?, ?);
`; 

module.exports = (app) => {
    app.post("/lists/add-movie", (req, res) => {
        if (req.body.details == null || req.body.rating == null) return res.status(400).send({ code: "ERR_ADD_MOVIE_NO_BODY" });
        
        const details = req.body.details;
        
        if (details.name == null || details.name == "") return res.status(400).send({ code: "ERR_ADD_MOVIE_NO_NAME" });

        pool.query(checkDuplicate, [req.user.id, details.id], async (err, results) => {
            if (err) return res.status(500).send({ code: "ERR_ADD_MOVIE_CHECK_DUPLICATE" });

            if (results.length > 0) return res.status(400).send({ message: `You already have ${details.name} on your list.`, code: "ERR_ADD_MOVIE_DUPLICATE" });

            pool.getConnection((err, connection) => {
                if (err) return res.status(500).send({ code: "ERR_ADD_MOVIE_ADD_CONNECTION" });

                connection.beginTransaction((err) => {
                    if (err) {
                        connection.release();
                        return res.status(500).send({ code: "ERR_ADD_MOVIE_ADD_TRANS" });
                    }

                    connection.query(insertMovie, [details.id, details.name], async (err) => {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release();
                                return res.status(500).send({ code: "ERR_ADD_MOVIE" });
                            });
                        }

                        connection.query(insertToMovieList, [req.user.id, details.id, req.body.rating, moment().format()], async (err) => {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release();
                                    return res.status(500).send({ code: "ERR_ADD_MOVIE_TOO_LIST" });
                                });
                            }

                            if (details.genres && details.genres.length > 0) {
                                await new Promise(resolve => {
                                    const { script, params } = createInsertGenreLinkScript(details.genres, details.id);

                                    connection.query(script, params, (err) => {
                                        if (err) {
                                            return connection.rollback(function () {
                                                connection.release();
                                                return res.status(500).send({ code: "ERR_ADD_MOVIE_GENRE_LINKS" });
                                            });
                                        }

                                        resolve();
                                    });
                                })
                            }

                            if (details.credits && details.credits.cast && details.credits.cast.length > 0) {
                                await new Promise(resolve => {
                                    const { script, params } = createInsertActorScript(details.credits.cast);

                                    connection.query(script, params, (err) => {
                                        if (err) {
                                            return connection.rollback(function () {
                                                connection.release();
                                                return res.status(500).send({ code: "ERR_ADD_MOVIE_ACTORS" });
                                            });
                                        }

                                        const { linkScript, linkParams } = createInsertActorLinkScript(details.credits.cast, details.id);

                                        connection.query(linkScript, linkParams, (err) => {
                                            if (err) {
                                                return connection.rollback(function () {
                                                    connection.release();
                                                    return res.status(500).send({ code: "ERR_ADD_MOVIE_ACTORS_LINKS" });
                                                });
                                            }
                                        });

                                        resolve();
                                    });
                                })
                            }
                            
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        return res.status(500).send({ code: "ERR_ADD_MOVIE_COMMIT" });
                                    });
                                }
                            });

                            connection.release();
                            return res.end();
                        });
                    });
                });
            });
        });
    });
};

function createInsertGenreLinkScript(genres, movieID) {
    let script = "INSERT IGNORE INTO movie_has_genre (movie_id, genre_id) VALUES ";
    let params = [];

    genres.forEach(genre => {
        script += "(?, (SELECT id FROM genre WHERE type = ?)),";
        params.push(movieID);
        params.push(genre.name);
    });

    script = script.substring(0, script.length - 1); //remove the , from the end of query
    script += ";";

    return { script, params };
}

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

function createInsertActorLinkScript(actors, movieID) {
    let script = "INSERT IGNORE INTO movie_has_actor (movie_id, actor_id) VALUES ";
    let params = [];

    actors.forEach(actor => {
        script += "(?, ?),";
        params.push(movieID);
        params.push(actor.id);
    });

    script = script.substring(0, script.length - 1); //remove the , from the end of query
    script += ";";

    return { linkScript: script, linkParams: params };
}