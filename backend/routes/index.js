module.exports = app => {
    require("./authRoutes")(app); 
    require("./domain")(app);
    require("./theme")(app);
    require("./documentation")(app);
};