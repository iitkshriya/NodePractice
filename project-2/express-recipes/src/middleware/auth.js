require("dotenv").config();
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const { findUser } = require('../services/users');

const { JWT_SECRET } = process.env;

const strategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, load) => {
        try {
            const user = await findUser({ id : jwtPayload.id });

            if (!user) {
                const err = new Error("User not found");
                err.statusCode = 404;
                throw err;
            }

            load(null, user);
        } catch (error) {
            load(error);
        }
    }
);

passport.use(strategy);

const initialize = () => {
    return passport.initialize();
}

const authenticate = () => {
    return passport.authenticate("jwt", { session: false });
}

module.export = {
    initialize,
    authenticate
};
