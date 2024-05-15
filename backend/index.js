const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');
const PORT = 3000;
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = new PrismaClient();
const { config } = require('dotenv');
const router = require("./src/pdfRoutes");
const app = express();
config();

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/callback"
}, async function(accessToken, refreshToken, profile, cb){
  cb(null, profile);
}));

passport.serializeUser((function(user, cb){
  cb(null,user);
}));

passport.deserializeUser((function(obj, cb){
  cb(null,obj);
}));

app.use(cors());
app.use(express.json());

app.get("/login", passport.authenticate('google', { scope: ["profile","email"]}));

app.get("/user/callback", passport.authenticate('google', { failureRedirect: '/login', failureFlash : true }), async (req, res)=>{
  let user = await prisma.User.findUnique({
    where: {
      email : req.user._json.email
    }
    });
  if(!user){
      user = await prisma.User.create({
        data: {
          email: req.user._json.email, 
        }
      });
  }
  req.flash("success", "You are logged in!");
  res.redirect("/file");
});

app.use("/", router);

app.listen(PORT);
