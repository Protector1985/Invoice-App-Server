const express = require('express')
const bodyParser = require('body-parser')
const dbConfig = require('./config/dbConfig')
const dbConnect = require('./database/connection/dbConnect')
const cors = require('cors')
const app = express();
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.use(cors()) //CHANGE THIS LATER!!!!! DON'T ALLOW ALL ORIGINS!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    console.log("FEEEEEEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTCHHHHHHHHHHHHHHHHHHHHHHHHHH CAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLEEEEEEEEEEEEEEEEEEEEDDDDDDDDDDDDDDDDDDDDDDDDD")
    
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

app.post("/invoice/submitData", async (req, res, next) => {
    console.log(req.body)
    const invoice = new InvoiceService(dbConfig.postgres.client)
    const services = new ServicesService(dbConfig.postgres.client)
    const dateTime = new Date(req.body.isoDate)
    const invoiceDateMonth = dateTime.toLocaleString("default", {month: "short"})
    const day = dateTime.getDate()
    const year = dateTime.getFullYear()

    const invoiceNumber = req.body.invoiceNumber;
    const fromStreet= req.body.fromStreet;
    const fromCity= req.body.fromCity;
    const fromZip= req.body.fromZip;
    const fromCountry= req.body.fromCountry;
    const toName= req.body.toName;
    const toEmail= req.body.toEmail;
    const toStreet= req.body.toStreet;
    const toCity= req.body.toCity;
    const toZip= req.body.toZip;
    const toCountry= req.body.toCountry;
    const toProject= req.body.toProject;
    const itemArray= req.body.itemArray;
    const isoDate= req.body.isoDate;
    const dueDate = `${day} ${invoiceDateMonth} ${year}`
    const dueIn= req.body.dueIn
    const amount = itemArray.map((item) => item.total).reduce((partial_sum, a) => partial_sum + a,0).toFixed(2)
    const status = req.body.status
 
    await invoice.createInvoice(invoiceNumber, invoiceDateMonth, day, year, dueIn, dueDate, toName, toProject, amount, status, fromStreet, fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail)
    itemArray.map((item) => {
        services.createServicesEntry(item.description, item.qty, item.pricePerItem, item.total, invoiceNumber)
    })

    // invoiceNumber, invoiceDateMonth, invoiceDateDay, invoiceDateYear, dueIn, dueDate, recipient, overallProject,  status, fromStreet,fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail
})



