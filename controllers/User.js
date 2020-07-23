'use strict';

const models = require('../models');
const User = models.User;
const protos =
				{
					'user' : require('../prototype_collections/UserProto').User,
					'pribadi' : require('../prototype_collections/PribadiProto').Pribadi,
				}
let ProcessingSequelize = Object.create(require('../helper_prototypes/ProcessingSequelize'));
let protosUsed = [protos.user]; //Initialize with default prototype of model

let thismessage;
let thisdataResult;
let thisret;
let thisstatus;

function successResponse(dataResult={},message='Succesfully executed'){
	thisret = 0;
	thismessage = message;
	thisstatus = 200;
	thisdataResult = dataResult;
}

function errorResponse(err,message='Unsuccesfully executed'){
	console.log(err)
	thisret = -1;
	thismessage = message;
	thisstatus = 500;
  thisdataResult = {}
}

function notFoundResponse(message='No Data Found'){
	thisret = -1;
	thismessage = message;
	thisstatus = 404;
  thisdataResult = {}
}

exports.findOne = async (req, res) => {
  let id = req.params.id;
  let includes = req.params.includes;
  let dataResult

  includes.map(function(value, key, index) {
  	protosUsed.push(protos[value])
  });

  try{
  	let data = await User.findOne({
											      where: {id: id}, 
											      include: includes
											    });

  	if(data){
  		await ProcessingSequelize.init(data,protosUsed).serializeOneRow();					
		  dataResult = ProcessingSequelize.resultSerialization;
		  successResponse(dataResult);
  	}else{
  		notFoundResponse()
  	}
  }catch(err){
  	errorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};

exports.findAll = async (req, res) => {
  let includes = req.params.includes;

  includes.map(function(value, key, index) {
  	protosUsed.push(protos[value])
  });

  try{
  	let data = await User.findAll({
											      include: includes
											    });

		await ProcessingSequelize.init(data,protosUsed)
	  										.serializeMultiRow();			  												

	  let dataResult = ProcessingSequelize.resultSerialization;
	  successResponse(dataResult);
  }catch(err){
  	errorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};