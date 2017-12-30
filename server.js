require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;
const MeetupAPIkey = process.env.MEETUPKEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

// food terms to search events for
var terms = ['food', 'pizza', 'snack', 'appetizer', 'lunch', 'dinner', 'tacos'];
var foodMap = {};

// creates a map to replace with span containing the class red
terms.forEach(term => (foodMap[term] = `<span class='red'>${term}</span>`))

// takes a string as input and a map object containing the terms to be replaced
// then constructs a regular expression to search for these terms and replace
// with corresponding mapping
function replaceAll(str,mapObj){
  if (!str){
    console.log("There is no string content...");
    return;
  }

  if (!mapObj){
    console.log("There is no map object to replace with...");
    return;
  }

  var regex = new RegExp(Object.keys(mapObj).join("|"),"gi");

  return str.replace(regex, function(matched){
      return mapObj[matched.toLowerCase()];
  });
}


app.get('/', function(req, res) {
    response.sendFile('index.html', {root: './public'});
});

app.get('/search', function(req, res){

  MeetupQuery('10', '47.590218', '-122.334198', terms, function(json){
    if (json) {
      filteredjson = json.map(meetup => ({
        name: meetup.name,
        groupname: meetup.group.name,
        event_url: meetup.event_url,
        name: meetup.name,
        description: replaceAll(meetup.description, foodMap),
        time: meetup.time,
        rsvp: meetup.yes_rsvp_count,
        collectiveNoun: meetup.group.who
      }));
      res.json(filteredjson);
    } else {
      res.json([]);
    }

  });
});

function MeetupQuery (radius, lat, long, terms, callback) {
  const options = {
    //url : `https://api.meetup.com/find/upcoming_events?radius=${radius}&lat=${lat}&lon=${long}&text=${terms}&order=time&page=20000&key=${MeetupAPIkey}&end_date_range=2020-12-30T00:00:00`,
    url : `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=47.590218&lon=-122.334198&text=${terms.join(' ')}&key=${MeetupAPIkey}&page=200`,
    method: 'GET'
  };

  console.log(options.url);

  request(options, function(err, res, body) {
    try {
      let json = JSON.parse(body);
    }
    catch(e) {
      console.log(e);
    }
    
    callback(json.results);
  });
}


app.listen(PORT, function() {
  console.log('We are ready for business and serving on:' + PORT);
});
