var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
var saltRounds = 10
var passport=require("passport");
const User = require("../models/User");
var key = require("../mysetup/myurl");
var fetch=require('node-fetch-npm'); 
var FormData= require('form-data')  ;


router.get('/',(req,res)=>{
   res.status(200).send(`Hi Welcome to the Login and Signup API`);
});

//to view the profile of a person through token generated
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    res.json({
      id: req.body.id,
      name: req.body.name,
      email:req.body.email,
      password:req.body.password,
      dob:req.body.dob,
      number:req.body.number
    });
  }
);

//route to register a user
router.post("/signup", async (req, res) => {
  var newUser = new User({
    name: req.body.name,
    password: req.body.password,
    email:req.body.email,
      password:req.body.password,
      dob:req.body.dob,
      number:req.body.number
  });
//checking for unique and valid email
    await User.findOne({ email: newUser.email })
    .then(async profile => {
      if (!profile) {
        bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
          if (err) {
            console.log("Error is", err.message);
          } else {
            newUser.password = hash;
            await newUser
              .save()
              .then(() => {
                //res.status(200).send(newUser);
                console.log("user saved to database");
				//moving forward to verify number through otp 
                res.render("step1", {
                	number:newUser.number,
                     email:newUser.email
                });
       

              })
              .catch(err => {
                console.log("Error is ", err.message);
              });
          }
        });
      } else {
        res.send("User already exists...");
      }
    })
    .catch(err => {
      console.log("Error is", err.message);
    });
});

//login route
router.post("/login", async (req, res) => {
  var newUser = {};
  newUser.name = req.body.name;
  newUser.password = req.body.password;
  newUser.email=req.body.email;
   newUser.dob=req.body.dob;
   newUser.number=req.body.number;

  await User.findOne({ email: newUser.email })
    .then(profile => {
      if (!profile) {
        res.send("User not exist");
      } else {
        bcrypt.compare(
          newUser.password,
          profile.password,
          async (err, result) => {
            if (err) {
              console.log("Error is", err.message);
            } else if (result == true) {
              //   res.send("User authenticated");
              const payload = {
                id: profile.id,
                name: profile.name,
                email:profile.email,
			      password:profile.password,
			      dob:profile.dob,
			      number:profile.number
              };
              jsonwt.sign(
                payload,
                key.secret,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                }
              );
            } else {
              res.send("User Unauthorized Access");
            }
          }
        );
      }
    })
    .catch(err => {
      console.log("Error is ", err.message);
    });
});




module.exports = router;

