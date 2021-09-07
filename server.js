const express = require('express')
const bodyParser = require('body-parser')
const dbConfig = require('./config/dbConfig')
const dbConnect = require('./database/connection/dbConnect')
const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//service imports
const InvoiceService = require('./database/service/InvoiceService');
const ServicesService = require('./database/service/ServicesService')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

dbConnect(dbConfig)

app.get("/invoice", (req, res, next) => {
    console.log("reqest with postman")
    const invoice = new InvoiceService(dbConfig.postgres.client)
    const services = new ServicesService(dbConfig.postgres.client)
    res.send({inv: invoice, srv: services})
})

app.get("/invoice/fetchAll", async (req, res, next) => {
    const invoiceService = new InvoiceService(dbConfig.postgres.client)
    const invoices = await invoiceService.fetchAll()
    res.send(invoices)
})

app.post("/invoice/invoiceEntry", (req, res, next) => {
    const items = req.body.itemsPurchased
    const invoiceService = new InvoiceService(dbConfig.postgres.client)
    const services = new ServicesService(dbConfig.postgres.client)
    const invoice = invoiceService.createInvoice(req.body)
    console.log(items[0])
    for(let i = 0 ; i < items.length ; i ++ )  {
        services.createServicesEntry(items[i].description, items[i].qty, items[i].pricePerItem, items[i].total, req.body.invoiceNumber)
        
    }
    res.send("done")
})

app.post("/invoice/servicesEntry", (req, res, next)=> {
    const invoiceNumber = req.body.invoiceNumber;
    const description = req.body.description;
    const qty = req.body.qty
    const pricePerItem = req.body.pricePerItem
    const total = req.body.total
    const invoice = new InvoiceService(dbConfig.postgres.client)
    const services = new ServicesService(dbConfig.postgres.client)
    const service = services.createServicesEntry(invoiceNumber, description, qty, pricePerItem, total, invoice.invoiceNumber)
    res.send({invoice, service})
})



