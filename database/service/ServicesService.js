const Models = require('../models/index.js')

class ServicesService {
    constructor(sequelize, eventEmitter) {
        Models(sequelize) 
        this.client = sequelize.client,
        this.models = sequelize.models,
        this.eventEmitter = eventEmitter
    }

    async createServicesEntry(description, qty, pricePerItem, total, InvoiceInvoiceNumber) {
        try {
            const services = this.models.Services.create({
                description, 
                qty, 
                pricePerItem, 
                total,
                InvoiceInvoiceNumber 
            })
            return services
        } catch(error) {
            console.log(error)
            return error
        }  
    }

    async loadRelatedEntries(invoiceNumber) {
        try {
            const relatedEntries = await this.models.Services.findAll({where: {InvoiceInvoiceNumber: invoiceNumber}})
            return relatedEntries
        }catch (error) {
            return error
        }
    }

    async deleteAll(invoiceNumber) {
        try {
            const entries = await this.models.Services.destroy({where:{InvoiceInvoiceNumber: null}})
            this.eventEmitter.emit("fetchAll")
        } catch (err) {
            return err
        }
    }

    async updateFields(id, description, qty, pricePerItem, total) {
        try {
            await this.models.Services.update({
                description: description,
                qty: qty,
                pricePerItem: pricePerItem,
                total: total,  
            }, {where: {
                id: id,
            }})
            this.eventEmitter.emit("fetchAll")
        } catch (err) {
            console.log(err)
        }
    }

    // async loadAllEntries()
    // async loadOneEntry()
    // async updateEntry()
    // async deleteEntry()
}

module.exports=ServicesService