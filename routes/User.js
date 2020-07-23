const express = require("express");
const router = express.Router();
const user = require("../controllers/User");
const models = require('../models');
const User = models.User;

const splitIncludeInQuery = async function(req,res,next){
	if(req.query.includes){
		let includes = req.query.includes.split(`/`);
		includes = includes ? includes : [];
		req.params.includes = includes
	}else{
		req.params.includes = []
	}
	next()
}

router.get("/:id", splitIncludeInQuery, user.findOne);
router.get("/", splitIncludeInQuery, user.findAll);

module.exports = router;