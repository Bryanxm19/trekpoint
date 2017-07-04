var moment = require("moment");

var helperObj = {};

helperObj.checkUserError = function(err) {
    if(err.message === "A user with the given username is already registered") {
        return err.message;
    } else {
        return err.errors.email.message;
    }
};

helperObj.buildRequest = function(choices, startDate, endDate, destination) {
    var request = [];
    var ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json";
    var ticketmasterQueries = {
        apikey: process.env.TICKETMASTER_KEY,
        source: "ticketmaster",
        startDateTime: startDate + "T12:00:00Z",
        endDateTime: endDate + "T23:59:59Z",
        city: destination
    };
    if(choices.indexOf('music') != -1) {
        request.push({
            url: ticketmasterURL,
            qs: {
                apikey: ticketmasterQueries.apikey,
                source: ticketmasterQueries.source,
                startDateTime: ticketmasterQueries.startDateTime,
                endDateTime: ticketmasterQueries.endDateTime,
                city: ticketmasterQueries.city,
                keyword: "music"
            }
        }); 
    }
    if(choices.indexOf('sports') != -1) {
        request.push({
            url: ticketmasterURL,
            qs: {
                apikey: ticketmasterQueries.apikey,
                source: ticketmasterQueries.source,
                startDateTime: ticketmasterQueries.startDateTime,
                endDateTime: ticketmasterQueries.endDateTime,
                city: ticketmasterQueries.city,
                keyword: "sports"
            }
        }); 
    }
    if(choices.indexOf('arts') != -1) {
        request.push({
            url: ticketmasterURL,
            qs: {
                apikey: ticketmasterQueries.apikey,
                source: ticketmasterQueries.source,
                startDateTime: ticketmasterQueries.startDateTime,
                endDateTime: ticketmasterQueries.endDateTime,
                city: ticketmasterQueries.city,
                keyword: "theater"
            }
        }); 
    }
    return request;
};

//create events from ticketmaster api
helperObj.createTMEvents = function(events, eventType) {
    var results = [];
    events.forEach(function(event) {
        var date = moment(new Date(event["dates"]["start"]["localDate"])).format('MMMM Do YYYY'); 
        var name = event["name"];
        var url = event["url"];
        var image_url = event["images"][0]["url"];
        var venue = event["_embedded"]["venues"][0]["name"];
        var data = {date: date, name: name, url: url, image_url: image_url, venue: venue, eventType: eventType};
        results.push(data);
    });     
    return results;
};

helperObj.buildResult = function(response, activities) {
    var results = [];
    var usedChoices =[];
    var This = this;
    var events;
    response.forEach(function(result) {
        if(activities.indexOf('music') != -1 && usedChoices.indexOf("music") === -1) {
            usedChoices.push("music");
            // if music events exist for this request
            if(result["_embedded"]) {
                events = result["_embedded"]["events"];
                results.push.apply(results, This.createTMEvents(events, "music"));
            }
        }
        else if(activities.indexOf('sports') != -1 && usedChoices.indexOf("sports") === -1) {
            usedChoices.push("sports");
            // if sports events exist for this request
            if(result["_embedded"]) {
                events = result["_embedded"]["events"];
                results.push.apply(results, This.createTMEvents(events, "sports"));
            }
        }
        else if(activities.indexOf('arts') != -1 && usedChoices.indexOf("arts") === -1) {
            usedChoices.push("arts");
            // if arts&theater events exist for this request
            if(result["_embedded"]) {
                events = result["_embedded"]["events"];
                results.push.apply(results, This.createTMEvents(events, "arts"));
            }
        } 
    });
    return results;
};

module.exports = helperObj;