'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const protos = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-13) === '-prototype.js');
  })
  .forEach(file => {
    const proto = require(path.join(__dirname, file));
    protos[file.slice(0,-13).toLowerCase()] = proto;
  });

module.exports = protos;
