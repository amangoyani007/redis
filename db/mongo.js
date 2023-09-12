const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
    key: String,
    value: String
});

const keyModel = mongoose.model('keyList', keySchema);

module.exports = keyModel;