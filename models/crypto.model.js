const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let CryptoSchema = Schema({
        name: {
            type: String
        },
        market_cap: {
            type: Number
        },
        symbol: {
            type: String
        },
        logo: {
            type: String
        },
    },
    {
        strict: false,
        timestamps: {
            createdAt: '_created',
            updatedAt: '_updated'
        },
        collection: 'crypto_currencies',
    })

module.exports = mongoose.model('crypto_currencies', CryptoSchema);