const EventEmitter = require("events")



const eventEmitter = new EventEmitter()

module.exports = {
    postgres: {
        options: {
            host: process.env.DBHOST,
            port: process.env.DBPORT, //droplet
            database: process.env.DB, //droplet
            username: process.env.DBUSER, //droplet
            password: process.env.DBPASSWORD, //droplet
            dialect: process.env.DBDIALECT,    
        },
        client: null,
        eventEmitter: eventEmitter
    }
}