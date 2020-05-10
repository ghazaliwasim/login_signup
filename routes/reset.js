const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key  = require("../mysetup/myurl").secret;
const User = require('../models/User');
var nodemailer = require('nodemailer');


//route to reset password
router.post('/reset', function (req, res) {
    User.findOne({ email: req.body.email }, function (error, userData) {
        //using nodemailer to send verification mail
        var transporter = nodemailer.createTransport({
            //using mailtrap as the hosting platform to check mails
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "6c76799373c139",
                pass: "9fdfb5f8e43221"
            }

        });
        //var currentDateTime = new Date();

        var mailOptions = {
            from: 'ghazaliwasim1999@gmail.com',
            to: req.body.email,
            subject: 'Password Reset',
            html: "<h1>Welcome To Password Reset ! </h1><p>\
            <h3>Hello "+userData.name+"</h3>\
            If You are requested to reset your password then click on below link<br/>\
            <a href='http://localhost:3000/setting/call/"+userData.email+"'>Click On This Link</a>\
            </p>"
        };

transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                User.updateOne({email: userData.email}, {
                    token: currentDateTime, 
                    
                },  {multi:true},function(err, affected, resp) {
                    return res.status(200).json({
                        success: false,
                        msg: info.response,
                        userlist: resp
                    });
                })
            }
        });
    })

});

//route to  render page for password reset
router.get('/call/:userEmail',function(req,res){
res.render("reset", {
    userEmail:req.params.userEmail
});
})


//route to update password by identifying user through email
router.post('/updatePassword/:email',function(req, res){
    console.log(req.params.email)
    User.findOne({ email: req.params.email }, function (errorFind, userData) {

        console.log(req.body);
        //if password and confirm password matches
        if( req.body.password==req.body.confirmPassword)
        {
            
            //encrypting new password
            bcrypt.genSalt(10, (errB, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                  if (err) throw err;
                    let newPassword = hash;
                    let condition = { _id: userData._id };
                    let dataForUpdate = { password: newPassword/*,updatedDate: new Date()*/ };
                    User.findOneAndUpdate(condition, dataForUpdate, { new: true }, function (error, updatedUser) {
                    
                        if (error) {
                            if (err.name === 'MongoError' && error.code === 11000) {
                              return res.status(500).json({msg:'Mongo Db Error', error:error.message});
                            }else{
                                return res.status(500).json({msg:'Unknown Server Error', error:'Unknow server error when updating User'});
                            }
                        }
                        else{
                                if (!updatedUser) {

                                    return res.status(404).json({
                                        msg: "User Not Found.",
                                        success: false
                                    });
                                }else{
                                return res.status(200).json({
                                    success: true,
                                    msg: "Your password are Successfully Updated",
                                    updatedData: updatedUser
                                });
                            }
                        }
                    });
                });
            });
        }
        if (errorFind)
        {
                return res.status(401).json({
                msg: "Something Went Wrong",
                success: false
            });
        }
    }
    );
   })
module.exports = router;