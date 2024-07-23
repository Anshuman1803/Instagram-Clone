// Google Authentication
const googleRoute = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userCollection } = require("../model/user.model");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const KEY = process.env.secretKey;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_Secret,
      callbackURL: `${process.env.BACKEND_URL}/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await userCollection.findOne({ googleId: profile.id });
        if (user) {
          return cb(null, user);
        } else {
          user = new userCollection({
            googleId: profile.id,
            userName: profile.displayName.split(" ").join("").toLowerCase(),
            fullName: profile.displayName,
            userEmail: profile.emails[0].value,
            userPassword: profile.emails[0].value.slice(0, 15),
            userProfile: profile.photos[0].value,
            userFollowers: [],
            userFollowing: [],
            savedPost: [],
            likedPost: [],
            userBio: "",
            gender: "",
            website: "",
            isPrivate: false,
            createdAt: Date.now(),
          });

          const generatedToken = JWT.sign({ USER: user.userEmail }, KEY, {
            expiresIn: "72h",
        });
          const hashPassword = bcrypt.hashSync(user.userPassword, 15);
          user.token = generatedToken;
          user.userPassword = hashPassword;
          await user.save();
          return cb(null, user);
        }
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userCollection.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

googleRoute.get("/auth/google", (req, res, next) => {
  userRole = req.query.userType;
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

googleRoute.get("/google/callback", passport.authenticate("google"), (req, res) => {
  const user = req.user;
  res.redirect(
    `${process.env.FRONTEND_URL}/auth/google/callback?userID=${user._id}&Token=${user.token}&userName=${user.userName} &userProfile=${user.userProfile}&userFullName=${user.fullName}&savedPost=${user.savedPost}&userFollwing=${user.userFollowing}&userFollowers=${user.userFollowers}&likedPost=${user.likedPost}`
  );
});

googleRoute.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

googleRoute.get("/google-user", (req, res) => {
  res.send(req.user);
});

googleRoute.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send({ message: "Logged out successfully" });
  });
});


module.exports = {googleRoute}