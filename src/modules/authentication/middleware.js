const auth = require('./authentication');
const config = require('./config');
module.exports = {
  verifyToken : (req, res, next)=>{
    const token = req.headers['authorization'];
    if(config.exceptions.indexOf(req.path+":"+req.method) > -1){
      return next();
    }
    if(token==undefined){
      res.status(401); //Unauthorized status
      res.send({
        status : 'ERROR',
        message : 'Sin token de autorización'
      });
    } else{
      let id = req.body.DNI;
      if(req.path.substring(0, 5)=='/eps/'){
        id = req.body.idEntidad;
      }
      auth.authRequest(token, req.path+":"+req.method, id).then((resp)=>{
        if(resp.status=='OK'){
          next();
        } else{
          res.status(401);
          res.send(resp);
        }
      }).catch((err)=>{
        res.status(401);
        res.send(err);
      })

    }
  }
}
