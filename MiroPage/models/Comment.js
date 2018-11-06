const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
  input: {type : String},
  create_at: {type : String},
  author: {type : String},
  check: {type : String},
  where: {type : String},
  re: {type : String},
  dummy2: {type : String},
  dummy3: {type : String},
  dummy4: {type : String}
});

module.exports = mongoose.model('comment', Comment);
