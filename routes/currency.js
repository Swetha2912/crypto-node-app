const CurrencyModel = require('../models/crypto.model')
const currency = function () {

    async function add(req, res) {
        try {
            if (!req.file) {
                return res.send({http_code: 400, error: "please upload logo of the currency"})
            }
            let rules = {
                name: 'required',
                market_cap: 'required',
                symbol: 'required',
            };

            let validation = new validator(req.body, rules);

            validation.fails(() => {
                return res.send({
                    errors: validation.errors.errors,
                    http_code: 400
                });
            });

            validation.passes(async () => {

                const payload = new CurrencyModel({
                    name: req.body.name,
                    market_cap: req.body.market_cap,
                    symbol: req.body.symbol,
                    logo: 'http://localhost:3000/' + req.file.path,
                });

                payload.save()
                    .then(data => {
                        res.send({http_code: 200, msg: "currency added", data: data})
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the currency."
                    });
                });
            });
        } catch (e) {
            return res.send({
                error: "something went wrong",
                http_code: 500
            });
        }
    }

    async function list(req, res) {
        try {
            let rules = {};

            let validation = new validator(req.body, rules);

            validation.fails(() => {
                return res.send({
                    errors: validation.errors.errors,
                    http_code: 400
                });
            });

            validation.passes(async () => {

                CurrencyModel.find()
                    .then(currencies => {
                        res.send({http_code: 200, msg: "currencies list", data: currencies});
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving currencies."
                    });
                });
            });
        } catch (e) {
            return res.send({
                error: "something went wrong",
                http_code: 500
            });
        }
    }

    return {
        add, list
    }

}


module.exports = currency
