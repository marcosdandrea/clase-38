const { fork } = require("child_process")
const forked = fork('./scripts/randomNumbers.js')

module.exports = class Clase28API {

    constructor(app) {
        this.app = app;    

        this.app.get("/info", (req, res) => {
            const data = {
                Arguments: process.argv.splice(2),
                OS: process.platform,
                Node: process.version,
                Memory: process.memoryUsage,
                ExecPath: process.execPath,
                ProcessID: process.pid,
                ProyectFolder: __dirname
            }
            res.send(data)
        })

        this.app.get("/api/randoms", (req, res)=>{
            const amount = req.query.cant || 1e9
            const random = fork("./scripts/randomNumbers.js")
            random.send(amount)
            random.on("message", msg =>{
                res.send(msg)
            })
        })

    }

}