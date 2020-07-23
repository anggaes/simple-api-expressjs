'use strict';

const ProcessingSequelize = Object.create({
  init: function(dataFromSequelize,protos){
    this.dataFromSequelize = dataFromSequelize;
    this.protos = protos;
    this.resultSerialization;
    return this;
  },
  get _isInitialized() {
    if(this.dataFromSequelize && this.protos)
      return true;
    else{
      return false;
    }
  },
  serializeOneRow: function(){
    if(!this._isInitialized) 
        throw new Error('ProcessingSequelize is not initialized yet');
    this.resultSerialization = this._serializeOne(this.dataFromSequelize,this.protos);
    return this;
  },
  _serializeOne: function(dataFromSequelize,protos){
    let i = 0;
    function serializeRecursive(dataFromSequelize,protos){
      let bucketOfObject = Object.create(protos[i]);
      i++;
      if(dataFromSequelize.dataValues)
      Object.keys(dataFromSequelize.dataValues).map(function(key, index) {
        if(dataFromSequelize.dataValues[key] !== null && dataFromSequelize.dataValues[key].dataValues && typeof dataFromSequelize.dataValues[key] === "object"){
          bucketOfObject[key] = serializeRecursive(dataFromSequelize.dataValues[key],protos);
        }else
          bucketOfObject[key] = dataFromSequelize.dataValues[key];   
      });
      return bucketOfObject
    }
    return serializeRecursive(dataFromSequelize,protos)
  },
  serializeMultiRow: async function(){
    if(!this._isInitialized) 
      throw new Error('ProcessingSequelize is not initialized yet');

    this.dataFromSequelize = this.dataFromSequelize.rows ? this.dataFromSequelize.rows : this.dataFromSequelize

    if(!Array.isArray(this.dataFromSequelize))
      throw new Error('Data from Sequelize or Data.rows must be an Array');

    let result = []
    const _serializeOne = this._serializeOne
    const protos = this.protos
    
    await this.dataFromSequelize.map(async function(value, key, index) {
      result.push(await _serializeOne(value,protos))
    });
    this.resultSerialization = result;

    return this;
  },
  // setGender: function(gender){
  //     if(!this._isInitialized) 
  //         throw new Error('Pribadi is not initialized yet');
  //     this.gender = gender;
  //     return this
  // }
});


module.exports = ProcessingSequelize;