var connection = require('./connection');

module.exports = {
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
                          response = {status : 'OK', data : {antecedentes, fisiologica}};

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
  addExamenFisico : function(id, data){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertExamen_Fisico(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [id, data.estadoConcienca, data.lenguaje, data.auditivo,
        data.agudezaVisual, data.peso, data.estatura, data.facie, data.edadRealAparente,
      data.temperatura, data.actitud], (err, result)=>{
        if(err){
          reject(err);
        } else{
          let queryStatus = result[0][0];
          if(queryStatus['EL EXAMEN FISICO HA SIDO CREADO CON EXITO']){
              return resolve({status : 'OK', message : 'Examen fisico creado con exito'});
          } else {
            return resolve({status : 'DECLINED', message : 'Examen fisico duplicado'});
          }
        }
      });
    });
  },
  addHabito : function(id, data){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertHabito(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [id, data.alimentacion, data.apetito, data.sed,
        data.diuresis, data.catarsisIntestinal, data.sueno, data.relacionesSexuales, data.alcohol,
        data.tabaco, data.drogas, data.medicacion], (err,result)=>{
        if(err){
          reject(err);
        }else{
          let queryStatus = result [0][0];
          if(queryStatus['EL HABITO   HA SIDO CREADA CON EXITO']){
            return resolve({status : 'OK', message :'Habito creado con exito'});
          }else{
            return resolve({status : 'DECLINED', message :'Habito duplicado'});
          }
        }
      });
    });
  },
  addExamenSegmetario : function(id, data){
    return new Promise((resolve, reject)=>{
      let queryString = "call insertExamenSegmentario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [id, data.cabeza, data.cuello, data.torax,
        data.aparatoCirculatorio, data.aparatoRespiratorio, data.abdomen, data.aparatoUrogenital,
        data.sistemaNervioso, data.psicologicoMental, data.perine, data.examenGenital,
        data.miembrosSuperiores, data.miembrosInferiores], (err,result)=>{
        if(err){
          reject(err);
        }else{
          let queryStatus = result[0][0];
          if(queryStatus['EL EXAMEN SEGMENTARIO   HA SIDO CREADO CON EXITO']){
            return resolve({status : 'OK', message :'Examen segmentario creado con exito'});
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
