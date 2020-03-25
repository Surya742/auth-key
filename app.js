//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require('md5');//hash secured
const bcrypt = require('bcrypt');//salted hash secured
const saltRounds = 10;




mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


const userSchema =new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        User.findOne({email:req.body.username},function(err,found){
            if (found){
                res.send("This email address is already taken!,try with another.");
            }else{
                newUser.save(function(err){
                    if(!err){
                        res.render("secrets");
                    }else{
                        res.send(err);
                    }
                });
             
            }
        });
          
    });
    
    
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                

                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result == true){
                        res.render("secrets");
                    }else{
                        res.send("Wrong Password!");
                    }
                });
                    
                
            }else{
                res.send("Wrong Username!");
            }
        }
    });
});






app.listen(3000, function() {
    console.log("Server started on port 3000");
  });