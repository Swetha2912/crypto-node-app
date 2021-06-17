let express = require("express");
let app = express();
let client = require('./routes/client.js')(app)
let currency = require('./routes/currency.js')(app)
const mongoose = require('mongoose');
validator = require('validatorjs');
const bodyParser = require('body-parser');
const multer = require("multer");
jwt = require('jsonwebtoken');
let JWT_SECRET = "travancode"

const TokenModel = require('./models/token.model')

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
});

upload = multer({storage: storage});

mongoose.connect("mongodb://localhost:27017/tranvancode", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("======================================");
    console.log("DB CONNECTED");
    console.log("======================================");
}).catch(err => console.log(err));

app.post('/client', client.add)
app.post('/login', client.login)

let parseJWT = async function (req, res, next) {
    let token = ''
    if (req.headers['authorization'] !== undefined) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (token === "null") {
        return res.send({
            error: 'please login',
            http_code: 401
        });
    }
    try {
        let user = jwt.verify(token, JWT_SECRET);

        if (!user) {
            return res.send({
                msg: 'not logged in',
                http_code: 401
            });
        } else {
            if (token && token.length > 5) {
                TokenModel.findOne({
                    token,
                    client_id: user._id,
                    is_active: true
                }).then((token) => {
                    if (token) {
                        next()
                    } else {
                        return res.send({msg: 'not logged in', http_code: 401});
                    }

                }).catch((err) => {
                    return res.send({error: err, http_code: 500});
                });

            }
        }
    } catch (err) {
        return res.send({
            error: 'token expired',
            http_code: 401
        });

    }
}
app.use(parseJWT)

app.post('/client/:id/addCurrency', client.addCurrency)
app.get('/client', client.list)
app.post('/currency', upload.single('logo'), currency.add)
app.get('/currency', currency.list)

let server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});
