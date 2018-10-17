const request = require('request');

module.exports.basicSearch = function(keyword, callback) {
const jsdate = new Date();
const ISOdate = jsdate.toISOString();
let future = new Date();
future.setDate(future.getDate() + 365);
const ISOfuture = future.toISOString();
    request('http://api.hel.fi/linkedevents/v1/search/?type=event&q=' + keyword + '&start=' + ISOdate, {json: true}, callback )
}

module.exports.DataSnip = function(rawData, callback) {
    let snipData = {
        count: 0,
        events: []
    };
    snipData.count = rawData.body.meta.count;
    rawData.body.data.forEach(event => {
        function callback() {snipData.events.push(snipEvent);}
        let snipEvent = {};
        let imagesFound = 0;
        snipEvent.id = event.id;
        snipEvent.name = event.name;
        snipEvent.provider = event.provider;
        snipEvent.s_desc = event.short_description;
        snipEvent.desc = event.description;
        snipEvent.info = event.info_url.fi;
        if(event.offers.length == 1){
            if(event.offers[0].is_free === true){
                snipEvent.price = {
                    sv:"gratis",
                    en:"free",
                    fi:"ilmainen"
                }
            }else{
                snipEvent.price = event.offers[0].price
            }
        }
        
        snipEvent.images = [];
        event.images.forEach(img => {
            imagesFound++;
            if (img.license === "cc_by"){
                snipEvent.images.push({
                    name: img.name,
                    url: img.url,
                    photographer: img.photographer_name,
                    source: img.data_source,
                    license: img.license,
                    cropping: img.cropping
                })
            }
            if(imagesFound === event.images.length) {
                callback();
            }
            
    })
        
    });


    callback(snipData)

}