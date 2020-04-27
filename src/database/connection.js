require('dotenv').config({path:'.env'});
const mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  port : process.env.DB_PORT,
  database : process.env.DB_DATABASE
});

connection.connect(function(err){
  if(err){
    console.log('Un error se ha producido al conectar con la base de datos\n');
    throw err;
  } else{
    console.log('Conexión exitosa con la base de datos');
  }
});

module.exports = connection;
