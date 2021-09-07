module.exports = {
    postgres: {
        options: {
            host: "localhost",
            port: 5433,
            database: 'invoicedb',
            username: 'postgres',
            password: 'admin',
            dialect: 'postgres',
        },
        client: null
    }
}