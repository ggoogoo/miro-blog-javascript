const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Member = new mongoose.Schema({
  id: {type : String},
  password: {type : String},
  name: {type : String},
  studentId: {type : String},
  pwAnswer: {type : String},
  position: {type : String},
  pwQuestion: {type : String},
  dummy2: {type : String},
  dummy3: {type : String},
  dummy4: {type : String}
});

Member.methods.generateHash = function(password){
  return bcrypt.hashSync(password, 8);
}

Member.methods.validateHash = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('member', Member);  // Collection name, Const name
