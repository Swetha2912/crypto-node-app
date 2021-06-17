const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TokenSchema = new Schema({
        client_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        is_active: {
            type: Boolean,
            required: true
        },
    },
    {
        strict: false,
        timestamps: {
            createdAt: '_created',
            updatedAt: '_updated'
        },
        collection: 'token',
    })

module.exports = mongoose.model('token', TokenSchema);
