const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	pool.query("SELECT name, email, id FROM user WHERE id = ?;", [id], (err, results) => {
		if (err) {
			done(err, false);
			return;
		}

		if (results.length === 0) {
			done(null, false);
		}
		else {
			done(null, results[0]);
		}
	});
});

passport.use("local-sign-in", new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	},
	async(req, email, password, done) => {
		pool.query("SELECT * FROM user WHERE email = ?;", [email.toLowerCase()], (err, results) => {
			if(err) {
				done(null, false, { message: "There was a problem signing you in. Please try again.", code: "ERR_SIGN_IN" });
				return;
			}

			if(results.length === 1) {
				bcrypt.compare(password, results[0].password.toString(), (err, res) => {
					if (err) {
						return done(null, false, { message: "There was a problem signing you in. Please try again.", code: "ERR_SIGN_IN_HASH" });
					}

					if (res === true) {
						const user = { email: results[0].email, id: results[0].id, name: results[0].name };
						return done(null, user);
					}
					else {
						return done(null, false, { message: "An account with that email address or password does not exist.", code: "ERR_SIGN_IN_NOT_FOUND", status: 404 });
					}
				});
			}			
			else {
				return done(null, false, { message: "An account with that email address or password does not exist.", code: "ERR_SIGN_IN_NOT_FOUND", status: 404 });
			}
		});
	}
));

passport.use("local-sign-up", new LocalStrategy(
	{
		usernameField: "email", 
		passwordField: "password", 
		passReqToCallback: true
	},
	async (req, email, password, done) => {
		pool.query("SELECT count(id) as 'user_exists' from user WHERE email = ?;", [email], (err, results) => {
			if(err) {
				console.log(err);
				done(null, false, { code: "ERR_SIGN_UP_DUPLICATE_CHECK" });
				return;
			}

			if(results[0].user_exists > 0) return done(null, false, { message: "An account associated with that email already exists.", code: "ERR_SIGN_UP_DUPLICATE", status: 409 });
			else {
				bcrypt.hash(password, saltRounds, (err, hash) => {
					if(err) return done(null, false, { code: "ERR_SIGN_UP_HASH" });

					pool.getConnection((err, connection) => {
						if (err) return done(null, false, { code: "ERR_SIGN_UP_CONNECTION" });						

						connection.beginTransaction((err) => {
							if (err) {
								connection.release();
								done(null, false, { code: "ERR_SIGN_UP_TRANSACTION" });
								return;
							}

							connection.query("INSERT INTO user (email, password, name) VALUES (?, ?, ?);", [email.toLowerCase(), hash, req.body.name], (err) => {
								if (err) {
									return connection.rollback(function () {
										connection.release();
										done(null, false, { code: "ERR_SIGN_UP" });
										return;
									});
								}

								connection.query("SELECT name, email, id FROM user WHERE email = ?", [email.toLowerCase()], (err, results) => {
									if (err) {
										return connection.rollback(function () {
											connection.release();
											done(null, false, { code: "ERR_SIGN_UP_COLLECT" });
											return;
										});
									}

									connection.commit((err) => {
										if (err) {
											return connection.rollback(function () {
												connection.release();
												done(null, false, { code: "ERR_SIGN_UP_COMMIT" });
												return;
											});
										}

                                        connection.release();

                                        const user = { email: results[0].email, id: results[0].id, name: results[0].name };
                                        done(null, user);
									});									
								});
							});
						});
					});
				});
			}
		});
	}
));