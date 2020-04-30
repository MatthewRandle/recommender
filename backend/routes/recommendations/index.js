module.exports = app => {
    require("./getMovieRecommendations")(app);
    require("./getTvShowRecommendations")(app);
};