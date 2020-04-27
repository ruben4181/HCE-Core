//Ver comentarios server.js para obtener más info
const express = require('express');
const app = express();
const dbServices = require('../database/services');

app.get('/eps/index', function(req, res){
  //req = a la información de la petición que llega.
  //La mayoría de las veces solo nos importan sus cabeceras y su cuerpo
  let reqHeaders = req.headers;

  res.status(200);
  let response = {
    code : 1,
    data : {
      message : "Algo para devolver es un GET"
    }
  };
  res.send(response);
});
//Se puede repetir el path siempre y cuando cambie el verbo que
//Esto es igual que el get, la diferencia es que ahora el req tiene una propiedad
//Que se llama body. Además hay otra forma de declarar la función. Se llaman
//Funciones flecha y son igual que las otras, solo que son mas cortas de declarar
app.post('/eps/index', (req, res) => {
  let reqHeaders = req.headers;
  let reqBody = req.body;
  res.status(200);
  //Esto lo unico que hace es devolver el cuerpo del request como cuerpo de respuesta.
  res.send(reqBody);
});

app.post('/eps/createUser', (req, res)=>{
  let reqHeaders = req.headers;
  //Obteniendo los datos del JSON que nos envian
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  let nombre = reqBody.nombre;
  let fechaNacimiento = reqBody.fechaNacimiento;
  let estadoCivil = reqBody.estadoCivil;
  let telefono = reqBody.telefono;
  let sexo = reqBody.sexo;

  dbServices.createUser(DNI, nombre, fechaNacimiento,
    estadoCivil, telefono, sexo).then((response)=>{
      res.status(200);
      res.send(response);
    }).catch((err)=>{
      res.status(500);
      res.send({
        status : 'ERROR',
        message : 'Ha ocurrido un error en el servidor, intente de nuevo mas tarde'
      });
    });
});

module.exports = app;
