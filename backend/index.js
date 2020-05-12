const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const xFrameOptions = require("x-frame-options");
const helmet = require("helmet");
const keys = require("../config/keys");
const RateLimit = require("express-rate-limit");
const sslRedirect = require("heroku-ssl-redirect");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = parseInt(process.env.PORT, 10) || 4000;

const updateRatingLimit = new RateLimit({
    windowMs: 60 * 1000, //30 seconds
    max: 60,
    delayMs: 0
});

const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 900,
    delayMs: 0
});

app.prepare()
    .then(() => {
        require("./services/passport-local");

		const server = express();

		server.use(helmet());
        server.use(sslRedirect());

        server.use("/lists/update-tv-show-rating", updateRatingLimit);
        server.use("/lists/update-movie-rating", updateRatingLimit);

		server.use(
			cookieSession({
				maxAge: 30 * 24 * 60 * 60 * 1000,
				keys: [keys.cookieKey],
				sameSite: "Strict",
                secureProxy: process.env.NODE_ENV === "production" ? true : false
			})
		);

		server.use(passport.initialize());
        server.use(passport.session());
        server.use(xFrameOptions());
		server.use(bodyParser.urlencoded({ extended: true }));
		server.use(bodyParser.json());

        require("./routes")(server);

		/* server.get('/robots.txt', (req, res) => {
            res.sendFile(path.join(__dirname, '../static', 'robots.txt'))
        })

        server.get('/sitemap.xml', (req, res) => {
            res.sendFile(path.join(__dirname, '../static', 'sitemap.xml'))
		}) */

		server.get("/tv/:id", (req, res) => {
			const actualPage = "/tv";
            const queryParams = { id: req.params.id };
			app.render(req, res, actualPage, queryParams);
        });
        
        server.get("/movie/:id", (req, res) => {
            const actualPage = "/movie";
            const queryParams = { id: req.params.id };
            app.render(req, res, actualPage, queryParams);
        });

		server.get("*", (req, res) => {
			return handle(req, res); // for all the react stuff
		});

		server.listen(PORT, err => {
			if (err) throw err;
			console.log(`ready at http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	}); 