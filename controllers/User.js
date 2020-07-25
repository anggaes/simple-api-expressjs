'use strict';

const { Op } = require("sequelize");
const thismodel = require('../models').User;
const protos = require('../prototype_collections');

let ProcessingSequelize = require('../helpers/ProcessingSequelize');
let defaultProtos = protos.user
let thisprotosUsed = [defaultProtos]; //Initialize with default prototype of model

let thismessage;
let thisdataResult;
let thisret;
let thisstatus;

function setSuccessResponse(dataResult={},message='Succesfully executed'){
	thisret = 0;
	thismessage = message;
	thisstatus = 200;
	thisdataResult = dataResult;
}

// function setErrorResponse(err,message='Unsuccesfully executed'){
function setErrorResponse(err,message='Unsuccesfully executed'){
	console.log(err)
	thisret = -1;
	thismessage = message;
	thisstatus = 500;
  thisdataResult = {}
}

function setNotFoundResponse(message='No Data Found'){
	thisret = -1;
	thismessage = message;
	thisstatus = 404;
  thisdataResult = {}
}

function removeFieldsForSearchOption(filteredFields=[]){
  let searchOption = Object.keys(thismodel.rawAttributes);
  filteredFields.map(function(value,key){
    searchOption = searchOption.filter(e => (e !== value));
  })

  return searchOption;
}

async function setWhereFields(requestQuery=[],searchOption={}){
  let where = {}; // Set to empty object to avoid old value exist
  await Object.keys(requestQuery).map((value,key) => {
    if(searchOption.indexOf(value) !== -1){
      where[value] = {
        [Op.substring] : requestQuery[value]
      }
    }
  })

  return where;
}

function setLimitAndOffsetForPagination(page=1,length=10){
  let limit = length ? parseInt(length) : 10;
  return {
    limit : limit,
    offset : page ? (parseInt(page) - 1) * limit : 0
  }
}

function setProtosUsed(includes=[]){
  let protosUsed = [defaultProtos]
  includes.map(function(value, key, index) {
    if(thismodel.associations[value] && protos[value]){
      protosUsed.push(protos[value])
    }
  });
  thisprotosUsed = protosUsed;
}

exports.findOne = async (req, res) => {
  let id = req.params.id;
  let includes = req.params.includes;

  setProtosUsed(includes)

  try{
  	let data = await thismodel.findOne({
											      where: {id: id}, 
											      include: includes
											    });

  	if(data){
  		await ProcessingSequelize.init(data,thisprotosUsed).serializeOneRow();					
		  let dataResult = ProcessingSequelize.resultSerialization;
		  setSuccessResponse(dataResult);
  	}else{
  		setNotFoundResponse()
  	}
  }catch(err){
  	setErrorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};

exports.findAll = async (req, res) => {
  let includes = req.params.includes;
  let pagination = req.query.pagination;
  let data;

  let searchOption = removeFieldsForSearchOption(['id','createdAt','updatedAt']);
  let where = await setWhereFields(req.query,searchOption)

  setProtosUsed(includes)

  try{
    if(pagination == '1'){
      let limitAndOffset = setLimitAndOffsetForPagination(req.query.page,req.query.length)
      data = await thismodel.findAndCountAll({
                                              limit: limitAndOffset.limit,
                                              offset: limitAndOffset.offset,
                                              include: includes,
                                              where: where
                                            });

    }else{
      data = await thismodel.findAll({
                                       include: includes,
                                       where: where
                                     });
    }

    await ProcessingSequelize.init(data,thisprotosUsed).serializeMultiRow();     	  												
	  let dataResult = ProcessingSequelize.resultSerialization;
	  setSuccessResponse(dataResult);
  }catch(err){
  	setErrorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};
