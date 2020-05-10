var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var exphbs  = require('express-handlebars');
var messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);


var saltRounds = 10
const User = require("../models/User");
var key = require("../mysetup/myurl");

//routes to authenticate number through otp verification


// Display page to ask the user for their phone number
router.get('/', function(req, res) {

    res.render("step1", {
                    number:'+918076721857',
                     email:'ghazaliwasim1999@gmail.com'
                });

});



// Handle phone number submission

router.post('/step2/:email', function(req, res) {

    var number = req.body.number;
     console.log("number is"+number);
     console.log(req.body);
    

    // Make request to Verify API

    messagebird.verify.create(number, {

        originator : 'Code',

        template : 'Your verification code is %token.'

    }, function (err, response) {
            console.log("twooo");

        if (err) {

            // Request has failed

            console.log(err);

            res.render('step1', {

                error : err.errors[0].description

            });

        } else {

            // Request was successful

            res.render('step2', {

                id : response.id,
                email: req.params.email

            });

        }

    })    

});



// Verify whether the token is correct

router.post('/step3/:email', function(req, res) {

    var id = req.body.id;
    var email = req.params.email;
    var token = req.body.token;


    // Make request to Verify API

    messagebird.verify.verify(id, token, function(err, response) {

        if (err) {

            // Verification has failed
            //set the phone number to NULL if otp is not verified
            User.findOne({email:email})
            .then(doc => {
                doc.number=0;
                console.log(doc);

              })
              .catch(err => {
                console.log(err);
              });



            console.log(err);

            res.render('step2', {

                error: err.errors[0].description,

                id : id

            });

        } else {

            // Verification was successful

            console.log(response);

            res.render('step3');

        }

    })    

});



module.exports=router;