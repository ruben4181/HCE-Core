require('dotenv').config({path:'.env'});
const mysql = require('mysql');

var connection;

function handleDisconnect(){
  connection = mysql.createConnection({
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

  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {
      console.log('Hubo un error desconocido');                                      // connnection idle timeout (the wait_timeout
      handleDisconnect();
      //throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
setTimeout(()=>{console.log("Loading server");}, 5000);
module.exports = connection;
