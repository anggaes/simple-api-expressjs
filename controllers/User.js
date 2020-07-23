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
let thisoptionSearch;
let thisfilteredQuery;

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

function setOptionSearch(){
  thisoptionSearch = Object.keys(thismodel.rawAttributes)
  thisoptionSearch = thisoptionSearch.filter(e => (e !== 'createdAt') && (e !== 'updatedAt') && (e !== 'id'))
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
  let keyword

  setOptionSearch();

  let whereObject = {}
  console.log(thisoptionSearch)
  console.log(req.query)

  // thisfilteredQuery = 
  console.log(Object.keys(req.query))

  await Object.keys(req.query).map((value,key) => {
    console.log(thisoptionSearch.indexOf(value))
    if(thisoptionSearch.indexOf(value) !== -1){
      console.log(req.query[value])
      // Object.defineProperty(whereObject, value, {value:req.query[value]})  
      whereObject[value] = {
        [Op.substring] : req.query[value]
      }
    }
  })

  // console.log(whereObject.userName)

  includes.map(function(value, key, index) {
  	protosUsed.push(protos[value])
  });

  try{
    if(pagination == '1'){
      data = await thismodel.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            include: includes,
                            // where: {
                            //   userName: {
                            //     [Op.substring]: 'lala'
                            //   }
                            // }
                            where: whereObject
                          });

    }else{
      data = await thismodel.findAll({
                           include: includes
                         });
    }

    await ProcessingSequelize.init(data,protosUsed).serializeMultiRow();     	  												
	  let dataResult = ProcessingSequelize.resultSerialization;
	  successResponse(dataResult);
  }catch(err){
  	errorResponse(err);
  }finally{
		res.status(thisstatus).json({ret: thisret, data:thisdataResult,message:thismessage})
  }
};
