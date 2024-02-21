const pg = require('pg');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger =require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const io = require('socket.io')(server);
const ordersDeliverySocket = require('./sockets/orders_delivery_socket');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});


/*Rutas*/

const users = require('./routes/userRoutes');
const categories = require('./routes/categoryRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/orderRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    encoded:true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port',port);

/*LLAMANDO A LAS RUTAS*/ 
users(app,upload);
categories(app,upload);
products(app,upload);
address(app);
orders(app);

/*
LLAMAR A LOS SOCKETS
*/
ordersDeliverySocket(io);

//
const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:57KPsMaXPNkdJQptwxlM@containers-us-west-113.railway.app:6984/railway'
})

app.get('/ping',async (req,res) =>{
    const result = await pool.query('SELECT NOW()')
    return res.json(result.rows[0])
})

server.listen(port,function(){
    console.log('Aplicacion de NodeJS '+process.pid +' Iniciada...')
});

app.get('/',(req,res)=>{
    res.send('Ruta raiz del backend');
});

app.get('/test',(req,res)=>{
    res.send('Prueba del test');
});

// ERROR Handler
app.use((err,req,res,next) => {
    console.log(err);
    res.status(errr.status || 500).send(err.stack);
})

module.exports = {
    app: app,
    server: server
}

