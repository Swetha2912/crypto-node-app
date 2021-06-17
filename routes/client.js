const ClientModel = require('../models/client.model')
const TokenModel = require('../models/token.model')
const CurrencyModel = require('../models/crypto.model')

const client = function () {

    async function add(req, res) {
        try {
            let rules = {
                name: 'required',
                phone: 'required',
                email: 'required|email',
                password: 'required',
            };

            let validation = new validator(req.body, rules);

            validation.fails(() => {
                return res.send({
                    errors: validation.errors.errors,
                    http_code: 400
                });
            });

            validation.passes(async () => {

                let name = req.body.name;
                let email = req.body.email;
                let phone = req.body.phone;
                let password = req.body.password;

                const payload = new ClientModel({
                    name: name,
                    email: email,
                    phone: phone,
                    password: password,
                });

                // Save Note in the database
                payload.save()
                    .then(data => {
                        res.send(data);
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the client."
                    });
                });

                res.send({http_code: 200, msg: "client added", data: data})
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

                ClientModel.find()
                    .then(async (clients) => {
                        for (let client of clients) {
                            let currencies = await CurrencyModel.find({_id: {$in: client.fav_currencies}})
                            client['_doc']['fav_currencies'] = currencies
                        }
                        res.send({http_code: 200, msg: "clients list", data: clients});
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving clients."
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

    async function login(req, res) {
        try {
            let rules = {
                email: 'required',
                password: 'required'
            };

            let validation = new validator(req.body, rules);

            validation.fails(() => {
                return res.send({
                    errors: validation.errors.errors,
                    http_code: 400
                });
            });

            validation.passes(async () => {
                ClientModel.findOne({email: req.body.email, password: req.body.password}).select({fav_currencies: 0})
                    .then(client => {
                        let payload = client.toObject();
                        payload.password = undefined;
                        let token = jwt.sign(payload, "travancode", {
                            expiresIn: "2 days"
                        });

                        let tokenObj = new TokenModel({
                            token: token,
                            client_id: client._id,
                            is_active: true
                        });
                        tokenObj.save((err) => {
                            if (err) {
                                return res.send({
                                    error: "cannot save token", http_code: 500
                                });
                            }
                            return res.send({
                                msg: 'login successful',
                                data: {
                                    info: payload,
                                    token: token
                                },
                                http_code: 200
                            });
                        })

                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving clients."
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

    async function addCurrency(req, res) {
        try {
            let client_id = req.params.id

            let rules = {
                fav_currencies: 'required'
            };

            let validation = new validator(req.body, rules);

            validation.fails(() => {
                return res.send({
                    errors: validation.errors.errors,
                    http_code: 400
                });
            });

            validation.passes(async () => {

                ClientModel.findOne({_id: client_id})
                    .then(client => {
                        ClientModel.updateOne({_id: client_id}, {fav_currencies: req.body.fav_currencies})
                            .then(() => {
                                return res.send({http_code: 200, msg: "client fav currencies added"});
                            }).catch(err => {
                            return res.status(500).send({
                                message: err.message || "Some error occurred while adding favourite currency."
                            });
                        });
                    }).catch(err => {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while retrieving client."
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
        add, list, login, addCurrency
    }

}


module.exports = client
