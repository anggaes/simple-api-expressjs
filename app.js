require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
// const logger = require("./helper/logger");
const isProduction = process.env.NODE_ENV == "production" ? true : false;

const models = require('./models');
const routes = require('./routes');

// APP
// const compression = require("compression");
// const helmet = require("helmet");
// const cors = require("cors");
app.disable("x-powered-by");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// console.log(models)
delete models.sequelize
delete models.Sequelize


const splitIncludeInQuery = async function(req,res,next){
  if(req.query.includes){
    let includes = req.query.includes.split(`/`);
    includes = includes ? includes : [];
    req.params.includes = includes
  }else{
    req.params.includes = []
  }
  next()
}

//ROUTER (START)
Object.keys(models).map(function(key,value){
  app.get("/"+key.toLowerCase()+"/:id", splitIncludeInQuery, routes.findOne);
  app.get("/"+key.toLowerCase()+"/", splitIncludeInQuery, routes.findAll);
  app.post("/"+key.toLowerCase()+"/", splitIncludeInQuery, routes.create);
})



//ROUTER (END)


// app.use(cors());
// app.options("*", cors());
// app.use(compression());
// app.use(helmet());

// Request Transformer && Response Transformer
// const mung = require("express-mung");
// const crypto = require("./helper/crypto");
// const rawBaseUrlList = ["/smile"];
// const rawPathList = [];
// if (isProduction) {
//   app.use(function (req, res, next) {
//     // skip some paths
//     if (
//       req.baseUrl.includes(rawBaseUrlList) ||
//       rawPathList.includes(req.path)
//     ) {
//       next();
//       return;
//     }

//     // decrypt if has data
//     if (req.body.data) {
//       const decryptedData = crypto.decrypt(req.body.data);
//       const dataObj = JSON.parse(decryptedData);
//       req.body = dataObj;
//       //console.log('transformed obj:')
//       //console.log(req.body)
//     }
//     next();
//   });
//   app.use(
//     mung.json(function transform(body, req, res) {
//       // log before send
//       logger.info(
//         req.method +
//         " " +
//         req.url +
//         " - req = " +
//         JSON.stringify(req.body) +
//         ", res = " +
//         JSON.stringify({
//           ret: body.ret,
//           msg: body.msg,
//         })
//       );

//       // skip some paths
//       if (
//         req.baseUrl.includes(rawBaseUrlList) ||
//         rawPathList.includes(req.path)
//       ) {
//         return body;
//       }

//       //encrypt
//       const encryptedData = crypto.encrypt(JSON.stringify(body));
//       body = { data: encryptedData };
//       return body;
//     })
//   );
// } else {
//   app.use(
//     mung.json(function log(body, req, res) {
//       logger.info(
//         req.method +
//         " " +
//         req.url +
//         " - req = " +
//         JSON.stringify(req.body) +
//         ", res = " +
//         JSON.stringify({
//           ret: body.ret,
//           msg: body.msg,
//         })
//       );
//       return body;
//     })
//   );
// }

// ROUTER


// Error Handler
app.use(function (err, req, res, next) {
  // log file
  console.log("hahah")
  console.log(req.method + " " + req.url + " - " + err.stack);

  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ status: 400, message: err });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ status: 401, message: "Invalid Token" });
  }

  // default to 500 server error
  return res.status(500).json({ status: 500, message: err.message });
});

// SwaggerUI

module.exports = app;
