module.exports = app => {
    require("./addTvShow")(app);
    require("./addMovie")(app);
    require("./getTVShowList")(app);
    require("./getMovieList")(app);
    require("./updateTVShowRating")(app);
    require("./updateMovieRating")(app);
};