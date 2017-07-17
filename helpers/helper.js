var moment = require("moment");

var helperObj = {};

helperObj.checkUserError = function(err) {
  if(err.message === "A user with the given username is already registered") {
    return err.message;
  } else {
    return err.errors.email.message;
  }
};

helperObj.buildRequest = function(data) {
  var request = [];
  var ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json";
  var ticketmasterQueries = {
    apikey: process.env.TICKETMASTER_KEY,
    sort: "date,asc",
    source: "ticketmaster",
    startDateTime: data.startDate + "T12:00:00Z",
    endDateTime: data.endDate + "T23:59:59Z",
    city: data.destination
  };
  if(data.activities.indexOf('music') != -1) {
    var musicQueries = ticketmasterQueries;
    musicQueries['classificationName'] = "music";
    request.push({
      url: ticketmasterURL,
      qs: musicQueries
    }); 
  }
  if(data.activities.indexOf('sports') != -1) {
    var sportsQueries = ticketmasterQueries;
    sportsQueries['classificationName'] = "sports";
    request.push({
      url: ticketmasterURL,
      qs: sportsQueries
    }); 
  }
  if(data.activities.indexOf('arts') != -1) {
    var artsQueries = ticketmasterQueries;
    artsQueries['classificationName'] = "theater";
    request.push({
      url: ticketmasterURL,
      qs: artsQueries
    }); 
  }
  if(data.activities.indexOf('restaurants') != -1) {
    request.push({
      url: "",
      qs: {

      }
    }); 
  }
  return request;
};

//create events from ticketmaster api
helperObj.createTMEvents = function(events, eventType) {
  var results = new Object();
  results[eventType] = [];
  
  events.forEach(function(event) {
    var date = moment(new Date(event["dates"]["start"]["localDate"])).format('MMMM Do YYYY'); 
    var name = event["name"];
    var url = event["url"];
    var image_url = event["images"][0]["url"];
    var venue = event["_embedded"]["venues"][0]["name"];
    var data = {date: date, name: name, url: url, image_url: image_url, venue: venue};
    results[eventType].push(data);
  });     
  return results;
};

helperObj.buildResult = function(response, activities, location) {
  var results = {};
  var usedChoices =[];
  var This = this;
  var events;
  response.forEach(function(result) {
    if(activities.indexOf('music') != -1 && usedChoices.indexOf("music") === -1) {
      usedChoices.push("music");
      // if music events exist for this request
      if(result["_embedded"]) {
        events = result["_embedded"]["events"];
        Object.assign(results, This.createTMEvents(events, "music"));
      }
    }
    else if(activities.indexOf('sports') != -1 && usedChoices.indexOf("sports") === -1) {
      usedChoices.push("sports");
      // if sports events exist for this request
      if(result["_embedded"]) {
        events = result["_embedded"]["events"];
        Object.assign(results, This.createTMEvents(events, "sports"));
      }
    }
    else if(activities.indexOf('arts') != -1 && usedChoices.indexOf("arts") === -1) {
      usedChoices.push("arts");
      // if arts&theater events exist for this request
      if(result["_embedded"]) {
        events = result["_embedded"]["events"];
        Object.assign(results, This.createTMEvents(events, "arts"));
      }
    }
    else if(activities.indexOf('restaurants') != -1 && usedChoices.indexOf("restaurants") === -1) {
      usedChoices.push("restaurants");
    }        
  });
  return Object.assign({}, results);
};

module.exports = helperObj;