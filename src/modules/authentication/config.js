module.exports={
  masterKey : 'JSONWEBTOKENMasterKey.',
  epsEP : ['/eps/index:GET',
    '/eps/createUser:POST',
    '/eps/getPaciente:POST'],
  userEP : ['/users/index:GET'],
  exceptions : ['/eps/sign:POST', '/users/sign:POST']
}
