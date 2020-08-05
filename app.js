require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const isProduction = process.env.NODE_ENV == "production" ? true : false;

const models = require('./models');
const routes = require('./routes');

// APP
app.disable("x-powered-by");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

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
  app.put("/"+key.toLowerCase()+"/:id", splitIncludeInQuery, routes.update);
})



//ROUTER (END)



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


module.exports = app;
