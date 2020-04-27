require('dotenv').config({path:'.env'});

let services = require('./services');

services.createUser(99992219, "Juan Camilo Pechene", "1998-01-26", "casado",
  31160232, "masculino").then((response)=>{
    console.log(response);
  }).catch((err)=>{
    console.log(err);
  });

services.closeConnection();
