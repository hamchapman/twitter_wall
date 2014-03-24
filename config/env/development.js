module.exports = {
  db: {
    name: "twitter_wall_dev",
    username: "dev",
    password: "",
    storage: "development.sqlite"
  },
  app: {
    name: "Twitter Wall"
  },
  twitter: {
    clientID:     "XppZMlS5p5XcKD95YpW7VA",
    clientSecret: "pXApJAwdv7Acw1yGb2UmkTRlV8W8t2uTNXaZfOEMA",
    callbackURL:  "http://0.0.0.0:3000/auth/twitter/callback"
  }
}