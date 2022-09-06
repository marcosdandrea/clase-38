const passport = require("passport")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy;
const UserDatabase = require("../database/ORM/UsersMongoDB")
const Logger = require("../scripts/Logger")

const userDatabase = new UserDatabase()
const logger = new Logger() 

passport.use("registration", new LocalStrategy(
    {passReqToCallback : true},
    async (req, username, password, callback) => {
    try {
        const existentUser = await userDatabase.getUsername(username)
        if (existentUser){
            logger.logError("Ya existe el usuario")
            return callback(new Error("Ya existe el usuario"))     
        }
        const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const { file } = req;

        const birthday = (req.body.birthday).split("/")
        const birthdayFormatted = birthday[1]+"/"+birthday[0]+"/"+birthday[2]

        console.log (req.body.telephone)
        console.log (req.body.address)

        const newUser = {
            fullname: req.body.fullname, 
            username, 
            password: hashedPass, 
            birthday: birthdayFormatted,
            address: req.body.address,
            telephone: req.body.telephone,
            alias: req.body.alias,
            profilePic: file.filename,
            level: "user",
         }
         
        await userDatabase.save(newUser)
        callback(null, newUser)
    } catch (err) {
        logger.logError(err)
        callback(new Error(err))
    }
}));

passport.use("login", new LocalStrategy(
    {passReqToCallback : true},
    async (req, username, password, callback) => {
    try {
        const existentUser = await userDatabase.getUsername(username)
        if (!existentUser ||!bcrypt.compareSync(password, existentUser.password))
            return callback(new Error ("Usuario o contraseña incorrectos"))    
        callback(null, existentUser)
    } catch (err) {
        logger.logError(err)
        callback(new Error(err))
    }
}));

passport.serializeUser((user, callback) => {
    callback(null, user.username)
})

passport.deserializeUser(async (username, callback) => {
    try {
        const existentUser = await userDatabase.getUsername(username)
        callback(null, existentUser)
    } catch (err) {
        logger.logError(err)
        callback(new Error(err))
    }
})

module.exports = passport;