const Controller = require('../controllers/Controller');

exports.findOne = async (req,res,next) => {
  let url = req.url.split(`/`);
  let model = url[1];
  model = model[0].toUpperCase() + model.slice(1)
  let controller = new Controller({model:model})
  controller.findOne(req,res)
}

exports.findAll = async (req,res,next) => {
  let url = req.url.split(`/`);
  let model = url[1];
  model = model[0].toUpperCase() + model.slice(1)
  let controller = new Controller({model:model})
  controller.findAll(req,res)
}