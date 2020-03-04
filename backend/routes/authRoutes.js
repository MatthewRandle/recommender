const passport = require("passport");

module.exports = app => {
    app.post("/auth/sign-in", (req, res) => {
        passport.authenticate("local-sign-in", (err, user, info) => {
            if (info) {
                return res.status(info.status || 503).send({ message: info.message, code: info.code });                
            }

            req.logIn(user, (err) => {
                if (err) { return res.status(503).send({ message: "Something went wrong. Please try again.", code: "ERR_SIGN_IN_LOGIN" }); }
                return res.sendStatus(200);
            });
        })(req, res);
    });

    app.post("/auth/sign-up", (req, res) => {
        passport.authenticate("local-sign-up", (err, user, info) => {
            if(info) {
                res.status(info.status || 503).send({ message: info.message || null, code: info.code });
                return;
            }
            
            req.logIn(user, (err) => {
                if(err) { res.status(503).send({ message: "Something went wrong. Please try again.", code: "ERR_SIGN_UP_LOGIN" }); }
                res.sendStatus(200);
            });
        })(req, res);
    });

    app.get("/auth/get-user", (req, res) => {
        res.send({ user: req.user });
    });

    app.get("/auth/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};