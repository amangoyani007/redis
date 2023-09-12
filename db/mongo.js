const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
    key: String,
    value: String
});

const key = mongoose.model('keyList', keySchema);

module.exports = key;