require("dotenv").config();
var express = require('express');
var router = express.Router();
var https = require("https");
var dataSchema = require('../model/exchange.model');
var LIVE_RATES = "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=100&tsym=USD";
var runDuration = 10000;//10000ms

/* get user exchanged & live currency data. */
router.post('/exchangedData', (req, res) => {
    dataSchema.find({}, function (err, data) {
        if (err) {
            console.log(err)
            res.send({ msg: err, code: 1 })
            return;
        } else {
            res.status(200).send({ msg: "Data retrived", status: 200, data: data })
        }
    });
})

/* get live currency data every 10000ms and update the rates in database*/
let counter = 0
setInterval(() => {
    https.get(LIVE_RATES, res => {
        let body = '';

        res.on("data", data => {
            body += data;
        })
        res.on("end", () => {
            body = JSON.parse(body);
            console.log(body)

            console.log('Records received')
            console.log("Total Data received: ", body.Data.length)
            // Check if the data received has some values if not then don't update/insert value
            if (body && body.Data && body.Data.length > 0) {
                for (var i = 0; i < body.Data.length; i++) {
                    dataSchema.updateOne(
                        {
                            crypto: body.Data[i].CoinInfo.Name,
                            status: 'Live'
                        }, {
                        $set: {
                            crypto: body.Data[i]?.CoinInfo?.Name,
                            cryptoSymbol: body.Data[i]?.CoinInfo?.ImageUrl,
                            quantity: 1,
                            currency: 'USD',
                            currencySymbol: "",
                            amount: body.Data[i]?.DISPLAY?.USD?.PRICE,
                            status: 'Live',
                            dateTime: body.Data[i]?.RAW?.USD?.LASTUPDATE,
                            price: body.Data[i]?.RAW?.USD?.PRICE
                        },
                    }, { upsert: true, new: true }, function (err, c) {
                        // In case the controller not found   
                        if (err) {
                            console.log(err)
                            flag = true;
                            res.status(200).send({ msg: "Failed to update", status: 403 })
                        }
                    })
                }
                console.log(counter++, 'Records inserteerd')
            }
        })
    })
}, runDuration);

/* store currency exchanged data. */
router.post('/storeCurrencyData', (req, res) => {
    dataSchema.find({}, async function (err, data) {
        if (err) {
            console.log(err)
            res.send({ msg: err, code: 1 })
            return;
        } else {
            const dataInfo = new dataSchema({
                crypto: req.body.crypto,
                cryptoSymbol: req.body.cryptoSymbol,
                quantity: req.body.quantity,
                currency: req.body.currency,
                currencySymbol: req.body.currencySymbol,
                amount: req.body.amount,
                status: 'Exchanged'
            });
            dataInfo.save().then(() => res.status(200).send({ msg: "Success", status: 200, data: dataInfo }), (err) => {
                res.status(200).send({ msg: "Failed", status: 403 })
                console.log(err)
            });
        }
    });
})

module.exports = router;
