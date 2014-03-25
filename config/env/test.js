module.exports = {
  db: {
    name: "twitter_wall_test",
    password: "",
    username: "test",
    storage: "test.sqlite"
  },
  app: {
    name: "Test: Twitter Wall"
  },
  twitter: {
    clientID: "CONSUMER_KEY",
    clientSecret: "CONSUMER_SECRET",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  }
}