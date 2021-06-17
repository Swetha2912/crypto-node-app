const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let ClientSchema = Schema({

        name: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        phone: {
            type: String
        },
        fav_currencies: {
            type: Array
        }
    },
    {
        strict: false,
        timestamps: {
            createdAt: '_created',
            updatedAt: '_updated'
        },
        collection: 'client',
    })

module.exports = mongoose.model('client', ClientSchema);