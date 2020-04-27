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
            console.log('Transacción exitosa');
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
  closeConnection : function(){
    return connection.end();
  }
}
