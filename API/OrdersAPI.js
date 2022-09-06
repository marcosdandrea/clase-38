const cookieParser = require("cookie-parser")
const { newOrder } = require( "../services/ordersServices.js" )

const Logger = require("../scripts/Logger")

require("dotenv").config()

const logger = new Logger()

module.exports = class OrdersAPI {

    constructor(app) {
        this.app = app;
        this.app.use(cookieParser())

        this.app.post("/orders",
            this.checkAuthorized,
            (req, res, next) => {

                const order = req.body[0]
                const userData = req.body[1]

                newOrder( order, userData )
                    .catch((err)=>{
                        res.sendStatus(500)
                    })
                    .then(()=>{
                        res.sendStatus(200)
                    })               
            })

    }

    checkAuthorized(req, res, next) {
        if (req.user?.level == "admin" || req.user?.level == "user") {
            console.log(">> usuario autorizado")
            next()
        } else {
            logger.logWarn ("error", "Acceso no autorizado")
            console.log(">> usuario no autorizado")
            res.status(401)
            res.send("Acceso denegado")
        }
    }
}