var express = require("express");
const Controller = require("../controllers/wordCountController");

var router = express.Router();

router.post("/", Controller.getWordCount);

module.exports = router;