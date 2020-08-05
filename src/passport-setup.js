const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("./schemas/User");
const config = {
  client_id:
    "431524974496-3h8gsv7bpog102d9mn5hk08tck7duei4.apps.googleusercontent.com",
  project_id: "emotex-284018",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_secret: "IA58XDMECgbmrGuW1zU8Six2",
  redirect_uris: ["http://localhost:4000/oauth2callback"],
  javascript_origins: ["http://localhost:4000"],
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, user);
  }
});
passport.use(
  new GoogleStrategy(
    {
      //oprionts for the google start
      callbackURL: "/oauth2callback",
      clientID: config.client_id,
      clientSecret: config.client_secret,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { displayName, id } = profile;
      console.log(displayName, id);
      try {
        const currentUser = await User.findOne({ google_id: id });
        if (currentUser) {
          console.log("이미 유저있어");
          done(null, currentUser);
        } else {
          console.log("유저 없으니까 만든다");
          const newUser = new User({ google_id: id, username: displayName });
          await newUser.save();
          // console.log(newUser);
          done(null, newUser);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
