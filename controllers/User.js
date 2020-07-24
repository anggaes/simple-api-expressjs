'use strict';

const { Op } = require("sequelize");
const models = require('../models');
const thismodel = models.User;
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
let thissearchOption;
let thisfilteredQuery;
let thiswhere = {};

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

function filterFieldForSearchOption(filteredFields=[]){
  thissearchOption = Object.keys(thismodel.rawAttributes);
  filteredFields.map(function(value,key){
    thissearchOption = thissearchOption.filter(e => (e !== value));
  })
}

async function setWhere(requestQuery=[]){
  thiswhere = {}; // Set to empty object to avoid old value exist
  await Object.keys(requestQuery).map((value,key) => {
    if(thissearchOption.indexOf(value) !== -1){
      thiswhere[value] = {
        [Op.substring] : requestQuery[value]
      }
    }
  })
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
  let pagination = req.query.pagination;
  let page = req.query.page;
  let length = req.query.length;
  let data;
  let limit = length ? parseInt(length) : 10;
  let offset = page ? (parseInt(page) - 1) * limit : 0;

  filterFieldForSearchOption(['id','createdAt','updatedAt']);
  await setWhere(req.query)

  includes.map(function(value, key, index) {
  	protosUsed.push(protos[value])
  });

  try{
    if(pagination == '1'){
      data = await thismodel.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            include: includes,
                            where: thiswhere
                          });

    }else{
      data = await thismodel.findAll({
                           include: includes
                         });
    }

    console.log("DATA")
    console.log(data)

    await ProcessingSequelize.init(data,protosUsed).serializeMultiRow();     	  												
	  let dataResult = ProcessingSequelize.resultSerialization;
    // console.log("DATA RESULT")
    // console.log(dataResult)
	  successResponse(dataResult);
  }catch(err){
  	errorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};
