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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
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
    let antecedentes = resp.data.antecedentes;
    let fisiologica = resp.data.fisiologica;
    let prettyAntecedentes = {
      id : resp.data.antecedentes["Id Antecedente"],
      accidentes : resp.data.antecedentes["Accidentes"],
      enfermedadesInfancia : resp.data.antecedentes["Enfermedades Infancia"],
      intervencionesQuirurgicas : resp.data.antecedentes["BIGINTervencion Quirurgicas"],
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

//Nicolas
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.createMedico(DNI, nombre, fechaNacimiento, telefono)
  .then((response)=>{
      res.status(200);
      res.send(response);
      dbServices.addLog(idEntidad, DNIMedico, "Crea Medico["+DNI.toString()+"] ->"+JSON.stringify(reqBody));
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.createTratamiento(concepto)
  .then((response)=>{
      res.status(200);
      res.send(response);
      dbServices.addLog(idEntidad, DNIMedico, "Crea tratamiento ->"+JSON.stringify(reqBody));
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.addTratamientoxdiagnostico(idDiagnostico,idTratamiento)
  .then((response)=>{
      res.status(200);
      dbServices.addLog(idEntidad, DNIMedico, "Agrega TratamientoxDiagnostico ->"+JSON.stringify(reqBody));
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.createDiagnostico(diagnostico,idCita)
  .then((response)=>{
      res.status(200);
      dbServices.addLog(idEntidad, DNIMedico, "Crea diagnostico["+idCita.toString()+"] ->"+JSON.stringify(reqBody));
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
  let idEntidad = reqBody.idEntidad || 1;
  let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.createExamen(resumen,resultado,anexo,idTipoExamen,idDiagnostico)
  .then((response)=>{
      res.status(200);
      res.send(response);
      dbServices.addLog(idEntidad, DNIMedico, "Crea examen["+idDiagnostico.toString()+"] ->"+JSON.stringify(reqBody));
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
  //let idEntidad = reqBody.idEntidad || 1;
  //let DNIMedico = reqBody.DNIMedico || 1;
  dbServices.createCitaMedica(idHistoriaClinica, fecha, motivo, epsAgenda,idMedico,examenFisico,habitos,examenSegmentario)
  .then((response)=>{
      res.status(200);
      //dbServices.addLog(idEntidad, DNIMedico, "Crea cita medica["+idHistoriaClinica.toString()+"] ->"+JSON.stringify(reqBody));
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
