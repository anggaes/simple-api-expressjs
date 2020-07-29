const { Op } = require("sequelize");
const models = require('../models');
const protos = require('../prototype_collections');
const ProcessingSequelize = require('../helpers/ProcessingSequelize');

class Controller {

  constructor(options){
    this.op = { Op };
    this.model = models[options.model]
    this.proto = protos[options.model.toLowerCase()]
    this.protoUsed;
    this.response = {}
  }

  setSuccessResponse (dataResult={},message='Succesfully executed') {
    // console.log('SUCCESS')
    this.response = {
      ret : 0,
      status : 200,
      message : message,
      dataResult : dataResult
    }
  }

  setErrorResponse (err,message='Unsuccesfully executed') {
    // console.log('ERROR')
    this.response = {
      ret : -1,
      status : 500,
      message : message,
      dataResult : {}
    }
  }

  setNotFoundResponse (message='No Data Found') {
    // console.log('NOT FOUND')
    this.response = {
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
    this.protosUsed = protosUsed;
  }

  async findOne (req, res){
    let id = req.params.id;
    let includes = req.params.includes;

    this.setProtosUsed(includes)

    try{
      let data = await this.model.findOne({
                              where: {id: id}, 
                              include: includes
                            });

      if(data){
        await ProcessingSequelize.init(data,this.protosUsed).serializeOneRow();          
        let dataResult = ProcessingSequelize.resultSerialization;
        this.setSuccessResponse(dataResult);
      }else{
        this.setNotFoundResponse()
      }
    }catch(err){
      this.setErrorResponse(err);
    }finally{
      res.status(this.response.status).json({ret: this.response.ret, data:this.response.dataResult,message:this.response.message})
    }
  };

  async findAll (req, res) {
    let includes = req.params.includes;
    let pagination = req.query.pagination;
    let data;

    let searchOption = this.removeFieldsForSearchOption(['id','createdAt','updatedAt']);
    let where = await this.setWhereFields(req.query,searchOption)

    this.setProtosUsed(includes)

    try{
      if(pagination == '1'){
        let limitAndOffset = this.setLimitAndOffsetForPagination(req.query.page,req.query.length)
        data = await this.model.findAndCountAll({
                                                limit: limitAndOffset.limit,
                                                offset: limitAndOffset.offset,
                                                include: includes,
                                                where: where
                                              });

      }else{
        data = await this.model.findAll({
                                         include: includes,
                                         where: where
                                       });
      }

      if(data){
        await ProcessingSequelize.init(data,this.protosUsed).serializeMultiRow();          
        let dataResult = ProcessingSequelize.resultSerialization;
        this.setSuccessResponse(dataResult);
      }else{
        this.setNotFoundResponse()
      }
    }catch(err){
      this.setErrorResponse(err);
    }finally{
      res.status(this.response.status).json({ret: this.response.ret, data:this.response.dataResult,message:this.response.message})
    }
  };

}

module.exports = Controller;