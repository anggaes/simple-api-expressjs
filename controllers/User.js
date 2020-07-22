const models = require('../models');
const User = models.User;
let pribadiProto = require('../prototype_collections/PribadiProto').Pribadi;
let userProto = require('../prototype_collections/UserProto').User;
let ProcessingSequelize = Object.create(require('../helper_prototypes/ProcessingSequelize'))


exports.findOne = async (req, res) => {
  let id = req.params.id;
  let includes = req.params.includes
  let protos = [userProto,pribadiProto]

  let data = await User.findOne({
											      where: {id: id}, 
											      include: includes
											    })

  ProcessingSequelize.init(data,protos)
  ProcessingSequelize.serializeOneRow(data,protos)

  let userObject = ProcessingSequelize.resultSerialization

  console.log(userObject)
  res.status(200).json(userObject);
};