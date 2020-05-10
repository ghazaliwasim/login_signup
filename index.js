
//requiring all the necessary packages
var express = require('express')
var bodyparser = require("body-parser");
var app = express();
var User = require("./models/User");
const userRoutes = require('./routes/User')
const numRoutes = require('./routes/otp')
const resetRoutes=require('./routes/reset')
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
  var mongoose = require("mongoose");
mongoose.model('User');

var port = process.env.PORT || 3000;
var db = require("./mysetup/myurl").myurl;
var bcrypt = require('bcrypt')
var saltRounds = 10
var passport = require('passport');

var exphbs  = require('express-handlebars');

//setting the view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

  mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//Passport middleware
app.use(passport.initialize());
//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);

//connecting db
mongoose
  .connect(db)
  .then(() => {
     

    console.log("Database is connected");
  })
  .catch(err => {
    console.log("Error is ", err.message);
  });


 app.use("/user", userRoutes);
app.use("/number", numRoutes );
app.use("/setting",resetRoutes);
//listening on port
app.listen(port,()=>{
   console.log(`Server is listening on port ${port}`)
});

