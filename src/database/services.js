var connection = require('./connection');

module.exports = {
  createUser : function(DNI, nombre, fechaNacimiento, estadoCivil, telefono, sexo){
    //Tenemos que retornar una promesa, porque el acceso a la base de datos
    //Es asincrono
    return new Promise((resolve, reject)=>{
      let queryString = "call insertPaciente(?, ?, ?, ?, ?, ?, ?)";
      let query = connection.query(queryString, [DNI, nombre, fechaNacimiento, estadoCivil, telefono, sexo, 'TOKEN'], function(err, result){
          if(err){
            console.log('Error mientras se guardaba un nuevo usuario');
            //Cuando ha ocurrido un error, lo 'lanzamos'
            //Y la tarea asincrona termine
            reject(err);
          } else{
            let response = result[0][0];
            if(response['EL PACIENTE YA EXISTE']==undefined){
              response = {
                status : 'APPROVED',
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
          console.log();
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
            let queryString = "call insertHC(?, ?, ?, ?, ?)";
            let query = connection.query(queryString, [DNI, idEntidad, idAntecedente,
              idFisiologica, ID], (err, result)=>{
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
    }
  ,
  closeConnection : function(){
    return connection.end();
  }
}
