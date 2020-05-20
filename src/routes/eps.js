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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
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
      dbServices.addLog(idEntidad, DNIMedico, "Crea paciente["+DNI.toString()+"] ->"+JSON.stringify(reqBody));
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
    let response = {
      DNI : result.data['Identificacion'],
      nombreCliente : result.data['Nombre Paciente'],
      fechaNacimiento : result.data['fechaNacimiento'],
      estadoCivil : result.data['Estado Civil'],
      telefono: result.data['Telefono'],
      sexo : result.data['Sexo'],
    };
    res.send(response);
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
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
                    dbServices.addLog(idEntidad, DNIMedico, "Crea HC["+DNI.toString()+"] ->"+JSON.stringify(reqBody));
                  }
                  res.send(response);
                });
              }else{
                res.status(500); // estaba en 200, pero creo que debe retornar 500.
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.updateFisiologica(DNI, f.lactancia, f.iniciacionSexual,
    f.ginecoObstretico, f.menarca, f.embarazos, f.partos, f.abortos, DNIMedico).then((resp)=>{
      if(resp.status=='OK'){
        res.status(200);
        dbServices.addLog(idEntidad, DNIMedico, "Actualiza Fisiologica["+DNI.toString()+"] ->"+JSON.stringify(reqBody));
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
  let DNIMedico = reqBody.DNIMedico || 1;
  let idEntidad = reqBody.idEntidad || 1;

  dbServices.updateAntecedentes(DNI, a.accidentes, a.antecedentesHereditarios,
      a.enfermedadesInfancia, a.intervencionesQuirurgicas, a.alergias,
      a.inmunizacion, DNIMedico).then((resp)=>{
      if(resp.status=='OK'){
        res.status(200);
        dbServices.addLog(idEntidad, DNIMedico, "Actualiza Fisiologica["+DNI.toString()+"] ->"+JSON.stringify(reqBody));
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
    result = {
      antecedentes : {
        idAntecedente : resp.data.antecedentes['Id Antecedente'],
        accidentes : resp.data.antecedentes['Accidentes'],
        antecedentesHereditarios : resp.data.antecedentes['Antecedentes Hereditarios'],
        enfermedadesInfancia : resp.data.antecedentes['Enfermedades Infancia'],
        intervencionesQuirurgicas : resp.data.antecedentes['Intervencion Quirurgicas'],
        alergias : resp.data.antecedentes['Alergias'],
        inmunizacion : resp.data.antecedentes['Inmunizacion']
      },
      fisiologica : {
        idFisiologica : resp.data.fisiologica['Id Fisiologica'],
        lactancia : resp.data.fisiologica['Lactancia'],
        iniciacionSexual : resp.data.fisiologica['Iniciacion Sexual'],
        ginecoObstretico : resp.data.fisiologica['Gineco Obstretico'],
        menarca : resp.data.fisiologica['Menarca'],
        embarazos : resp.data.fisiologica['Embarazos'],
        partos : resp.data.fisiologica['Partos'],
        abortos : resp.data.fisiologica['Abortos']
      }
    };
    res.send(result);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

//Nicolas eps

app.post('/eps/getMedicos', (req, res)=>{
  dbServices.getMedicos().then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

app.post('/eps/createMedico', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  let nombre = reqBody.nombre;
  let fechaNacimiento = reqBody.fechaNacimiento;
  let telefono = reqBody.telefono;
  dbServices.createMedico(DNI, nombre, fechaNacimiento, telefono)
  .then((response)=>{
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

app.post('/eps/getTratamientos', (req, res)=>{
  dbServices.getTratamientos().then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});


app.post('/eps/createTratamiento', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let concepto = reqBody.concepto;
  dbServices.createTratamiento(concepto)
  .then((response)=>{
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

app.post('/eps/addTratamientoxdiagnostico', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let idDiagnostico = reqBody.idDiagnostico;
  let idTratamiento = reqBody.idTratamiento;
  dbServices.addTratamientoxdiagnostico(idDiagnostico,idTratamiento)
  .then((response)=>{
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
app.post('/eps/createDiagnostico', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let diagnostico = reqBody.diagnostico;
  let idCita = reqBody.idCita;
  dbServices.createDiagnostico(diagnostico,idCita)
  .then((response)=>{
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

app.post('/eps/createTipoExamen', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let nombre = reqBody.nombre;
  dbServices.createTipoExamen(nombre)
  .then((response)=>{
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

app.post('/eps/getTipoExamenes', (req, res)=>{
  dbServices.getTipoExamenes().then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

app.post('/eps/createExamen', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let resumen = reqBody.resumen;
  let resultado = reqBody.resultado;
  let anexo = reqBody.anexo;
  let idTipoExamen = reqBody.idTipoExamen;
  let idDiagnostico = reqBody.idDiagnostico;
  dbServices.createExamen(resumen,resultado,anexo,idTipoExamen,idDiagnostico)
  .then((response)=>{
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

app.post('/eps/createCita', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let idHistoriaClinica = reqBody.idHistoriaClinica;
  let fecha = reqBody.fecha;
  let motivo = reqBody.motivo;
  let epsAgenda = reqBody.epsAgenda;
  let idMedico = reqBody.idMedico;
  let examenFisico = reqBody.examenFisico;
  let habitos = reqBody.habitos;
  let examenSegmentario = reqBody.examenSegmentario;
  dbServices.createCitaMedica(idHistoriaClinica, fecha, motivo, epsAgenda,idMedico,examenFisico,habitos,examenSegmentario)
  .then((response)=>{
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

app.post('/eps/getCitas', (req, res)=>{
  let reqBody = req.body;
  let DNI = reqBody.DNI;
  dbServices.getCitas(DNI).then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

// Jhoan

app.post('/eps/getMedicamentos', (req, res)=> {
  dbServices.getMedicamentos().then((resp)=>{
    res.status(200);
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

app.post('/eps/createMedicamento', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let nombre = reqBody.nombre;
  let gramaje = reqBody.gramaje;
  dbServices.createMedicamento(nombre, gramaje)
  .then((response)=>{
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

app.post('/eps/addMedicamentoxTratamiento', (req, res)=>{
  let reqHeaders = req.headers;
  let reqBody = req.body;
  let idMedicamento = reqBody.idMedicamento;
  let idTratamiento = reqBody.idTratamiento;
  let Repeticion = reqBody.repeticion;
  dbServices.addMedicamentoxTratamiento(idMedicamento, idTratamiento, Repeticion)
  .then((response)=>{
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

app.post('/eps/getCitaMedica', (req, res)=>{
  let reqBody = req.body;
  let id = reqBody.idCitaMedica;
  dbServices.getCitaMedicaByID(id).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    res.status(500);
    res.send(err);
  });
});

module.exports = app;
