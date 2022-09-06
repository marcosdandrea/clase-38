const { sendNewOrderNotification } = require("./notificationService")

async function newOrder(order, userData) {
    return new Promise((resolve, reject) => {
        sendNewOrderNotification(order, userData)
        resolve()
    })

}

module.exports = { newOrder }