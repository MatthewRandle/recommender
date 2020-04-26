module.exports = app => {
    require("./auth")(app);
    require("./email")(app);
    require("./lists")(app); 
};