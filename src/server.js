require('dotenv').config({path:'.env'});
//Serevr.js es el archivo principal que instancia y arranca los demás componentes
//de nuestro proyecto.
//Express es una libreria que sirve para crear servidores http y https
//require es la forma de importar en JS, todo lo que sea de 'exportacion' en else
// Archivo irá a una constante.
const express = require('express');
//Instanciación de un servidor Express que aún no es un servidor http, es solo su
//Configuración
const app = express();
//CORS (Cross Origin Resource sharing) es un tipo de seguridad que requiren
//Los servidores actuales
const cors = require('cors');
//Libreria que nos parsea los body tanto del request como del response en nuestros
//Servicios, asi podemos enviar objetos como body y recibirlos en esa forma
const bodyParser = require('body-parser');
//Libreria para por fin crear un servidor
const http = require('http');
//Creación del servidor con la configuración por defecto de Express
let server = http.createServer(app);
//Empieza la configuración nuestra del servidor que acabamos de crear
app.use(cors({origin:true,credentials:true}));
//De esta forma hace parsing de body x-www-form-url-encode
app.use(bodyParser.urlencoded({ extended: false }));
//Así 'parsea' cuando viene codificado en formato JSON
app.use(bodyParser.json());
const middleware = require('./modules/authentication/middleware');
app.use(middleware.verifyToken);
//La siguiente linea require los endpoints, sus verbos y su logica de otro Archivo
//Esto es para llevar orden, porque todo se podría configurar desde aquí pero no es recomendable
app.use(require('./routes/index.js'));
//Puerto en el que va a escuchar el servidor, debe ser un numero guardado en las
//Variables de entorno o por defecto el 3001
const protectedRoutes = express.Router();



let port = process.env.PORT || 3001;
server.listen(port, ()=>{
  console.log('Servidor iniciado correctamente\nEscuchando en el puerto', port);
});
