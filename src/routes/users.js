//Ver comentarios server.js para obtener más info
const express = require('express');
const app = express();
//Creación de endpoints
//app.get Siginifica que escuchara las peticiones de tipo GET que vayan al path
//Que se le esta pasando como primer argumento.
//El segundo argumento es una función callback que se ejecuta cuando una petición
//Llega a ese path
app.get('/users/index', function(req, res){
  //req = a la información de la petición que llega.
  //La mayoría de las veces solo nos importan sus cabeceras y su cuerpo
  let reqHeaders = req.headers;
  let reqBody = req.body;
  res.status(200);
  let response = {
    code : 1,
    data : {
      message : "Algo para devolver"
    }
  };
  res.send(response);
});
module.exports = app;
