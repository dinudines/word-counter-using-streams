const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    url: {type: String, required: false, default: ''},
	status: {type: String, enum : ['success','fail'], required: true},
    result: []
}, {timestamps: true});

module.exports = mongoose.model("Counter", counterSchema);