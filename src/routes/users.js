//Ver comentarios server.js para obtener más info
const express = require('express');
const app = express();
const auth = require('../modules/authentication/authentication');
const dbServices = require('../database/services');
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
//Endpoint en el cual un usuario obtiene su token para ver sus datos
app.post('/users/sign', (req, res)=>{
  let reqBody = req.body;
  let id = reqBody.id;
  let password = reqBody.password;
  auth.signRequest('USER', id, password).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(401);
    res.send(err);
  });
});
app.post('/users/getPaciente', (req, res)=>{
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  dbServices.getPacienteByDNI(DNI).then((result)=>{
    res.status(200);
    res.send(result);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});
app.post('/users/getHC', (req, res)=>{
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  dbServices.getHCForDNI(DNI).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});
module.exports = app;
