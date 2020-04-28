# HCE-Core
Backend of HCE-Core project. NodeJS code

Tienen que tener instalado NodeJS y npm o yarn, el que más les guste.

#### 1) Clonar el repositorio y dirigirse en la terminal hasta tal directorio.
#### 2) Entran en la carpeta src desde dicha terminal y escriben "npm install" y esperan que instale las dependencias-
#### 3) Ahora escriben "node server.js" ó "node server" y ya habran arrancado el servidor.

(Optional, en vez de usar "node server.js" instalen nodemon (npm install -d nodemon) y así arrancan el servidor "nodemon server.js".
La ventaja es que no tienen que reiniciar el servidor cada que hagan un cambio, con nodemon cada que guarden un archivo se reinicia automaticamente el servidor)

# Consumo de las API
## EPS
Las EPS que estén registradas deben tener su nombre de usuario y una contraseña
que se les da de forma 'manual' por parte de HCE-Core
### Lista de servicios:
##### Signature : Este servicio sirve para obtener los tokens que deben incluir en el encabezado de los demás requests
Nota: los tokens expiran y tienen una duración de 2 horas. al expirar se debe repetir este proceso.
###### Request Model:
URL = http://ip-server:5000/eps/sign

METHOD = POST

HEADERS = {'Content-Type' : 'application/json'}

BODY(JSON) = {"id":"nombreUsuarioEPS", "password":"passwordDeLaEPS"}
###### Response Model (SUCCESS):
STATUS = 200 (OK en HTTP)

BODY(JSON) = {"status":"OK", "message":"Successful signing", "token":"tokenGenerado"}
###### Response Model (FAILED):
STATUS = 401 (UNAUTHORIZED en HTTP)

BODY(JSON) = {"status":"DECLINED", "message":"Invalid identification values"}
##### Crear un nuevo usuario (Paciente): Crea un nuevo sujeto que va a tener historia clinica
NOTA: Primero deben haber obtenido el token con el servicio de Signature
###### Request Model:
URL = http://ip-server:5000/eps/createUser

METHOD = POST

HEADERS = {'Content-Type' : 'application/json', 'Authorization' : token}

BODY(JSON) = {"DNI": int, "nombre":string, "fechaNacimiento":string("YYYY-mm-dd"), "estadoCivil":int(1="soltero", 2="casado"), "telefono":int, "sexo":int(1="masculino", 2="femenino", 3="otro")}
###### Response Model (SUCCESS):
STATUS = 200

BODY(JSON) = {"status" : "APPROVED", "message" : "¡Paciente creado con exito!" }
###### Response Model (USER EXISTS):
STATUS = 200

BODY(JSON) = {"status" : "DECLINED", "message" : "Lo sentimos, ese paciente ya figura en la base de datos"}
###### Response Model (BAD_REQUEST): Cuando los datos del body del request son erroneos
STATUS = 500

BODY(JSON) = {"status" : "ERROR", "message" : "Ha ocurrido un error en el servidor, intente de nuevo"}
