const twilio = require("twilio")
const SendMail = require("../scripts/NodeMailer.js")
const accountSid = "ACf1d66d4d7a162851454421b00e2b3a80"
const authToken = "c783258223ebb73868be5f9806d81e56"
const client = twilio(accountSid, authToken)
const notificationMail = new SendMail()

async function sendNewOrderNotification(order, userData) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: "Servidor Backend",
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Nuevo pedido de " + userData.alias + " (" + userData.username + ")",
            html: generateHTMLOrderView(order)
        }

        notificationMail.sendMail(mailOptions)

        sendWsp("+14155238886", "+5491140674938", generatePlainOrderView(order))
        const rand = Math.floor(Math.random() * 548648464)
        sendSms("+" + userData.telephone, "Su pedido número " + rand + " está siendo procesado.")
        resolve()
    })
}

async function sendWsp(from, to, body) {
    await client.messages
        .create({
            body,
            from: 'whatsapp:' + from,
            to: 'whatsapp:' + to
        })
        .catch(err => logger.logWarn(err))
        .done()
}

async function sendSms(to, body) {
    await client.messages
        .create({
            body,  
            messagingServiceSid: 'MGe10cedf244c444041aae542b2c092717',      
            to
        })
        .catch(err => logger.logWarn(err))
        .done()
}

function generateHTMLOrderView(order) {
    let view = "<h3> ++ NEW ORDER ++ </h3>"
    order.forEach(item => {
        view += "<p>=================================</p>"
        view += "<p>ID: " + item.productID + "</p>"
        view += "<p>Name: " + item.productName + "</p>"
        const total = parseInt(item.productAmount) * parseFloat(item.productPrice.slice(1))
        view += "<p>" + item.productAmount + " x (" + item.productPrice + ") $" + total + "</p>"
    })
    view += "<p>===============END===============</p>"
    return view
}

function generatePlainOrderView(order) {
    let view = "++ NEW ORDER ++ \n"
    order.forEach(item => {
        view += "=================================\n"
        view += "ID: " + item.productID + "\n"
        view += "Name: " + item.productName + "\n"
        const total = parseInt(item.productAmount) * parseFloat(item.productPrice.slice(1))
        view += "" + item.productAmount + " x (" + item.productPrice + ") $" + total + "\n"
    })
    view += "===============END===============\n"
    return view
}

module.exports = { sendNewOrderNotification }