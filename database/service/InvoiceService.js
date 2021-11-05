const Models = require('../models')




class InvoiceService {
    constructor(sequelize, eventEmitter) {
        Models(sequelize)
        this.client = sequelize.client,
        this.models = sequelize.models
        this.eventEmitter = eventEmitter
    }
    
    async createInvoice(invoiceNumber, invoiceDateMonth, invoiceDateDay, invoiceDateYear, dueIn, dueDate, recipient, overallProject, amount,  status, fromStreet,fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail, ServiceId, isoDate) {
        try {
            const invoice = await this.models.Invoice.create({
                invoiceNumber, 
                invoiceDateMonth, 
                invoiceDateDay, 
                invoiceDateYear, 
                dueIn, 
                dueDate, 
                recipient, 
                overallProject, 
                amount, 
                status, 
                fromStreet,
                fromCity, 
                fromZip,
                fromCountry,
                toStreet, 
                toCity,
                toZip,
                toCountry,
                toEmail,
                isoDate,
                ServiceId,
            });
            this.eventEmitter.emit("fetchAll", invoice)
            return invoice
        } catch (error) {
            console.log(error)
            return error
        }  
    }
    
    async fetchAll() {

        try {
            const invoices = await this.models.Invoice.findAll()
            return invoices
        } catch (error) {
            return error
        }
        
    }

    async loadOneEntry (invoiceNumber) {
        try {
            const invoice = await this.models.Invoice.findOne({where: {invoiceNumber: invoiceNumber}})
            return invoice
        } catch (error) {
            return error
        }
    }

    async updatePaymentStatus (invoiceNumber, status) {
        try {
            let invoice = await this.models.Invoice.update({status: status}, {where: {invoiceNumber: invoiceNumber}})  
            const inv = await this.models.Invoice.findOne({where:{invoiceNumber: invoiceNumber}})
            if(inv.status === invoice.status) {
                throw new Error("SOMETHING WENT WRONG WHILE UPDATING THE DB")
            } else {
                return inv
            }
           
            
            // return invoice 
        } catch (error) {
            console.log("EEEERRROOOOOR")
            return error
        }
    }
    async deleteInvoice(invoiceNumber) {
        try {
            const invoice = await this.models.Invoice.destroy({where:{invoiceNumber: invoiceNumber}})
            this.eventEmitter.emit("fetchAll")
        } catch(err) {
            return err
        }
    }
    
    async updateFields(invoiceNumber, invoiceDateMonth, invoiceDateDay, invoiceDateYear, dueIn, dueDate, recipient, overallProject, amount,  status, fromStreet,fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail, toName, toProject) {
        try {
            await this.models.Invoice.update({
                invoiceDateMonth: invoiceDateMonth,
                invoiceDateDay: invoiceDateDay,
                invoiceDateYear: invoiceDateYear,
                dueIn: dueIn,
                dueDate: dueDate, 
                recipient: recipient, 
                overallProject: overallProject,
                amount: amount,  
                status: status,
                fromStreet: fromStreet,
                fromCity: fromCity, 
                fromZip: fromZip,
                fromCountry: fromCountry,
                toStreet: toStreet,
                toCity: toCity,
                toZip: toZip,
                toCountry: toCountry,
                toEmail: toEmail,
                toName: toName,
                toProject: toProject,
                toStreet: toStreet,

            }, {where: {invoiceNumber: invoiceNumber}})
                this.eventEmitter.emit("fetchAll")
        } catch (err) {
            console.log(err)
        }
    }
        
}

module.exports=InvoiceService