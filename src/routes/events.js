const express = require('express');
const events = express.Router();
const HelData = require('../hel.js');

// Access token verification
const verifyToken = require('../auth/VerifyToken.js');

const eventSearch = (res, keyword, page) => {
        // Send a request to Linked Events API for given keyword.
        HelData.LESearch(keyword, page, (err, LEdata) => {
            if (err) {
                res.status(500).send({
                    message: 'Helsinki servers fucked up'
                });
            } else if (LEdata.body.meta == undefined) {
                LEdata.body.meta = {
                    count: 0
                };
                LEdata.body.data = []
            }
                console.log('LEdata ammount: ' + LEdata.body.meta.count)
                //console.log('Hi there x1');
            HelData.LCSearch(keyword, page, (err, LCdata) => {
                //console.log('Hi there x2');
                if (err) {
                    res.status(500).send({
                        message: 'Helsinki servers fucked up'
                    });
                } else if (LCdata.body.meta == undefined) {
                    LCdata.body.meta = {
                        count: 0
                    };
                    LCdata.body.data = []
                }
                    console.log('LCdata ammount: ' + LCdata.body.meta.count)
                    //console.log('Hi there x3');
                    HelData.DataSnip(LEdata, LCdata, (snip) => {
                        //console.log('Hi there x4');
                        if (err) {
                            res.status(500).send({
                                message: "Snipper Malfunction"
                            })
                        } else if (snip.count === 0) {
                            res.status(404).send({
                                message: "No Events found in Linked Events"
                            })
                        } else {
                            res.status(200).send(snip);
                        }
                    })
            })
            //res.status(200).send(finalData);
        })
}
//Gets events
events.get('/:keyword', verifyToken, (req, res, next) => {
    if (req.query.page) {
        eventSearch(res, req.params.keyword, req.query.page)
    } else {
        eventSearch(res, req.params.keyword, 1)
    }
    
})

module.exports = events;

