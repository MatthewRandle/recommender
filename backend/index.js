const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const xFrameOptions = require("x-frame-options");
const helmet = require("helmet");
const keys = require("../config/keys");
const cookieParser = require("cookie-parser");
//const RateLimit = require("express-rate-limit");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = parseInt(process.env.PORT, 10) || 3000;

/* const commentLimiter = new RateLimit({
    windowMs: 30 * 1000, //30 seconds
    max: 10,
    delayMs: 0
});

const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 900,
    delayMs: 0
}); */

app.prepare()
	.then(() => {
        require("./services/passport-local");
        require("./services/passport-auth");
        require("./services/passport-jwt");

		const server = express();

		server.use(helmet());

		/* if (process.env.NODE_ENV === "production") {
            server.use("/api/", limiter);
            server.use("/api/new-article-comment", commentLimiter);
            server.use("/api/new-course-comment", commentLimiter);
        } */

		server.use(
			cookieSession({
				maxAge: 30 * 24 * 60 * 60 * 1000,
				keys: [keys.cookieKey],
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production" ? true : false
			})
		);

		server.use(passport.initialize());
        server.use(passport.session());
        server.use(cookieParser());	
        server.use(xFrameOptions());
        server.use("/embed/*", xFrameOptions("ALLOWALL"));
		server.use(bodyParser.urlencoded({ extended: true }));
		server.use(bodyParser.json());

        require("./routes")(server);
        require("./api")(server);

		/* server.get('/robots.txt', (req, res) => {
            res.sendFile(path.join(__dirname, '../static', 'robots.txt'))
        })

        server.get('/sitemap.xml', (req, res) => {
            res.sendFile(path.join(__dirname, '../static', 'sitemap.xml'))
		}) */

		server.get("/dashboard/domain/:hostname", (req, res) => {
			const actualPage = "/dashboard/domain";
			const queryParams = { hostname: req.params.hostname };
			app.render(req, res, actualPage, queryParams);
		});

		server.get("/dashboard/domain/:hostname/users", (req, res) => {
			const actualPage = "/dashboard/domain/users";
			const queryParams = { hostname: req.params.hostname };
			app.render(req, res, actualPage, queryParams);
        });
        
        server.get("/embed/comment-section/:params", (req, res) => {
            const actualPage = "/embed/comment-section";
            const queryParams = { params: req.params.params };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/comment", (req, res) => {
            const actualPage = "/design-and-layout-editor/comment";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/comment-form", (req, res) => {
            const actualPage = "/design-and-layout-editor/comment-form";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/reply-form", (req, res) => {
            const actualPage = "/design-and-layout-editor/reply-form";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/user-section", (req, res) => {
            const actualPage = "/design-and-layout-editor/user-section";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/notification", (req, res) => {
            const actualPage = "/design-and-layout-editor/notification";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/root", (req, res) => {
            const actualPage = "/design-and-layout-editor/root";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/root-comment", (req, res) => {
            const actualPage = "/design-and-layout-editor/root-comment";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/minimized-comment", (req, res) => {
            const actualPage = "/design-and-layout-editor/minimized-comment";
            const queryParams = { hostname: req.params.hostname };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/design-and-layout-editor/:hostname/error", (req, res) => {
            const actualPage = "/design-and-layout-editor/error";
            const queryParams = { hostname: req.params.hostname };
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