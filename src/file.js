'use strict';

const fs = require('fs');

var read = (path) => {
  return new Promise((resolve,reject) => {
    fs.readFile(path, (err,data) => {
      if (err) return reject(err);
      resolve(String(data));
    })
  });
};

var write = (path, data) => {
  return new Promise((resolve,reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve(true);
    })
  });
};

var mkdir = (path) => {
  return new Promise((resolve,reject) => {
    fs.mkdir(path, (err) => {
      if (err) return reject(err);
      resolve(true);
    })
  });
};

module.exports = {
  read, write, mkdir
}
