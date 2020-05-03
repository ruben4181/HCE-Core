const jwt = require('jsonwebtoken');
const config = require('./config.js');

const JWT_EXPIRATION_TIME = 7200

validateEPS = function(id, password){
  return new Promise((resolve, reject)=>{
    let response = false;
    if(id==1){
      response = true;
    }
    resolve(response);
  })
}

validateUser = function(id, password){
  return new Promise((resolve, reject)=>{
    let response = false;
    if(id=='1061543081'){
      response=true;
    }
    resolve(response);
  })

}

checkEPAccess = function(entityType, endpoint){
  if(entityType=='EPS'){
    if(config.epsEP.indexOf(endpoint) > -1){
      return true;
    }
  }
  if(entityType=='USER'){
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
            const payload = { entityType : 'EPS', check : true, id : id};
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
              entityType : 'USER', check : true, id : id};
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
  authRequest : function(token, endpoint){
    return new Promise((resolve, reject)=>{
      response = {status : 'DECLINED', message : 'Invalid Token'}
      jwt.verify(token, config.masterKey, (err, decoded)=>{
        if(err){
          response.status='ERROR';
          response.message=err.name;
          reject(response);
        } else{
          if(checkEPAccess(decoded.entityType, endpoint)){
            response = {status : 'OK', message : 'Valid authorization', decoded : decoded}
          } else{
            response.message = "Permiso denegado para consumir esa función";
          }
          resolve(response);
        }
      });
    });
  }
}

testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnRpdHlUeXBlIjoiVVNFUiIsImNoZWNrIjp0cnVlLCJpZCI6IjEwNjE1NDMwODEiLCJpYXQiOjE1ODgwMzI2NDgsImV4cCI6MTU4ODAzOTg0OH0.ZSOvt4AP02sCVCm3Devwgqk2oh0xwYdy5Fn8CU1Bytk'
/*module.exports.authRequest(testToken, 'createUser').then((resp)=>{
  console.log(resp);
});
/*module.exports.signRequest('USER', '1061543081', 'PWD').then((resp)=>{
  console.log(resp);
}).catch((err)=>{
  console.log(err);
})
//*/
