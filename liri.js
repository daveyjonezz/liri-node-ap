require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ")
var movieQueryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
var bandQueryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";

function liri() {
    if (command === "movie-this") {
        axios.get(movieQueryUrl).then(
            function (response) {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("Rated: " + response.data.Rated);
                console.log("Rotton Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country Produced: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    } else if (command === "concert-this") {
        axios.get(bandQueryUrl).then(
            function (responseBand) {
                for (i = 0; i < responseBand.data.length; i++) {
                    console.log(responseBand.data[i].venue.name);
                    console.log(responseBand.data[i].venue.city);
                    console.log(moment(responseBand.data[i].datetime).format("L"));
                }
            })
    } else if (command === "spotify-this-song") {
        spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
          console.log(data); 
          });
    }
}

liri();