const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User')

module.exports = async (passport) => {
    await passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, cb) => {
            // console.log(profile); //object
            const account = await User.findOne({ googleId: profile.id })

            try {
                if (account) {
                    return cb(null, account)
                } else {
                    const user = new User({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                    })

                    // console.log(user);

                    await user.save()

                    return cb(null, user)
                }
            } catch (error) {
                console.error(error);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}