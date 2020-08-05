const { Op } = require("sequelize");
const models = require('../models');
const protos = require('../prototype_collections');
const ProcessingSequelize = require('../helpers/ProcessingSequelize');

class Controller {

  constructor(options){
    this.op = { Op };
    this.model = models[options.model]
    this.proto = protos[options.model.toLowerCase()]
  }

  setSuccessResponse (dataResult={},message='Succesfully executed') {
    // console.log('SUCCESS')
    return {
      ret : 0,
      status : 200,
      message : message,
      dataResult : dataResult
    }
  }

  setErrorResponse (err,message='Unsuccesfully executed') {
    // console.log('ERROR')
    console.log(err)
    return {
      ret : -1,
      status : 500,
      message : message,
      dataResult : {}
    }
  }

  setNotFoundResponse (message='No Data Found') {
    // console.log('NOT FOUND')
    return {
      ret : -1,
      status : 404,
      message : message,
      dataResult : {}
    }
  }

  removeFieldsForSearchOption (filteredFields=[]){
    let searchOption = Object.keys(this.model.rawAttributes);
    filteredFields.map(function(value,key){
      searchOption = searchOption.filter(e => (e !== value));
    })
    return searchOption;
  }

  async setWhereFields (requestQuery=[],searchOption={}){
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

  async setCreateUpdateFields (requestBody=[],proto={}){
    let fields = []; // Set to empty object to avoid old value exist
    await Object.keys(requestBody).map((value,key) => {
      console.log(value)
      console.log(key)
      if(proto.hasOwnProperty(value)){
        console.log(value)
      }
    })
  }

  setLimitAndOffsetForPagination (page=1,length=10){
    let limit = length ? parseInt(length) : 10;
    return {
      limit : limit,
      offset : page ? (parseInt(page) - 1) * limit : 0
    }
  }

  setProtosUsed (includes=[]){
    let protosUsed = [this.proto];
    const model = this.model;
    includes.map(function(value, key, index) {
      if(model.associations[value] && protos[value]){
        protosUsed.push(protos[value])
      }
    });
    return protosUsed;
  }

  async findAllFactory(param={}){
    return param.pagination == '1' ? await this.model.findAndCountAll(param) : await this.model.findAll(param)
  }

  paramFindAllFactory(param={}){
    if(param.pagination=='1'){
      let limitAndOffset = this.setLimitAndOffsetForPagination(param.page,param.length)
      return {
              limit: limitAndOffset.limit,
              offset: limitAndOffset.offset,
              include: param.includes,
              where: param.where
      }
    }else{
      return {
              include: param.includes,
              where: param.where
      }
    }
  }

  async findOne (req, res){
    let id = req.params.id;
    let includes = req.params.includes;
    let response = {};

    const protosUsed = this.setProtosUsed(includes);

    try{
      let data = await this.model.findOne({
                              where: {id: id}, 
                              include: includes
                            });

      if(data){
        await ProcessingSequelize.init(data,protosUsed).serializeOneRow();          
        let dataResult = ProcessingSequelize.resultSerialization;
        response = this.setSuccessResponse(dataResult);
      }else{
        response = this.setNotFoundResponse()
      }
    }catch(err){
      response = this.setErrorResponse(err);
    }finally{
      return response;
    }
  };

  async findAll (req, res) {
    let data;
    let response = {};

    const searchOption = this.removeFieldsForSearchOption(['id','createdAt','updatedAt']);
    const where = await this.setWhereFields(req.query,searchOption)

    const param = {
      includes : req.params.includes,
      pagination: req.query.pagination,
      page: req.query.page,
      length: req.query.length,
      searchOption: searchOption,
      where: where
    };

    const protosUsed = this.setProtosUsed(param.includes);

    try{
      data = await this.findAllFactory(this.paramFindAllFactory(param));

      if(data){
        await ProcessingSequelize.init(data,protosUsed).serializeMultiRow();          
        let dataResult = ProcessingSequelize.resultSerialization;
        response = this.setSuccessResponse(dataResult);
      }else{
        response = this.setNotFoundResponse();
      }
    }catch(err){
      response = this.setErrorResponse(err);
    }finally{
      return response;
    }
  };

  async create (req, res) {
    let response = {};
    try{
      let object = Object.assign(this.proto,req.body);
       /**
      *You can manipulate data with business logic applied from its prototype here
      *Ex : object.setuserName(Math.random().toString(36).substring(7));
      *It will call setuserName function to change username of this object
      **/
      const result = await this.model.create(object);
      response = this.setSuccessResponse(result);
    }catch(err){
      response = this.setErrorResponse(err);
    }finally{
      return response;
    }
  };

  async update (req, res) {
    let response = {};
    let id = req.params.id
    try{
      let data = await this.model.findOne({
                                            where: {id: id},
                                          });

      Object.keys(req.body).map((key,value) => {
        if(data[key]) data[key] = req.body[key];
      })

      const result = await data.save();

      await ProcessingSequelize.init(data,[this.proto]).serializeOneRow(); 
      let dataPrototyped = ProcessingSequelize.resultSerialization;

      /**
      *You can manipulate data with business logic applied from its prototype here
      *Ex : dataPrototyped.setuserName(Math.random().toString(36).substring(7));
      *It will call setuserName function to change username of this object
      **/

      response = this.setSuccessResponse(dataPrototyped);
    }catch(err){
      response = this.setErrorResponse(err);
    }finally{
      return response;
    }
  };

  

}

module.exports = Controller;