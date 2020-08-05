var app = require("express")(),
  passport = require("passport"),
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
  mongoose = require("mongoose"),
  google = require("googleapis"),
  OAuth2 = google.auth.OAuth2,
  session = require("express-session");

var config = {
  clientID:
    "431524974496-3h8gsv7bpog102d9mn5hk08tck7duei4.apps.googleusercontent.com",
  clientSecret: "IA58XDMECgbmrGuW1zU8Six2",
  callbackURL: "http://localhost:4000/oauth2callback",
};

var db = mongoose.connect("mongodb://localhost:27017/testDB");

var userSchema = new mongoose.Schema(
  {
    _id: { type: String, unique: true },
    access_token: String,
    refresh_token: String,
    name: String,
  },
  { collection: "user" }
);

var User = db.model("User", userSchema);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ _id: profile.id }, function (err, res) {
          if (err) return done(err);
          if (res) {
            console.log("user exists");
            return done(null, res);
          } else {
            console.log("insert user");
            var user = new User({
              _id: profile.id,
              access_token: accessToken,
              refresh_token: refreshToken,
              name: profile.displayName,
            });
            user.save(function (err) {
              if (err) return done(err);
              return done(null, user);
            });
          }
        });
      });
    }
  )
);

function userLogged(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

app.use(session({ secret: "somesecret" }));
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "https://www.googleapis.com/auth/youtube.readonly"],
    accessType: "offline",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

app.get("/profile", userLogged, function (req, res) {
  console.log(req.user);

  var oauth2Client = new OAuth2(
    config.clientID,
    config.clientSecret,
    config.callbackURL
  );

  oauth2Client.credentials = {
    access_token: req.user.access_token,
    refresh_token: req.user.refresh_token,
  };

  google
    .youtube({
      version: "v3",
      auth: oauth2Client,
    })
    .subscriptions.list(
      {
        part: "snippet",
        mine: true,
        headers: {},
      },
      function (err, data, response) {
        if (err) {
          console.error("Error: " + err);
          res.json({
            status: "error",
          });
        }
        if (data) {
          console.log(data);
          res.json({
            status: "ok",
            data: data,
          });
        }
        if (response) {
          console.log("Status code: " + response.statusCode);
        }
      }
    );
});

app.listen(8080);

console.log("go to http://localhost:8080/auth/google");
