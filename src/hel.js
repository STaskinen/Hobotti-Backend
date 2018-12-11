const request = require('request');

// The eventSnipper() function takes in data and a origin as an int and morphs
// the data into a more simplified model, taking only what will be needed
// by the client app.

const eventSnipper = (data, origin) => {
    const fetchDate = new Date();
    let snipData = {
        events: []
    }
    data.body.data.forEach(event => {
        function helcallback() {
            snipData.events.push(snipEvent);
        }
        let snipEvent = {};
        let imagesFound = 0;
        snipEvent.id = event.id;
        if (origin == 1) {
            snipEvent.event_type = {
                sv: "Evenemang",
                en: "Event",
                fi: "Tapahtuma"
            }
        } else if (origin == 2) {
            snipEvent.event_type = {
                sv: "Kurs",
                en: "Course",
                fi: "Kurssi"
            }
        }
        snipEvent.name = event.name;
        if (snipEvent.name.fi) {
            snipEvent.name.fi = snipEvent.name.fi;
        }
        if (snipEvent.name.en) {
            snipEvent.name.en = snipEvent.name.en;
        }
        if (snipEvent.name.sv) {
            snipEvent.name.sv = snipEvent.name.sv;
        }
        snipEvent.provider = event.provider;
        snipEvent.s_desc = event.short_description;
        snipEvent.desc = event.description;
        snipEvent.info = event.info_url;
        snipEvent.age_min = event.audience_min_age;
        snipEvent.age_max = event.audience_max_age;
        snipEvent.start_time = event.start_time;
        snipEvent.end_time = event.end_time;
        if (event.offers.length == 1) {
            if (event.offers[0].is_free === true) {
                snipEvent.price = {
                    sv: "Gratis",
                    en: "Free",
                    fi: "Ilmainen"
                }
            } else {
                snipEvent.price = {
                    sv: "Betala",
                    en: "Paid",
                    fi: "Maksullinen"
                }
            }
        } else if (event.offers.length > 1) {
            snipEvent.price = {
                sv: "Betala, flera",
                en: "Paid, various",
                fi: "Maksullinen, useita"
            }
        } else {
            snipEvent.price = {
                sv: "Inte givit",
                en: "Not given",
                fi: "Ei ilmoitettu"
            }
        }

        snipEvent.images = [];
        event.images.forEach(img => {
            imagesFound++;
            snipEvent.images.push({
                name: img.name,
                url: img.url,
                photographer: img.photographer_name,
                source: img.data_source,
                license: img.license,
                cropping: img.cropping
            })
        })
        if (new Date(snipEvent.start_time) > fetchDate) {

        helcallback();
        }


    });
    return snipData;
}

// Sends a request to the City of Helsinki Linked Events API to find events for
// the provided keyword/searchterm starting from the moment of creation of
// the request.
module.exports.LESearch = function (keyword, page, callback) {
    const jsdate = new Date();
    const ISOdate = jsdate.toISOString();
    /* 
    let future = new Date();
    future.setDate(future.getDate() + 365);
    const ISOfuture = future.toISOString();
    */
    request('https://api.hel.fi/linkedevents/v1/search/?type=event&page_size=30&page=' + page + '&q=' + keyword + '&start=' + ISOdate, {
        json: true
    }, callback)
}
// Sends a request to the City of Helsinki Linked Courses API to find events for
// the provided keyword/searchterm starting from the moment of creation of
// the request.
module.exports.LCSearch = function (keyword, page, callback) {
    const jsdate = new Date();
    const ISOdate = jsdate.toISOString();
    /* 
    let future = new Date();
    future.setDate(future.getDate() + 365);
    const ISOfuture = future.toISOString();
    */
    request('https://linkedcourses-api.test.hel.ninja/linkedcourses-test/v1/event/?type=course&page_size=30&page=' + page + '&q=' + keyword + '&start=' + ISOdate, {
        json: true
    }, callback)
}

// The DataSnip Function below takes in the data the server recieves from the
// City of Helsinki's Linked Events and Linked Courses APIs, tries to conform
// them to one data model with the help of the eventSnipper() function to
// make it easier for future data source additions. 
module.exports.DataSnip = function (LEdata, LCdata, callback) {
    try {

        let snippedData = {
            originCount: 0,
            count: 0,
            fetchDate: new Date()
        };
        /* 
console.log(LEdata.body);
console.log(LCdata.body) */

        snippedData.originCount = LEdata.body.meta.count + LCdata.body.meta.count;
        const LEsnip = eventSnipper(LEdata, 1);
        //console.log(LEsnip);
        const LCsnip = eventSnipper(LCdata, 2);
        //console.log(LEsnip);

        snippedData.events = LEsnip.events.concat(LCsnip.events);
        snippedData.count = snippedData.events.length;

        snippedData.events.sort((a,b) => {
            const keyA = new Date(a.start_time);
            const keyB = new Date(b.start_time);
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        })

        //console.log(snipData.count)
        //console.log(snipData.events.length)

        callback(snippedData)
    } catch (err) {
        console.log(new Date + ' || ' + err)
        return err;
    }
}