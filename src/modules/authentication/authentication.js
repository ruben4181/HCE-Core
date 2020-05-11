const jwt = require('jsonwebtoken');
const config = require('./config.js');
const dbServices = require("../../database/services");

const JWT_EXPIRATION_TIME = 7200

validateEPS = function(id, password){
  return new Promise((resolve, reject)=>{
    dbServices.getEntidadByID(id).then((resp)=>{
      if(resp.token==password){
        return resolve(true);
      }
      return resolve(false);
    }).catch((err)=>{
      resolve(false);
    });
  });
}

validateUser = function(id, password){
  return new Promise((resolve, reject)=>{
    dbServices.getPacienteByDNI(id).then((resp)=>{
      
      if(resp.data){
        if(resp.data.Token==password){
          return resolve(true)
        }
        return resolve(false);
      }
    }).catch((err)=>{
      return resolve(false);
    })
  });

}

checkEP = function(){
  dbServices.getEntidadByID(1).then((resp)=>{
    console.log("Resultado: ");
    console.log(resp);
  }).catch((err)=>{
    console.log("Error: ");
    console.log(err);
  });
}

checkEP();

checkEPAccess = function(entityType, endpoint, user, id){
  if(entityType=='EPS' && user==id){
    if(config.epsEP.indexOf(endpoint) > -1){
      return true;
    }
  }
  if(entityType=='USER' && user.toString()==id.toString()){
    if(config.userEP.indexOf(endpoint) > -1){
      return true;
    }
  }
  return false;
}
module.exports = {
  signRequest : function(entityType, id, password){
    var response = {status : 'DECLINED', message : 'Invalid identification values'};
    return new Promise((resolve, reject)=>{
      if(entityType=='EPS'){
        validateEPS(id, password).then((resp)=>{
          if(resp){
            const payload = { entityType : 'EPS', check : true, id : Number(id)};
            const token = jwt.sign(payload, config.masterKey,{
              expiresIn : JWT_EXPIRATION_TIME
            });
            response = {
              status : 'OK',
              message : 'Successful signing',
              token : token
            }
            resolve(response);
          } else{
            reject(response);
          }
        });
      }
      else if(entityType=='USER'){
        validateUser(id, password).then((resp)=>{
          if(resp){
            const payload = {
              entityType : 'USER', check : true, id : Number(id)};
            const token = jwt.sign(payload, config.masterKey, {
              expiresIn : JWT_EXPIRATION_TIME
            });
            response = {
              status : 'OK',
              message : 'Successful signin',
              token : token
            }
            resolve(response);
          }else{
            reject(response);
          }
        });
      }
    });
  },
  authRequest : function(token, endpoint, user){
    return new Promise((resolve, reject)=>{
      response = {status : 'DECLINED', message : 'Invalid Token'}
      jwt.verify(token, config.masterKey, (err, decoded)=>{
        if(err){
          response.status='ERROR';
          response.message=err.name;
          reject(response);
        } else{

          if(checkEPAccess(decoded.entityType, endpoint, user, decoded.id)){
            response = {status : 'OK', message : 'Valid authorization', decoded : decoded}
          } else{
            response.message = "Permiso denegado para consumir esa función";
          }
          return resolve(response);
        }
      });
    });
  }
}
