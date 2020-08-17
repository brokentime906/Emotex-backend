const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("./schemas/User");
const config = {
  client_id:
    "1098545434211-jv5gos6v3vh1das6c4n7kiv48ooqjf6t.apps.googleusercontent.com",
  project_id: "emotechs-286606",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_secret: "-Ocs92Dv8HyA69AXvarUVLX0",
  redirect_uris: ["http://af4943e5c2c4.ngrok.io/oauth2callback"],
  javascript_origins: ["http://af4943e5c2c4.ngrok.io"],
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
          currentUser.accessToken = accessToken;
          currentUser.refreshToken = refreshToken;

          done(null, currentUser);
        } else {
          console.log("유저 없으니까 만든다");
          const newUser = new User({ google_id: id, username: displayName });
          await newUser.save();
          newUser.accessToken = accessToken;
          newUser.refreshToken = refreshToken;
          // console.log(newUser);
          done(null, newUser);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
