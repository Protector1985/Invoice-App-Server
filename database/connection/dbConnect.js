const Sequelize = require('sequelize')

function dbConnect(dbConfig) {
    const db = new Sequelize(dbConfig.postgres.options)

    try {
        db.authenticate().then(() => {
            dbConfig.postgres.client = db
        })
        console.log("DATABSE CONNECTED")
    } catch (error) {
        console.log("DATABSE connection ERROR")
    }
}

module.exports = dbConnect;