const Models = require('../models')

class InvoiceService {
    constructor(sequelize) {
        Models(sequelize)
        this.client = sequelize.client,
        this.models = sequelize.models
    }
    
    async createInvoice(invoiceNumber, invoiceDateMonth, invoiceDateDay, invoiceDateYear, dueIn, dueDate, recipient, overallProject, amount,  status, fromStreet,fromCity, fromZip,fromCountry,toStreet, toCity,toZip,toCountry,toEmail, ServiceId) {
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
                ServiceId,
            });
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
            const invoice = await this.models.Invoice.update({where: {invoiceNumber: invoiceNumber}})
            return invoice
        } catch (error) {
            return error
        }
    }

    async updatePaymentStatus (invoiceNumber, status) {
        try {
            const invoice = await this.models.Invoice.update( {status: status}, {where: {invoiceNumber: invoiceNumber}})
            
        } catch (error) {
            return error
        }
    }

    // async loadOneEntry()
    // async updateEntry()
    // async deleteEntry()

}

module.exports=InvoiceService