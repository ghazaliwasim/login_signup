//creating a model and schema 
var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name:{
     type:String,
     require:true
   },
   email:{
   	type:String,
   	unique:true,
   	require:true,
    //checking emails validity using a regex
   	match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
   },
   dob:{
   	type:Date,
   	require:true
   },
   number:{
   	type:String,
   	require:true
   },
   password:{
     type:String,
     require:true
   }
});
module.exports  = mongoose.model('User',UserSchema);