//jshint esversion:6
//require dotenv and call config() method\
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//require mongoose
const mongoose = require('mongoose');
//require mongooose encryption
const encrypt = require ("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//let us test to console.log our .env variables if we can access them
//console.log(process.env.SECRET);

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewURLParser:true});

//create userSchema
const userSchema= new mongoose.Schema({
  email:String,
  password:String
})

//use secrete convinient method to encrypt our DB
//WE need to use this before we created out mongoose model
//const secret="Thisisourlittlesecret.";
//use schema to specify which field we want to encrypt and pass in the secret  key  we want to use to encrypt our DB //if we want to encrypt multiple field we need to add more field ie ["password","email"]
//after having a .env file we need to include our SECRET variable to this line of code i.e process.env.SECRET

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedField:["password"]});

//use userSchema to create a user model

const User = mongoose.model("User",userSchema);

 


app.get("/",function(req,res){
    res.render("home");
})



app.get("/login",function(req,res){
    res.render("login");
})


app.get("/register",function(req,res){
    res.render("register");
})


app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save()
    .then(() => {
      //we want only to render secrets page if user has regsiter or login
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});


//making post request to a loginj page
app.post("/login", function(req, res) {
  //these variables will grab what user has type in the login form
  const username = req.body.username;
  const password = req.body.password;
//this method will check to the DB iif what has been typed in the login form matches the one in the DB
  User.findOne({ email: username })//if email in db is same as username or email typed in by
    .then((foundUser) => {
      if (foundUser && foundUser.password === password) {
        res.render("secrets");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});