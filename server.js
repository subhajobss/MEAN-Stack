/* const http = require('http');
const app = require('./backend/app')
// Port has to be set for nodejs(server.listen) and express js(app.set)
const port =  process.env.PORT || 3000;

app.set('port',port);
//const server = http.createServer( (req, res) =>{

    // when express js integrated, following code is not required, 
    //middleware will take care of processing req and sending response
  //  res.end('This is my first MEAN App!!!!!');
//});

const server = http.createServer(app);

//server.listen(9899);

// to set port using envn variable, use process provided by nodejs
// this port is dynamically injected during run  ( time for production )
// If not available use 3000

server.listen(port); */


const http = require('http');
const app = require('./backend/app');
const debug = require('debug')('node-angular');

var normalizePort = val => {
    var port = parseInt(val,10);

    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }

    return false;
}

const onListening = () =>{
    const addr = server.address(); // => { address: '::', family: 'IPv6', port: 3000 }   
    const bind = typeof addr === "string" ? 'pipe ' + addr : 'port ' + port;
   debug("Listening on " + bind);
   console.log("Listening on " + bind);
}

const OnError = error=>{

    const bind = typeof port === 'string' ? 'pipe '+ port : 'port ' + port;

    switch(error.code){
        case 'EACCES':
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case 'EADDRINUSE' :
            console.error(bind + "is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }

}
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.on('error',OnError);
server.on('listening',onListening);
server.listen(port);