const Controller = require('../controllers/Controller');

exports.extractModelFromRequest = (req) => {
  let url = req.url.split(`/`);
  let model = url[1];
  return  model[0].toUpperCase() + model.slice(1);
}


exports.functionFactory = (type='') => {
  return  async function(req,res,next){
    const model = exports.extractModelFromRequest(req);
    let controller = new Controller({model:model});
    let result = {};
    switch(type) {
      case 'findOne':
        result = await controller.findOne(req,res);
        break;
      case 'findAll':
        result = await controller.findAll(req,res);
        break;
      case 'create':
        result = await controller.create(req,res);
        break;
      case 'update':
        result = await controller.update(req,res);
        break;
      case 'delete':
        result = await controller.delete(req,res);
        break;
      case 'test':
        result = await controller.test(req,res);
        break;
      default:
        res.status(404).json({ret: -1, data:{},message:'Unknown routes'})
    }
    res.status(result.status).json({ret: result.ret, data:result.dataResult,message:result.message})
  }
}
