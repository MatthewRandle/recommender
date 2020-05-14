module.exports = app => {
    require("./getMovieRecommendations")(app);
    require("./getTvShowRecommendations")(app);
    require("./getMovieActor")(app);
    require("./getTVShowActor")(app);
    require("./getMovieGenre")(app);
};