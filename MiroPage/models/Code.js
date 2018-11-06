const mongoose = require('mongoose');

const CodeBoard = new mongoose.Schema({
  title: {type : String},
  content: {type : String},
  create_at: {type : String},
  viewnumber: {type : String},
  author: {type : String},
  category: {type : String, default : 'Code'},
  dummy1: {type : String},
  dummy2: {type : String},
  dummy3: {type : String},
  dummy4: {type : String}
});

module.exports = mongoose.model('codeBoard', CodeBoard);
