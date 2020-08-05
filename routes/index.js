const Controller = require('../controllers/Controller');

function extractModelFromRequest(req){
  let url = req.url.split(`/`);
  let model = url[1];
  return  model[0].toUpperCase() + model.slice(1);
}

exports.findOne = async (req,res,next) => {
  const model = extractModelFromRequest(req);
  let controller = new Controller({model:model});
  const result = await controller.findOne(req,res);
  res.status(result.status).json({ret: result.ret, data:result.dataResult,message:result.message})
}

exports.findAll = async (req,res,next) => {
  const model = extractModelFromRequest(req);
  let controller = new Controller({model:model});
  const result = await controller.findAll(req,res);
  res.status(result.status).json({ret: result.ret, data:result.dataResult,message:result.message})
}

exports.create = async (req,res,next) => {
  const model = extractModelFromRequest(req);
  let controller = new Controller({model:model})
  const result = await controller.create(req,res);
  res.status(result.status).json({ret: result.ret, data:result.dataResult,message:result.message})
}

exports.update = async (req,res,next) => {
  const model = extractModelFromRequest(req);
  let controller = new Controller({model:model})
  const result = await controller.update(req,res);
  res.status(result.status).json({ret: result.ret, data:result.dataResult,message:result.message})
}

exports.delete = async (req,res,next) => {
  const model = extractModelFromRequest(req);
  let controller = new Controller({model:model})
  const result = await controller.delete(req,res);
  res.status(result.status).json({ret: result.ret, data:result.dataResult,message:result.message})
}