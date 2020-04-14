//Ver comentarios en server.js para entender estos require
const express = require('express');
const app = express();

//'Importamos' las configuraciones de estos 2 archivos, que para el caso practico
//Son el manejo de las peticiones que se le hagan a nuestro servidor
app.use(require('./eps'));
app.use(require('./users'));

//Lo que esté en module.exports es lo que se obtiene cuando se hace un require
//En otro archivo, es el objeto que se le devuelve cuando se hace el require
//En este caso una instancia de Express
module.exports = app;
