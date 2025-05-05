const mongoose = require('mongoose');

const usersSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password:{type:String, required:true}, 
    email: String,
  },
  { versionKey: false }
);

const User = mongoose.model('user', usersSchema, 'users');

module.exports = User;

