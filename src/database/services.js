var connection = require('./connection');

module.exports = {
  addLog : function(idEntidad, DNIMedico, description){
    let queryString = "call insertLog(?, ?, ?)";
    let query = connection.query(queryString, [idEntidad, DNIMedico, description], (err, result)=>{
      if(err){
        console.log('No se guardó el log');
      } else{
        console.log('Se guardó el log');
      }
    });
  },
  createUser : function(DNI, nombre, fechaNacimiento, estadoCivil, telefono, sexo){
    //Tenemos que retornar una promesa, porque el acceso a la base de datos
    //Es asincrono
    return new Promise((resolve, reject)=>{
      let queryString = "call insertPaciente(?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [DNI, nombre, fechaNacimiento, estadoCivil, telefono, sexo, 'TOKEN'], function(err, result){
          console.log("HERE");
          if(err){
            console.log("Here");
            //Cuando ha ocurrido un error, lo 'lanzamos'
            //Y la tarea asincrona termine
            reject(err);
          } else{
            let response = result[0][0];
            if(response['EL PACIENTE YA EXISTE']==undefined){
              response = {
                status : 'OK',
                message : '¡Paciente creado con exito!'
              }
            } else{
              response = {
                status : 'DECLINED',
                message : 'Lo sentimos, ese paciente ya figura en la base de datos'
              }
            }
            //Cuando hemos obtenido una respuesta exitosa usamos resolve
            //Para que la tarea asincrona termine
            resolve(response);
          }
        });
    });
  },
  getPacienteByDNI : function(DNI){
    return new Promise((resolve, reject)=>{
      let queryString = "call getPacienteForDNI(?)";
      let query = connection.query(queryString, [DNI], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL PACIENTE']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Usuario no existe'
          });
        }
      });

    });
  },
  createFisiologica : function(DNI, lactancia, iniciacionSexual, ginecoObstretico,
    menarca, embarazos, partos, abortos){
      return new Promise((resolve, reject) => {
        let queryString = 'call insertFisiologica(?, ?, ?, ?, ?, ?, ?, ?)';
        let query = connection.query(queryString, [DNI, lactancia, iniciacionSexual,
          ginecoObstretico, menarca, embarazos, partos, abortos], (err, result)=>{
            response = {status:'DECLINED', message : 'Fisiologica no creada'}
            if(err){
              reject(err);
            } else{
              queryStatus = result[0][0]['LA FISIOLOGIA HA SIDO CREADA CON EXITO'];
              if(queryStatus!=undefined){
                response = {status : 'OK',
                message : 'Fisiologica creada con exito',
                id : DNI
                };
              } else {
                response = {status : 'DECLINED',
                message : 'Los datos fisiologicos ya existen'};
              }
              resolve(response);
            }
          });
      });
  },
  createAntecedentes : function(DNI, accidentes, antecedentesHereditarios,
    enfermedadesInfancia, intervencionesQuirurgicas, alergias, inmunizacion){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertAntecedentes(?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [DNI, accidentes, antecedentesHereditarios,
        enfermedadesInfancia, intervencionesQuirurgicas, alergias, inmunizacion], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear antecedentes'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Antecedentes ya existen'}
            let queryStatus = result[0][0]['EL ANTECEDENTE HA SIDO CREADO CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Antecedentes creados exitosamente',
                id : DNI
              }
            }
            resolve(response);
          }
      });
    });
  },
  createHC : function(DNI, idEntidad, idAntecedente, idFisiologica){
      return new Promise((resolve, reject)=>{
        response = {status : 'DECLINED', message : 'Paciente no existe'};
        this.getPacienteByDNI(DNI).then((result)=>{
          if(result.status=='OK'){
            let ID = result.data['Id Paciente'];
            let queryString = "call insertHC(?, ?, ?, ?)";
            let query = connection.query(queryString, [idEntidad, DNI, idAntecedente,
              idFisiologica], (err, result)=>{
                if(err){
                  reject(err);
                } else{
                  let queryStatus = result[0][0]['LA HISTORIA CLINICA HA SIDO CREADO CON EXITO'];
                  if(queryStatus!=undefined){
                    response = { status : 'OK', message : 'Historica clinica creada correctamente'};
                  } else{
                    response = { status : 'DECLINED', message : 'La historia clinica ya existe'};
                  }
                  resolve(response);
                }
              });
          }else{
            resolve(response);
          }
        }).catch((err)=>{
          reject(err);
        });
      });
  },
  updateFisiologica : function(DNI, lactancia, iniciacionSexual, ginecoObstretico,
    menarca, embarazos, partos, abortos, DNIMedico){
    return new Promise(function(resolve, reject) {
      let response = {status : "ERROR", message : "Un error ocurrio al actualizar"};
      let queryString = "call updateFisiologica(?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [DNI, lactancia, iniciacionSexual,
        ginecoObstretico, menarca, embarazos, partos, abortos], (err, result)=>{
          if(err){
            reject(err);
          } else{
            let queryStatus = result[0][0]['LA FISIOLOGICA HA SIDO ACTUALIZADA'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Datos actualizados'}
            } else{
              response = { status : 'DECLINED', message :'Un error ha ocurrido'};
            }
            resolve(response);
          }
        });

    });

  },
  updateAntecedentes : function(DNI, accidentes, antecedentesHereditarios,
    enfermedadesInfancia, intervencionesQuirurgicas, alergias, inmunizacion, DNIMedico){
      return new Promise((resolve, reject)=>{
        let queryString = "call updateAntecedentes(?, ?, ?, ?, ?, ?, ?)";
        let query = connection.query(queryString, [DNI, accidentes, antecedentesHereditarios,
          enfermedadesInfancia, intervencionesQuirurgicas, alergias,
        inmunizacion], (err, result)=>{
          let response = {status : 'ERROR', message : 'Ocurrio un error al actualizar'};
          if(err){
            response['err']=err;
            reject(response);
          } else{
            let queryStatus = result[0][0]['EL ANTECEDENTE HA SIDO ACTUALIZADO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Datos actualizados'}
            } else{
              response = {status: 'DECLINED', message : 'Antecedentes no existen'};
            }
            resolve(response);
          }
        });
      });
  },
  getEntidadByID: function(ID){
    return new Promise((resolve, reject)=>{
      let queryString = "SELECT * FROM Entidad WHERE idEntidad=?"
      let query = connection.query(queryString, [ID], (err, result)=>{
        if(err){
          reject(err);
        } else{
          resolve(result[0])
        }
      });
    });
  },
  getHCForDNI : function(DNI){
    let antecedentes = undefined;
    let fisiologica = undefined;
    return new Promise((resolve, reject)=>{
      let queryString = "call getHCForIdPaciente(?)";
      let query=connection.query(queryString, [DNI], (err, result)=>{
        if(err){
          reject(err)
        } else{
          let response = {status : 'DECLINED', message : 'Historia clinica no existe'};
          let queryStatus=result[0][0];
          if(queryStatus['NO EXISTE UNA HISTORIA CLINICA ASOCIADA CON ESE ID']==undefined){
              queryString = "call getAntecedenteForId(?)";
              let id = queryStatus["Id Historia Clinica"];
              let idAntecedente = queryStatus['Id Antecedente'];
              let idFisiologica = queryStatus['Id Fisiologica'];
              let query = connection.query(queryString, [idAntecedente], (err, result)=>{
                if(err){
                  reject(err);
                } else{
                  queryStatus = result[0][0];
                  response = {status : 'DECLINED', message : 'Antecedentes no existen'};
                  if(queryStatus['NO EXISTE EL ANTECEDENTE']==undefined){
                    antecedentes = queryStatus;
                    let queryString = "call getFisiologicaForId(?)";
                    let query = connection.query(queryString, [idFisiologica], (err, result)=>{
                      if(err){
                        reject(err);
                      } else{
                        response = {status : 'DECLINED', message : 'Fisiologica no existe'};
                        queryStatus = result[0][0];
                        if(queryStatus['NO EXISTE LA FISIOLOGICA']==undefined){
                          fisiologica = queryStatus;
                          response = {status : 'OK', data : {id : id, antecedentes, fisiologica}};

                        }
                        resolve(response);
                      }
                    })
                  } else {
                    resolve(response);
                  }
                }
              })
          } else{
            resolve(response);
          }
        }
      });
    });

  },
  addCitaMedica: function(fecha, motivo, eps, medico, examenFisico, habitos,
    ExamenSegmentario, DNI){

  },
  //Brayan funcion
  createExamenFisico : function(e){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertExamen_Fisico(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [e.estadoConciencia, e.lenguaje, e.auditivo,
        e.agudezaVisual, e.peso, e.estatura, e.facie, e.edadRealAparente,
        e.temperatura, e.actitud], (err, result)=>{
        if(err){
          reject(err);
        } else{
          let queryStatus = result[0][0];
          if(queryStatus['EL EXAMEN FISICO HA SIDO CREADO CON EXITO']!=undefined){
              return resolve({status : 'OK', message : 'Examen fisico creado con exito', data : result[0][0]["ID Examen"]});
          } else {
            return resolve({status : 'DECLINED', message : 'Examen fisico duplicado'});
          }
        }
      });
    });
  },
  createHabito : function(h){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertHabito(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [h.alimentacion, h.apetito, h.sed,
        h.diuresis, h.catarsisIntestinal, h.sueno, h.relacionesSexuales, h.alcohol,
        h.tabaco, h.drogas, h.medicacion], (err,result)=>{
        if(err){
          reject(err);
        }else{
          let queryStatus = result [0][0];
          if(queryStatus['EL HABITO   HA SIDO CREADA CON EXITO']!=undefined){
            return resolve({status : 'OK', message :'Habito creado con exito', data : result[0][0]["ID Habito"]});
          }else{
            return resolve({status : 'DECLINED', message :'Habito duplicado'});
          }
        }
      });
    });
  },
  createExamenSegmetario : function(s){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertExamenSegmentario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [s.cabeza, s.cuello, s.torax,
        s.aparatoCirculatorio, s.aparatoRespiratorio, s.abdomen, s.aparatoUrogenital,
        s.sistemaNervioso, s.psicologicoMental, s.perine, s.examenGenital,
        s.miembrosSuperiores, s.miembrosInferiores], (err,result)=>{
        if(err){
          reject(err);
        }else{
          let queryStatus = result[0][0];
          if(queryStatus['EL EXAMEN SEGMENTARIO   HA SIDO CREADO CON EXITO']){
            return resolve({status : 'OK', message :'Examen segmentario creado con exito', data : result[0][0]["ID Examen Segmentario"]});
          }else{
            return resolve({status : 'DECLINED', message :'Examen segmentario duplicado'});
          }
        }
      });
    });
  },
  modifyPassword : function(DNI, newPassword){
    return new Promise((resolve, reject) =>{
      let queryString = "SELECT token FROM Pacientes WHERE DNI=?";
      let query = connection.query(queryString, [DNI], (err, result)=>{
        if(err){
          reject({status : 'ERROR', message : 'Un error ocurrio durante la busqueda del paciente'});
        } else{
          if(result.length==0){
            return reject({status: 'ERROR', message : 'Paciente no existe'});
          }
          queryString = "UPDATE Pacientes SET token=? WHERE DNI=?";
          let query = connection.query(queryString, [newPassword, DNI], (err, result)=>{
            if(err){
              reject({status : 'ERROR', message : 'Error al asignar nueva contraseña'});
            } else {
              resolve({status : 'OK', message : 'Contraseña modificada correctamente para '+DNI});
            }
          });
        }
      });
    });
  },
  //Nicolas
  createMedico : function(DNI,nombre,fecha,telefono){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertMedico(?, ?, ?, ?)";
      let query = connection.query(queryString, [DNI, nombre, fecha,
        telefono], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear medico'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Medico ya existe'}
            let queryStatus = result[0][0]['EL MEDICO HA SIDO CREADO CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Medico creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },
  getMedicos : function(){
    return new Promise((resolve, reject)=>{
      let queryString = "call getMedicos";
      let query = connection.query(queryString, [], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTEN MEDICOS REGISTRADOS']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay medicos registrados'
          });
        }
      });
    });
  },
  createTratamiento : function(concepto){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertTratamiento(?)";
      let query = connection.query(queryString, [concepto], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear tratamiento'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Medico ya existe'}
            let queryStatus = result[0][0]['EL TRATAMIENTO HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'tratamiento creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },
  addTratamientoxdiagnostico : function(idDiag,idTrat){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertDiagXTrata(?,?)";
      let query = connection.query(queryString, [idDiag,idTrat], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al agregar tratamiento'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Tratamiento ya agregado'}
            let queryStatus = result[0][0]['EL DIAGNOSTICO X TRATAMIENTO HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'tratamiento creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },

  getTratamientos : function(){
    return new Promise((resolve, reject)=>{
      let queryString = "call getTratamientos";
      let query = connection.query(queryString, [], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO HAY TRATAMIENTOS REGISTRADOS']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay tratamientos registrados'
          });
        }
      });
    });
  },

  createDiagnostico : function(diag,idCita){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertDiagnostico(?,?)";
      let query = connection.query(queryString, [diag,idCita], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear diagnostico'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'diagnostico ya existe'}
            let queryStatus = result[0][0]['EL DIAGNOSTICO HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'tratamiento creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },

  createTipoExamen : function(nombre) {
    return new Promise((resolve, reject)=>{
      let queryString = "call insertTipoExamen(?)";
      let query = connection.query(queryString, [nombre], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear Tipo Examen'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Tipo Examen ya existe'}
            let queryStatus = result[0][0]['EL TIPO EXAMEN HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Tipo Examen creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },

  getTipoExamenes : function(){
    return new Promise((resolve, reject)=>{
      let queryString = "call getTipoExamenes";
      let query = connection.query(queryString, [], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO HAY TIPO EXAMENES REGISTRADOS']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay tipo examenes registrados'
          });
        }
      });
    });
  },

  createExamen : function(resumen,resultado,anexo,idTipoExamen,idDiagnostico){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertExamen(?,?,?,?,?)";
      let query = connection.query(queryString, [resumen,resultado,anexo,idTipoExamen,idDiagnostico], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear Examen'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Examen ya existe'}
            let queryStatus = result[0][0]['EL EXAMEN HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Examen creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },

  getMedicoByDNI : function(DNI){
    return new Promise((resolve, reject)=>{
      let queryString = "call getMedicoForDNI(?)";
      let query = connection.query(queryString, [DNI], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL MEDICO']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Medico no existe'
          });
        }
      });

    });
  },

  getTratamientoById : function(ID){
    return new Promise((resolve, reject)=>{
      let queryString = "call getTratamientoForId(?)";
      let query = connection.query(queryString, [ID], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL TRATAMIENTO']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : ' Tratamiento no existe'
          });
        }
      });

    });
  },

  getDiagnosticoById : function(ID){
    return new Promise((resolve, reject)=>{
      let queryString = "call getDiagnosticoForId(?)";
      let query = connection.query(queryString, [ID], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL DIAGNOSTICO']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Diagnostico no existe'
          });
        }
      });

    });
  },

  getExamenFisicoById : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call get_Examen_Fisico_ForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL EXAMEN FISICO CON ESE ID']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Examen Fisico no existe'
          });
        }
      });

    });
  },

  getHabitoById : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call get_Habito_ForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL HABITO  CON ESE ID']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Examen de habitos no existe'
          });
        }
      });

    });
  },

  getExamenSegmentarioById : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call get_ExamenSegmentario_ForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL EXAMEN SEGMENTARIO  CON ESE ID']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Examen segmentario no existe'
          });
        }
      });

    });
  },

  getTipoExamenById : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call getTipoExamenForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL TIPO EXAMEN']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'Tipo examen no existe'
          });
        }
      });

    });
  },

  getExamenesById : function(ID){
    return new Promise((resolve, reject)=>{
      response = {status : 'DECLINED', message : 'Examen no existe'};
      this.getExamenById(ID).then((result)=>{
        if(result.status=='OK'){
          let examen = result.data;
          this.getTipoExamenById(examen.idTipoExamen).then((result)=>{
            if(result.status=='OK'){
              examen["nombre"] = result.data['Nombre de tipo de examen'];
              resolve({
                status : 'OK',
                data : examen
              });
            }else{
              resolve(response);
            }
          }).catch((err)=>{
            reject(err);
          });
        }else{
          resolve(response);
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  },

  getMedicamentosByIdTratamiento : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call getMedsXTrataForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO HAY MEDICAMENTOS PARA ESE TRATAMIENTO']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay medicamentos'
          });
        }
      });
    });
  },

  getTratamientoMById : function(ID){
    return new Promise((resolve, reject)=>{
      response = {status : 'DECLINED', message : 'tratamiento no existe'};
      this.getTratamientoById(ID).then((result)=>{
        if(result.status=='OK'){
          let tratamientot = {concepto:result.data.Concepto};
          this.getMedicamentosByIdTratamiento(ID).then((result)=>{
            if(result.status=='OK'){
              let medicamentost = result.data;
              resolve({
                status : 'OK',
                data : {tratamiento : tratamientot, medicamentos : medicamentost}
              });
            }else{
              resolve(response);
            }
          }).catch((err)=>{
            reject(err);
          });
        }else{
          resolve(response);
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  },


  getTratamientoByIdDiagnostico : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call getDiagXTratasForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO HAY TRATAMIENTOS PARA ESE DIAGNOSTICO']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay tratamientos para ese diagnostico'
          });
        }
      });
    });
  },

  getDiagnosticoConTratamientosById : function(ID){
    return new Promise((resolve, reject)=>{
      response = {status : 'DECLINED', message : 'diagnostico no existe'};
      this.getDiagnosticoById(ID).then((result)=>{
        if(result.status=='OK'){
          let diagnosticot = result.data;
          this.getTratamientoByIdDiagnostico(ID).then((result)=>{
            if(result.status=='OK'){
              let tratamientost = result.data;
              for (let i = 0; i < tratamientost.length; i++) {
                this.getTratamientoMById(tratamientost[i]["Id tratamiento"]).then((result)=>{
                  if(result.status=='OK'){
                    tratamientost[i] = result.data;
                    if(i == tratamientost.length - 1){
                      resolve({
                        status : 'OK',
                        data : {diagnostico : diagnosticot, tratamientos : tratamientost}
                      });
                    }
                  } else if(result.status == 'ERROR' ||result.status == 'DECLINED' && i == tratamientost.length - 1){
                    tratamientost.pop();
                    resolve({
                      status : 'OK',
                      data : {diagnostico : diagnosticot, tratamientos : tratamientost}
                    });
                  } else {
                    resolve(response);
                  }
                }).catch((err)=>{
                  reject(err);
                });
              }
            }else{
              resolve(response);
            }
          }).catch((err)=>{
            reject(err);
          });
        }else{
          resolve(response);
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  },

/*
  getDiagnosticoConTratamientosById : function(ID){
    return new Promise((resolve, reject)=>{
      response = {status : 'DECLINED', message : 'diagnostico no existe'};
      this.getDiagnosticoById(ID).then((result)=>{
        if(result.status=='OK'){
          let diagnosticot = result.data;
          this.getTratamientoByIdDiagnostico(ID).then((result)=>{
            if(result.status=='OK'){
              let tratamientost = result.data;
              this.getTratamientoByIdDiagnostico(ID).then((result)=>{
                if(result.status=='OK'){
                  var tratamientost = result.data;
                  for (let i = 0; i < tratamientost.length; i++) {
                    this.getTratamientoMById(tratamientost[i]["Id tratamiento"]).then((result)=>{
                      if(result.status=='OK'){
                        tratamientost[i] = result.data;
                        console.log(result.data);
                        resolve({
                          status : 'OK',
                          data : {diagnostico : diagnosticot, tratamientos : tratamientost[0]}
                        });
                      }else{
                        resolve(response);
                      }
                    }).catch((err)=>{
                      reject(err);
                    });
                  }
                }else{
                  resolve(response);
                }
              }).catch((err)=>{
                reject(err);
              });
            }else{
              resolve(response);
            }
          }).catch((err)=>{
            reject(err);
          });
        }else{
          resolve(response);
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  },*/

  getDiagnosticosById : function(ID){
    return new Promise((resolve, reject)=>{
      var diagnosticost;
      response = {status : 'DECLINED', message : 'tratamiento no existe'};
      this.getDiagnosticosByIdCita(ID).then((result)=>{
        if(result.status=='OK'){
          diagnosticost = result.data;
          for (let i = 0; i < diagnosticost.length; i++) {
            this.getDiagnosticoConTratamientosById(diagnosticost[i]["Id Diagnostico"]).then((result)=>{
              if(result.status=='OK'){
                diagnosticost[i] = result.data;
                console.log(result.data);
                this.getExamenesByDiagnostico(diagnosticost[i].diagnostico["idDiagnostico"]).then((result)=>{
                  if(result.status=='OK'){
                    diagnosticost[i]={
                      examenes : result.data,
                      diagnostico  : diagnosticost[i].diagnostico,
                      tratamientos : diagnosticost[i].tratamientos
                    };
                    console.log(i);
                    console.log(diagnosticost[i]);
                    if(i == diagnosticost.length - 1){
                      resolve({
                        status : 'OK',
                        data : diagnosticost
                      });
                    }
                  }else{
                    resolve(response);
                  }
                }).catch((err)=>{
                  reject(err);
                });
              }else{
                resolve(response);
              }
            }).catch((err)=>{
              reject(err);
            });
          }
        }else{
          resolve(response);
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  },

  getDiagnosticosByIdCita : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call getDiagnosticosByIdCita(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO HAY NINGUN DIAGNOSTICO']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay diagnosticos'
          });
        }
      });
    });
  },

  getCitas : function(DNI){
    return new Promise((resolve, reject)=>{
      this.getHCForDNI(DNI).then((result)=>{
        if(result.status=='OK'){
          let queryString = "call get_Citas(?)";
          console.log(result);
          let query = connection.query(queryString, [result.data.id], (err, result)=>{
            if(err){
              reject(err);
            } else{
              queryStatus = result[0][0];
              if(queryStatus['NO HAY CITAS MEDICAS']==undefined){
                  resolve({
                    status : 'OK',
                    data : result[0]
                  });
              }

              resolve({
                status : 'ERROR',
                message : 'No hay citas'
              });
            }
          });
        }else{
          resolve({
                status : 'ERROR',
                message : 'No hay citas'
              });
        }
      }).catch((err)=>{
        reject(err);
      });
    });
  },

  createCitaMedica : function(idHistoriaClinica, fecha, motivo, epsAgenda,idMedico,examenFisico,habitos,examenS){
    return new Promise((resolve, reject)=>{
      var idExamenFisico=0;
      var idHabitos=0;
      var idExamenS=0;
      response = {status : 'DECLINED', message : 'Error al crear cita medica'};
      console.log(99, 'Entrando a agregar cita medica');
      this.createExamenFisico(examenFisico).then((result)=>{
        if(result.status=='OK'){
          idExamenFisico=result.data;

          this.createHabito(habitos).then((result)=>{
            if(result.status=='OK'){
              idHabitos=result.data;
              this.createExamenSegmetario(examenS).then((result)=>{
                if(result.status=='OK'){
                  idExamenS=result.data;

                  this.createCitaMedicaT(idHistoriaClinica, fecha, motivo, epsAgenda,idMedico,idExamenFisico,idHabitos,idExamenS).then((result)=>{
                    if(result.status=='OK'){
                      resolve({status : 'OK', message : 'Cita medica creada exitosamente'});
                    }else{resolve(response);}
                  }).catch((err)=>{
                    reject(err);
                  });

                }else{resolve(response);}
              }).catch((err)=>{
                reject(err);
              });
            }else{resolve(response);}
          }).catch((err)=>{
            reject(err);
          });
        }else{resolve(response);}
      }).catch((err)=>{
        reject(err);
      });
    });
  },

  createCitaMedicaT : function(idHistoriaClinica, fecha, motivo, epsAgenda,idMedico,examenFisico,habitos,examenS){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertCitas_Medicas(?,?,?,?,?,?,?,?)";
      let query = connection.query(queryString, [fecha, motivo, epsAgenda,idMedico,examenFisico,habitos,examenS,idHistoriaClinica], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al crear Cita medica'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'Cita ya existe'}
            let queryStatus = result[0][0]['LA CITA MEDICA HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'Cita medica creada exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },



  // Jhoan
  getMedicamentos : function(){
    return new Promise((resolve, reject)=>{
      let queryString = "call getMedicamentos"
      let query = connection.query(queryString, (err, result)=>{
        if(err){
          reject(err);
        } else{
          let queryStatus = result[0][0];
          if(queryStatus['NO HAY MEDICAMENTOS']==undefined){
              resolve({
                status : 'OK',
                data : result[0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'No hay medicamentos registrados'
          });
        }
      });
    });
  },
  getMedicamentoByID : function(idMed){
    return new Promise((resolve, reject)=>{
      let queryString = "call getMedicamentosForId(?)"
      let query = connection.query(queryString, [idMed], (err, result)=>{
        if(err){
          reject(err);
        } else{
          let queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL MEDICAMENTO']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]});
          }
          resolve({
            status : 'ERROR',
            message : 'No existe el medicamento'
          });
        }
      });
    });
  },
  createMedicamento : function(nombre, gramaje){
      return new Promise((resolve, reject) => {
        let queryString = 'call insertMedicamentos(?, ?)';
        let query = connection.query(queryString, [nombre, gramaje], (err, result)=>{
            response = {status:'DECLINED', message : 'Medicamento no creado'}
            if(err){
              reject(err);
            } else{
              queryStatus = result[0][0]['LA MEDICACION X TRATAMIENTO HA SIDO CREADA CON EXITO'];
              if(queryStatus!=undefined){
                response = {status : 'OK',
                message : 'Medicamento creado con exito'
                };
              } else {
                response = {status : 'DECLINED',
                message : 'Los datos de medicamento ya existen'};
              }
              resolve(response);
            }
          });
      });
  },
  addMedicamentoxTratamiento : function(idMed, idTrat, rep){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertMedXTrata(?,?,?)";
      let query = connection.query(queryString, [idMed,idTrat,rep], (err, result)=>{
          response = {status : 'DECLINED', message : 'ERROR al agregar MedicamentoxTratamiento'};
          if(err){
            reject(err);
          } else{
            response = {status : 'DECLINED', message : 'MedicamentoxTratamiento ya agregado'}
            let queryStatus = result[0][0]['LA MEDICACION X TRATAMIENTO HA SIDO CREADA CON EXITO'];
            if(queryStatus!=undefined){
              response = {status : 'OK', message : 'MedicamentoxTratamiento creado exitosamente'}
            }
            resolve(response);
          }
      });
    });
  },

  getExamenById : function(Id){
    return new Promise((resolve, reject)=>{
      let queryString = "call getExamenForId(?)";
      let query = connection.query(queryString, [Id], (err, result)=>{
        if(err){
          reject(err);
        } else{
          queryStatus = result[0][0];
          if(queryStatus['NO EXISTE EL EXAMEN']==undefined){
              resolve({
                status : 'OK',
                data : result[0][0]
              });
          }
          resolve({
            status : 'ERROR',
            message : 'examen no existe'
          });
        }
      });

    });
  },

  getExamenesByDiagnostico : function(idDiag){
    return new Promise((resolve, reject)=>{
      let examenes = undefined;
      let queryString = "call getExamenesForIdDiagnostico(?)"
      let query = connection.query(queryString, [idDiag], (err, result)=>{
        if(err){
          reject(err);
        } else{
          response = {status : 'DECLINED', message : 'ERROR al agregar Tipo examen'};
          let queryStatus = result[0][0];
          if(queryStatus['NO EXISTEN LOS EXAMENES']==undefined){
            examenes = result[0];
            for(let i=0; i<examenes.length; i++){
              let id = examenes[i]['Id Examen'];
              this.getExamenesById(id).then((res)=>{
                if(res.status=='OK'){
                  examenes[i] = res.data;
                  if(i==examenes.length-1){
                    resolve({
                      status : 'OK',
                      data : examenes
                    });
                  }
                } else {
                  resolve(response);
                }
              }).catch((err)=>{
                reject(err);
              });
            }
          } else {resolve(response);}
        }
      });
    });
  },
  getCitaMedicaByID : function(idCitaMed){
    let examen_fisico = undefined;
    let Habitos = undefined;
    let examen_seg = undefined;
    let medico = undefined;
    let Diagnosticos = undefined;
    return new Promise((resolve, reject)=>{
      let queryString = "call get_Citas_Medicas_ForId(?)";
      let query = connection.query(queryString, [idCitaMed], (err, result)=>{
        if(err){
          reject(err);
        } else {
          let response = {status : 'DECLINED', message : 'Cita medica no existe'};
          let queryStatus = result[0][0];
          if(queryStatus['NO EXISTE LA CITA MEDICA']==undefined){
            let id = queryStatus['idConsulta'];
            let DNI_Med = queryStatus['idMedicos'];
            let id_examen_fis = queryStatus['idExamen'];
            let id_habito = queryStatus['idHabito'];
            let id_examen_seg = queryStatus['idExamenSeg'];

            this.getMedicoByDNI(DNI_Med).then((result)=>{
              if(result.status=='OK'){
                medico = result.data;

                this.getExamenFisicoById(id_examen_fis).then((result)=>{
                  if(result.status=='OK'){
                    examen_fisico = result.data;

                    this.getHabitoById(id_habito).then((result)=>{
                      if(result.status=='OK'){
                        Habitos = result.data;

                        this.getExamenSegmentarioById(id_examen_seg).then((result)=>{
                          if(result.status=='OK'){
                            examen_seg = result.data;

                            this.getDiagnosticosById(id).then((result)=>{
                              if(result.status=='OK'){
                                Diagnosticos = result.data;
                                resolve({
                                  status : 'OK',
                                  data : {
                                    fecha : queryStatus['Fecha'],
                                    motivo : queryStatus['Motivo'],
                                    epsAgenda : queryStatus['agenda'],
                                    medico : medico['Nombre Medico'],
                                    examenFisico : examen_fisico,
                                    habitos : Habitos,
                                    examenSegmentario : examen_seg,
                                    diagnosticos : Diagnosticos
                                  }
                                });
                              } else {
                                resolve({
                                  status : 'DECLINED',
                                  message : 'No se encontraron diagnosticos'
                                });
                              }
                            }).catch((err)=>{
                              reject(err);
                            });

                          } else {
                            resolve({
                              status : 'DECLINED',
                              message : 'No existe el examen segmentario'
                            });
                          }
                        }).catch((err)=>{
                          reject(err);
                        });

                      } else {
                        resolve({status : 'DECLINED', message : 'No existe el habito'});
                      }
                    }).catch((err)=>{
                      reject(err);
                    });

                  } else {
                    resolve({status : 'DECLINED', message : 'No existe el examen fisico'});
                  }
                }).catch((err)=>{
                  reject(err);
                });

              } else {
                resolve({status : 'DECLINED', message : 'No existe el medico'});
              }
            }).catch((err)=>{
              reject(err);
            });
          }
        }
      });
    });
  },
  closeConnection : function(){
    return connection.end();
  }
}
/*
module.exports.addExamenFisico(11111, {estadoConcienca: "asdsa",
  lenguaje:"asdas", auditivo:"asdas", agudezaVisual:"asdasd", peso:12.3, estatura:12.9,
  facie:"asdsad", edadRealAparente: "asdas", temperatura : 12.3, actitud :"asdasd"}).then((resp)=>{
    console.log(resp);
  }).catch((err)=>{
    console.log("Error", err);
  });
//*/
