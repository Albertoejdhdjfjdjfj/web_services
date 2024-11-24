
const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const GitLabStrategy = require("passport-gitlab2").Strategy;
const YandexStrategy = require("passport-yandex").Strategy;
const session = require("express-session");

const app = express();

app.use(
  session({ secret: "sh", resave: false, saveUninitialized: true })
);


app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new GitHubStrategy(
    {
      clientID: "Ov23li9UtotGQG49XF9Z",
      clientSecret: "93219b6b6dd1b84140f019c1b6da01fe4d515de3",
      callbackURL: "http://localhost:8000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);


passport.use(
  new GitLabStrategy(
    {
      clientID:
        "2883016b57579a3e5e79998c3a0ea804dd12b705ec874df72746bba48f3bb52e",
      clientSecret:
        "gloas-dd2bd8f8d877ce32d0727f2df332ce073a7d0aec9c19d529997efe01edfddb89",
      callbackURL: "http://localhost:8000/auth/gitlab/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);


passport.use(
  new YandexStrategy(
    {
      clientID: "3f2bf0dd0a244c708334b807214d2dd0",
      clientSecret: "6a21517c209945318df7704894e8dea2",
      callbackURL: "http://localhost:8000/auth/yandex/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get(
  "/auth/gitlab",
  passport.authenticate("gitlab", { scope: ["read_user"] })
);

app.get(
  "/auth/gitlab/callback",
  passport.authenticate("gitlab", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get(
  "/auth/yandex",
  passport.authenticate("yandex", { scope: ["login:email", "login:info"] })
);

app.get(
  "/auth/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);


app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<h1>Привет, ${req.user.username}!</h1><a href="/logout">Выйти</a>`
    );
  } else {
    res.send(`
      <h1>Вы не авторизованы</h1>
      <a href="/auth/github">Войти через GitHub</a><br>
      <a href="/auth/gitlab">Войти через GitLab</a><br>
      <a href="/auth/yandex">Войти через Яндекс</a>
    `);
  }
});


app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});


app.listen(8000, () => {
  console.log("Сервер запущен на http://localhost:8000");
});
