module.exports={
  masterKey : 'JSONWEBTOKENMasterKey.',
  epsEP : ['/eps/index:GET',
    '/eps/createUser:POST',
    '/eps/getPaciente:POST',
    '/eps/createHC:POST',
    '/eps/update/fisiologica:POST',
    '/eps/update/antecedentes:POST',
    '/eps/getHC:POST',
    '/eps/getMedicos:POST',
    '/eps/createMedico:POST',
    '/eps/getTratamientos:POST',
    '/eps/createTratamiento:POST',
    '/eps/addTratamientoxdiagnostico:POST',
    '/eps/createDiagnostico:POST',
    '/eps/createTipoExamen:POST',
    '/eps/getTipoExamenes:POST',
    '/eps/createExamen:POST',
    '/eps/getMedicamentos:POST',
    '/eps/createMedicamento:POST',
    '/eps/addMedicamentoxTratamiento:POST',
    '/eps/getCitaMedica:POST',
    '/eps/createCita:POST',
    '/eps/getCitas:POST'
    ],
  userEP : ['/users/index:GET', '/users/getPaciente:POST', '/users/getHC:POST','/users/getCitaMedica','/users/getCitas'],
  exceptions : ['/eps/sign:POST', '/users/sign:POST']
}
