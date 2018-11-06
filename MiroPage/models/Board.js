const mongoose = require('mongoose');

const Board = new mongoose.Schema({
  title: {type : String},
  content: {type : String},
  create_at: {type : String},
  viewnumber: {type : Number},
  author: {type : String},
  check: {type : String},
  category: {type : String},
  create_at_year: {type : String},
  create_at_hour: {type : String},
  file: [{type : String}],
  file2: [{type : String}]
});

module.exports = mongoose.model('board', Board);
