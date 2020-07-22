const express = require("express");
const router = express.Router();
const user = require("../controllers/User");
const models = require('../models');
const User = models.User;

const addIncludeToParams = async function(req,res,next){
	let includes = req.url.split(`/`)
	includes.splice(0,1)
	includes.splice(-1,1)
	req.params.includes = includes
	next()
}

router.get("/:id", addIncludeToParams, user.findOne);
router.get("/", addIncludeToParams, user.findAll);
router.get("/pribadi/:id", addIncludeToParams, user.findOne);

module.exports = router;