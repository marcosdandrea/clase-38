  
const express = require("express");
const http = require("http")
const cluster = require("cluster")
const numCPUs = require("os").cpus().length
const argv = require('minimist')(process.argv.slice(2));
const PORT = process.env.PORT || 8080;
const processMode = argv.mode || "fork"
const Logger = require("./scripts/Logger")
require("dotenv").config()
const compression = require("compression")

const logger = new Logger()

if (cluster.isPrimary && String(processMode).toLocaleLowerCase() =="cluster"){

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()        
    }

}else{

const session = require("express-session")
const MongoStore = require('connect-mongo')
const path = require('path');
const app = express();
const server = http.createServer(app)

const db = require('./database/database');
const UsersAPI = require("./API/usersAPI");
const PanelAPI = require("./API/panelAPI")
const MessagesAPI = require("./API/MessagesAPI")
const ProductsAPI = require("./API/ProductsAPI")
const OrdersAPI = require("./API/OrdersAPI");
const passport = require("passport");
const Clase28API = require("./API/Clase28API");

if (process.env.GZIP=="true") {app.use(compression()); console.log ("> Compresion habilitada")}

app.use(logger.logRequest)

app.use("/", express.static(path.join(__dirname, '/public')))

const mongoUrl = process.env.MONGO_URL;
const advancedOptions = { useNewUrlParse: true, useUnifiedTopology: true }
app.use(session(    {
    store: MongoStore.create({ mongoUrl, advancedOptions }),
    secret: "marcos123",
    resave: true,
    rolling: true,
    cookie: { maxAge: parseInt(process.env.SESION_DURATION) },
    saveUninitialized: true,
}))

app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

app.use((error, req, res, next) => {
    logger.logWarn(req)
    res.status(500).send(error.message)
})
    
new ProductsAPI(app)
new UsersAPI(app)
new PanelAPI(app)
new MessagesAPI(server)
//new Clase28API(app)
new OrdersAPI(app)

app.use((req, res, next) => {
    logger.logWarn(req)
})

db.connect()
    .then(()=>{
        server.listen(PORT, () => {
            console.log(`pid ${process.pid}> Servidor escuchando en puerto ${PORT}`);
        });
    })
}