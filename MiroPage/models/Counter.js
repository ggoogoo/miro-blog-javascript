const mongoose = require('mongoose');

const CodeBoard = new mongoose.Schema({
  todayCount: {type : String},
  totalCount: {type : String},
  dummy: {type: String},
  dummy: {type: String}
});

module.exports = mongoose.model('codeBoard', CodeBoard);
