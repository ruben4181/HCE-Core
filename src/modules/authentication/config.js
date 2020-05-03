module.exports={
  masterKey : 'JSONWEBTOKENMasterKey.',
  epsEP : ['/eps/index:GET',
    '/eps/createUser:POST',
    '/eps/getPaciente:POST',
    '/eps/createHC:POST',
    '/eps/update/fisiologica:POST',
    '/eps/update/antecedentes:POST'],
  userEP : ['/users/index:GET'],
  exceptions : ['/eps/sign:POST', '/users/sign:POST']
}
