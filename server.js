require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const dbConfig = require('./config/dbConfig')
const dbConnect = require('./database/connection/dbConnect')
const crypto = require('crypto')
const cors = require('cors')
const {Server} = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
const eventEmitter = dbConfig.postgres.eventEmitter
const app = express();

const PORT = process.env.PORT || 5000


const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

const io = new Server(server)

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



dbConnect(dbConfig)


io.on("connection", (socket) => {
    eventEmitter.on("fetchAll", (data)=> {
        console.log(data)
        const id = crypto.randomBytes(20).toString('hex')
        socket.emit("FETCH_ALL", id)
    })



    socket.on("disconnect", ()=> {
        console.log("A user disconnected")
    })
})


app.get("/invoice", (req, res, next) => {
    const invoice = new InvoiceService(dbConfig.postgres.client)
    const services = new ServicesService(dbConfig.postgres.client)
    res.send({inv: invoice, srv: services})
})

app.get("/invoice/fetchAll", async (req, res, next) => {
    const invoiceService = new InvoiceService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
    const invoices = await invoiceService.fetchAll()
    console.log(invoices.length)
    return res.send(invoices)
})

app.post("/invoice/invoiceEntry", (req, res, next) => {
    const items = req.body.itemsPurchased
    const invoiceService = new InvoiceService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
    const services = new ServicesService(dbConfig.postgres.client)
    const invoice = invoiceService.createInvoice(req.body, eventEmitter)
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
    const invoice = new InvoiceService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
    const services = new ServicesService(dbConfig.postgres.client)
    const service = services.createServicesEntry(invoiceNumber, description, qty, pricePerItem, total, invoice.invoiceNumber)
    res.send({invoice, service})
})

app.post("/invoice/submitData", async (req, res, next) => {
    const invoice = new InvoiceService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
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
 
    invoice.createInvoice(invoiceNumber, invoiceDateMonth, day, year, dueIn, dueDate, toName, toProject, amount, status, fromStreet, fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail)
    itemArray.map((item) => {
        services.createServicesEntry(item.description, item.qty, item.pricePerItem, item.total, invoiceNumber)
    })

})

app.get("/invoice/:invoiceNumber", async (req,res,next) => {
    const invoiceNumber = req.params.invoiceNumber
    const invoice = new InvoiceService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
    const services = new ServicesService(dbConfig.postgres.client)
    const targetInvoice = await invoice.loadOneEntry(invoiceNumber)
    const relatedServices = await services.loadRelatedEntries(invoiceNumber)
    
    res.send({invoice: targetInvoice, services: relatedServices})   
})

app.post("/invoice/:invoiceNumber/command", async (req, res, next) => {
    
    
    const invoice = new InvoiceService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
    const services = new ServicesService(dbConfig.postgres.client, dbConfig.postgres.eventEmitter)
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
    
    const status = req.body.status
    const items = req.body.items
    const destroy = req.body.destroy

    
    const shouldDestroy = destroy !== undefined ? destroy.length >= 1 ? true : false : null
    const amount = itemArray !== undefined ? itemArray.map((item) => item.total).reduce((partial_sum, a) => partial_sum + a,0).toFixed(2) : null

   
    

    

    switch (req.body.command) {
        case "PAYMENT_METHOD_UPDATE":
            try {
                const newPaymentStatus = req.body.paymentstatus
                const updatedInvoice = await invoice.updatePaymentStatus(invoiceNumber, newPaymentStatus)
                res.send(updatedInvoice)
                break;

            } catch (error) {
                console.log(error)
                break
            }
            
        case "DELETE_INVOICE_COMMAND":
            try {
                await invoice.deleteInvoice(invoiceNumber)
                await services.deleteAll(invoiceNumber)
                break;

            } catch (error) {
                console.log(error)
                break;
            }
            
        case "UPDATE_FIELDS":

        try {
            await invoice.updateFields(invoiceNumber, invoiceDateMonth, day, year, dueIn, dueDate, toName, toProject, amount,  status, fromStreet,fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail, toName, toProject)
            items.map( async (item, index, arr) => {
                await services.updateFields(item.id, item.description, item.qty, item.pricePerItem, item.total).catch((err) => console.log(err))
                await services.createServicesEntry(item.description, item.qty, item.pricePerItem, item.total, invoiceNumber , item.id).catch((err) => console.log(err))
            })
                if (shouldDestroy) {
                    destroy.map(async(id) => {
                        await services.deleteOne(id)
                    })
                break; 
                }
            break;

        } catch (err) {
            console.log(err)
            break;
        }
            
    }


    
})




