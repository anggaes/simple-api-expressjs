'use strict';

const { Op } = require("sequelize");
const models = require('../models');
const thismodel = models.User;
const protos = require('../prototype_collections');

let ProcessingSequelize = Object.create(require('../helper_prototypes/ProcessingSequelize'));
let protosUsed = [protos.user]; //Initialize with default prototype of model

let thismessage;
let thisdataResult;
let thisret;
let thisstatus;
let thissearchOption;
let thisfilteredQuery;
let thiswhere = {};
let thislimit;
let thisoffset;

function setSuccessResponse(dataResult={},message='Succesfully executed'){
	thisret = 0;
	thismessage = message;
	thisstatus = 200;
	thisdataResult = dataResult;
}

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
  thissearchOption = Object.keys(thismodel.rawAttributes);
  filteredFields.map(function(value,key){
    thissearchOption = thissearchOption.filter(e => (e !== value));
  })
}

async function setWhereFields(requestQuery=[]){
  thiswhere = {}; // Set to empty object to avoid old value exist
  await Object.keys(requestQuery).map((value,key) => {
    if(thissearchOption.indexOf(value) !== -1){
      thiswhere[value] = {
        [Op.substring] : requestQuery[value]
      }
    }
  })
}

function setLimitAndOffsetForPagination(page=1,length=10){
  thislimit = length ? parseInt(length) : 10;
  thisoffset = page ? (parseInt(page) - 1) * thislimit : 0;
}

exports.findOne = async (req, res) => {
  let id = req.params.id;
  let includes = req.params.includes;
  let dataResult

  includes.map(function(value, key, index) {
  	protosUsed.push(protos[value])
  });

  try{
  	let data = await thismodel.findOne({
											      where: {id: id}, 
											      include: includes
											    });

  	if(data){
  		await ProcessingSequelize.init(data,protosUsed).serializeOneRow();					
		  dataResult = ProcessingSequelize.resultSerialization;
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

  setLimitAndOffsetForPagination(req.query.page,req.query.length)

  removeFieldsForSearchOption(['id','createdAt','updatedAt']);
  await setWhereFields(req.query)

  includes.map(function(value, key, index) {
  	protosUsed.push(protos[value])
  });

  try{
    if(pagination == '1'){
      data = await thismodel.findAndCountAll({
                            limit: thislimit,
                            offset: thisoffset,
                            include: includes,
                            where: thiswhere
                          });

    }else{
      data = await thismodel.findAll({
                           include: includes
                         });
    }

    await ProcessingSequelize.init(data,protosUsed).serializeMultiRow();     	  												
	  let dataResult = ProcessingSequelize.resultSerialization;
	  setSuccessResponse(dataResult);
  }catch(err){
  	setErrorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};
