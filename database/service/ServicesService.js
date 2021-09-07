const Models = require('../models/index.js')

class ServicesService {
    constructor(sequelize) {
        Models(sequelize) 
        this.client = sequelize.client,
        this.models = sequelize.models  
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

    // async loadAllEntries()
    // async loadOneEntry()
    // async updateEntry()
    // async deleteEntry()
}

module.exports=ServicesService