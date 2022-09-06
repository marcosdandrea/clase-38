const ProductsDB = require("../database/ORM/productsMongoDB")
const productsDB = new ProductsDB()

async function getAllProducts(){
    return await productsDB.getAllProducts()
}

async function saveNewProduct(req){
    return new Promise((resolve, reject) =>{
    const { file } = req;

    const title = req.query.title || req.body.title
    const price = parseFloat(req.query.price) || parseFloat(req.body.price)
    const imgDir = "../images/products/"
    const image = imgDir + file.filename
    const newProduct = { title, price, image }

    if ((title == undefined) || (price == undefined) || (image == undefined) || (isNaN(price))) {
        reject({ error: "datos incorrectos" })
        return
    }

    return productsDB.save(newProduct)
    })
}

module.exports = { getAllProducts, saveNewProduct }