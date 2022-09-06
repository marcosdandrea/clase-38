const { createTransport } = require("nodemailer")

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kian.wintheiser@ethereal.email',
        pass: '6Dr14uYSnCZ7AM2Pup'
    }
});

module.exports = class SendMail {
    constructor(){

    }

    async sendMail(mailOptions){
        try{
            const info = await transporter.sendMail(mailOptions)
            console.log (info)
        }catch(error){
            console.log (error)
        }
    }
}