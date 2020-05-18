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
    let data = result.data;
    let prettyData = {
      identificacion : result.data["Identificación"],
      nombrePaciente : result.data["Nombre Paciente"],
      fechaNacimiento : result.data["fechaNacimiento"],
      estadoCivil : result.data["Estado Civil"],
      telefono : result.data["Telefono"],
      sexo : result.data["Sexo"],
      token : result.data["Token"]
    }
    result.data = prettyData;
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
    let antecedentes = resp.data.antecedentes;
    let fisiologica = resp.data.fisiologica;
    let prettyAntecedentes = {
      id : resp.data.antecedentes["Id Antecedente"],
      accidentes : resp.data.antecedentes["Accidentes"],
      enfermedadesInfancia : resp.data.antecedentes["Enfermedades Infancia"],
      intervencionesQuirurgicas : resp.data.antecedentes["Intervencion Quirurgicas"],
      alergias : resp.data.antecedentes["Alergias"],
      inmunizacion : resp.data.antecedentes["Inmunizacion"]
    };
    let prettyFisiologica = {
      id : resp.data.fisiologica["Id Fisiologica"],
      lactancia : resp.data.fisiologica["Lactancia"],
      iniciacionSexual : resp.data.fisiologica["Iniciacion Sexual"],
      ginecoObstretico : resp.data.fisiologica["Gineco Obstretico"],
      menarca : resp.data.fisiologica["Menarca"],
      embarazos : resp.data.fisiologica["Embarazos"],
      partos : resp.data.fisiologica["Partos"],
      abortos : resp.data.fisiologica["Abortos"]
    }
    resp.data.antecedentes = prettyAntecedentes;
    resp.data.fisiologica = prettyFisiologica;
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

app.post('/users/modifyPassword', (req, res) => {
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  let newPassword = reqBody.newPassword;

  dbServices.modifyPassword(DNI, newPassword).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  })
});
module.exports = app;
