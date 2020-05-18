//Ver comentarios server.js para obtener más info
const express = require('express');
const app = express();
const dbServices = require('../database/services');
const auth = require('../modules/authentication/authentication');

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
  if(estadoCivil==1){
    estadoCivil="soltero"
  } else{
    estadoCivil="casado"
  }
  let telefono = reqBody.telefono;
  let sexo = reqBody.sexo;
  if(sexo==1){
    sexo="masculino"
  } else{
    if(sexo==2){
      sexo="femenino"
    } else{
      sexo="otro"
    }
  }
  dbServices.createUser(DNI, nombre, fechaNacimiento,
    estadoCivil, telefono, sexo).then((response)=>{
      res.status(200);
      res.send(response);
    }).catch((err)=>{
      res.status(500);
      res.send({
        status : 'ERROR',
        message : 'Ha ocurrido un error en el servidor, intente de nuevo mas tarde',
        err : err
      });
    });
});

app.post('/eps/sign', (req, res)=>{
  let body = req.body;
  let id = body.id;
  let password = body.password;

  auth.signRequest('EPS', id, password).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(401);
    res.send(err);
  })
});

app.post('/eps/getPaciente', (req, res)=>{
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
  })
});
app.post('/eps/createHC', (req, res)=>{
  let reqBody = req.body;
  let a = reqBody.antecedentes;
  let f = reqBody.fisiologica;
  let DNI = reqBody.DNI;
  let idEntidad = reqBody.idEntidad;
  let headers = req.headers;
  dbServices.getPacienteByDNI(DNI).then((resp)=>{
    if(resp.status=='OK'){
      dbServices.createFisiologica(DNI, f.lactancia, f.iniciacionSexual,
        f.ginecoObstretico, f.menarca, f.embarazos, f.partos, f.abortos).then((result)=>{
          if(result.status=='OK'){

            dbServices.createAntecedentes(DNI, a.accidentes, a.antecedentesHereditarios,
            a.enfermedadesInfancia, a.intervencionesQuirurgicas, a.alergias,
            a.inmunizacion).then((result)=>{
              if(result.status=='OK'){
                dbServices.createHC(DNI, idEntidad, DNI, DNI).then((result)=>{
                  if(result.status=='OK'){
                    res.status(200);
                  }
                  res.send(result);
                });
              }else{
                res.status(200);
                res.send(result);
              }
            }).catch((err)=>{
              res.status(500);
              res.send(err);
            })
          } else {
            res.status(500);
            res.send(result);
          }
        }

      ).catch((err)=>{
        res.status(500);
        res.send(err);
      });
    } else { res.status(500); res.send(resp) }
  }).catch((err)=>{ res.send(err)} );
});

app.post('/eps/update/fisiologica', (req, res)=>{
  let reqBody = req.body;
  let f = reqBody.fisiologica;
  let DNI = reqBody.DNI;
  let DNIMedico = reqBody.DNIMedico;
  dbServices.updateFisiologica(DNI, f.lactancia, f.iniciacionSexual,
    f.ginecoObstretico, f.menarca, f.embarazos, f.partos, f.abortos, DNIMedico).then((resp)=>{
      if(resp.status=='OK'){
        res.status(500);
      }
      res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

app.post('/eps/update/antecedentes', (req, res)=>{
  let reqBody = req.body;
  let a = reqBody.antecedentes;
  let DNI = reqBody.DNI;
  let DNIMedico = reqBody.DNIMedico;

  dbServices.updateAntecedentes(DNI, a.accidentes, a.antecedentesHereditarios,
      a.enfermedadesInfancia, a.intervencionesQuirurgicas, a.alergias,
      a.inmunizacion, DNIMedico).then((resp)=>{
      if(resp.status=='OK'){
        res.status(200);
      }
      res.send(resp);
    }).catch((err)=>{
      res.status(500);
      res.send(err);
    });
});

app.post('/eps/getHC', (req, res)=>{
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  let idEntidad = reqBody.idEntidad;

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


module.exports = app;
