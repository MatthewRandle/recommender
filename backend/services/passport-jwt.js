const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const keys = require("../../config/keys");

passport.use("jwt", new JWTStrategy({
    secretOrKey: keys.jwtSecret,
    jwtFromRequest: ExtractJWT.fromBodyField("JWT")
}, async (token, done) => {
    try {
        return done(null, token.user);
    }
    catch(err) {
        done(null, false);
    }
}));