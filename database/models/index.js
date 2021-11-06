const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Invoice = sequelize.define('Invoice', {
        invoiceNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            duplicates: false,
        },
        invoiceDateMonth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        invoiceDateDay:  {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        invoiceDateYear: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        dueIn: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        dueDate: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        recipient: {
            type: DataTypes.STRING,
            allowNull: false
        },
        overallProject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fromStreet: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        fromCity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fromZip: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fromCountry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        toStreet: {
            type: DataTypes.STRING,
            allowNull: false
        },
        toCity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        toZip: {
            type: DataTypes.STRING,
            allowNull: false
        },
        toCountry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        toEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },    
    })

    const Services = sequelize.define('Services', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pricePerItem: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        InvoiceInvoiceNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            set() {
                const qty = this.getDataValue("qty")
                const price = this.getDataValue("pricePerItem")
                this.setDataValue("total", qty*price)
            }
            
        }
    })

    Invoice.hasMany(Services)
    Services.belongsTo(Invoice)

    sequelize.sync()
}