const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const pool = require("./db");
const Url = require("url-parse");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getExistingUser = `
	SELECT auth_user.id, email, password, username, auth_user_settings.profile_picture
    FROM auth_user
        JOIN auth_user_settings ON auth_user_settings.id = auth_user.auth_user_settings_id
    WHERE auth_user.email = ? AND sso_user = 0;
`;

passport.use("auth-sign-in", new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	},
	async(req, email, password, done) => {
		const hostname = new Url(req.body.referer).hostname;

        pool.query(getExistingUser, [email], (err, results) => {
			if(err) return done(null, false, { message: "There was a problem signing you in. Please try again.", code: "ERR_AUTH_SIGN_IN" });

            if (results.length === 0) return done(null, false, { message: "An account with that email address or password does not exist.", code: "ERR_AUTH_SIGN_IN_NOT_FOUND", status: 404 });

            const existingUser = results[0];

            bcrypt.compare(password, existingUser.password.toString(), (err, res) => {
                if (err) {
                    return done(null, false, { message: "There was a problem signing you in. Please try again.", code: "ERR_AUTH_SIGN_IN_HASH" });
                }

                if (res === true) {
                    const user = {
                        email: existingUser.email,
                        id: existingUser.id,
                        username: existingUser.username,
                        profilePicture: existingUser.profile_picture
                    };
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: "An account with that email address or password does not exist.", code: "ERR_AUTH_SIGN_IN_NOT_FOUND", status: 404 });
                }
            });
        });
	}
));

const checkUserExists = `
	SELECT auth_user.id
	FROM auth_user
		JOIN domain ON domain.id = auth_user.domain_id
	WHERE auth_user.email = ? AND auth_user.sso_user = 0;
`;

const newUser = `
	INSERT INTO auth_user
	(email, username, password, auth_user_settings_id, sso_user)
	VALUES(?, ?, ?, ?, 0);
`;

const newUserSettings = `
	INSERT INTO auth_user_settings
	(profile_picture)
	VALUES(?);
`;

const getUser = `
	SELECT auth_user.id, email, username, auth_user_settings.profile_picture
    FROM auth_user
        JOIN auth_user_settings ON auth_user_settings.id = auth_user.auth_user_settings_id
	WHERE auth_user.id = ?;
`;

passport.use("auth-sign-up", new LocalStrategy(
	{
		usernameField: "email", 
		passwordField: "password",
		passReqToCallback: true
	},
	async (req, email, password, done) => {
		try {
            const username = req.body.username || null;
            const hostname = new Url(req.body.referer).hostname;

            pool.query(checkUserExists, [email], (err, results) => {
                if (err) return done(null, false, { code: "ERR_AUTH_SIGN_UP_DUPLICATE_CHECK" });

                if (results.length > 0) return done(null, false, { message: "An account associated with that email already exists.", code: "ERR_AUTH_SIGN_UP_DUPLICATE", status: 409 });

                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) return done(null, false, { code: "ERR_AUTH_SIGN_UP_HASH" });

                    pool.getConnection((err, connection) => {
                        if (err) return done(null, false, { code: "ERR_AUTH_SIGN_UP_CONNECTION" });

                        connection.beginTransaction((err) => {
                            if (err) {
                                connection.release();
                                return done(null, false, { code: "ERR_AUTH_SIGN_UP_TRANSACTION" });
                            }

                            connection.query(newUserSettings, ["/profile-picture.png"], (err, results) => {
                                if (err) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        return done(null, false, { code: "ERR_AUTH_SIGN_UP" });
                                    });
                                }

                                const userSettingsID = results.insertId;

                                connection.query(newUser, [email, username, hash, userSettingsID], (err, results) => {
                                    if (err) {
                                        return connection.rollback(function () {
                                            console.log(err);
                                            connection.release();
                                            return done(null, false, { code: "ERR_AUTH_SIGN_UP" });
                                        });
                                    }

                                    const userID = results.insertId;

                                    connection.query(getUser, [userID], (err, results) => {
                                        if (err) {
                                            return connection.rollback(function () {
                                                connection.release();
                                                return done(null, false, { code: "ERR_AUTH_SIGN_UP_COLLECT" });
                                            });
                                        }

                                        const user = {
                                            email: results[0].email,
                                            id: results[0].id,
                                            username: results[0].username,
                                            profilePicture: results[0].profile_picture
                                        };

                                        connection.commit((err) => {
                                            if (err) {
                                                return connection.rollback(function () {
                                                    connection.release();
                                                    return done(null, false, { code: "ERR_AUTH_SIGN_UP_COMMIT" });
                                                });
                                            }

                                            connection.release();
                                            return done(null, user);
                                        });
                                    });
                                });
                            });
                        });
                    });
                    
                });
            });
        }
        catch(err) {
            return done(null, false, { code: "ERR_AUTH_SIGN_UP_FATAL" });
        }
	}
));