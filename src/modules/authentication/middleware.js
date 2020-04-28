const auth = require('./authentication');

module.exports = {
  verifyToken : (req, res, next)=>{
    console.log(req.path);
    const token = req.headers['authorization'];
    if(req.path=='/eps/sign' || req.path=='/users/sign'){
      return next();
    }
    if(token==undefined){
      res.status(401); //Unauthorized status
      res.send({
        status : 'ERROR',
        message : 'Sin token de autorización'
      });
    } else{
      auth.authRequest(token, req.path).then((resp)=>{
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
