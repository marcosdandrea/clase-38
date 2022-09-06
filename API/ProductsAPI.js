const multer = require("multer");
const Logger = require("../scripts/Logger")
const { getAllProducts, saveNewProduct } = require("../services/productsServices")

const logger = new Logger

const storage = multer.diskStorage({
    destination: "public/images/products",
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })

module.exports = class ProductsAPI {

    constructor(app) {
        this.app = app;

        this.app.get('/products', checkAuthorized, async (req, res, next) => {
            res.send(await getAllProducts())
        })

        this.app.post("/products", checkAuthorized, uploader.single("image"), (req, res) => {

            saveNewProduct(req)
                .then(id => {
                    res.status(200).send(JSON.stringify(id))
                })
                .catch((err) => {
                    logger.logError("error", err)
                    res.status(501).send(JSON.stringify({ error: 'producto no agregado' }))
                })
        })

        function checkAuthorized(req, res, next) {
            if (req.user?.level == "admin" || req.user?.level == "user") {
                console.log(">> usuario autorizado")
                next()
            } else {
                logger.logWarn("error", "Acceso no autorizado")
                res.status(401)
                res.send("Acceso denegado")
            }
        }

    }
}