debugger;
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ")
var movieQueryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
var bandQueryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";


function switchCall(){
switch(command) {
    case "movie-this":
      OMDb();
      break;
    case "concert-this":
      Bands();
      break;
    case "spotify-this-song":
      SpotifyCall();
      break;
    case "do-what-it-says":
      Text();
      break;
  }
}

function OMDb(){
    if (!userInput) {
        userInput = "Mr. Nobody"
    }
     movieQueryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
     axios.get(movieQueryUrl).then(
         function (response) {
             console.log("Title: " + response.data.Title);
             console.log("Year: " + response.data.Year);
             console.log("Rated: " + response.data.Rated);
             console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
             console.log("Country Produced: " + response.data.Country);
             console.log("Language: " + response.data.Language);
             console.log("Plot: " + response.data.Plot);
             console.log("Actors: " + response.data.Actors);
         })
         .catch(function(error) {
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
}

function Bands(){
    bandQueryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
    axios.get(bandQueryUrl).then(
        function (responseBand) {
            for (i = 0; i < responseBand.data.length; i++) {
                console.log(userInput + " is performing at " + responseBand.data[i].venue.name + " in " + responseBand.data[i].venue.city + " on " + moment(responseBand.data[i].datetime).format("L"));
            }
        }).catch(function (error) {
            console.log(error);
        });
}

function SpotifyCall(){
    if (!userInput){
        userInput = 'The Sign';
    }
    spotify.search({type: 'track', query: userInput}, function(err, data){
        if (err){
            return
        }
        //Handle Data
        var albumTrack = data.tracks.items;

        for (i=0; i < albumTrack.length; i++){
        console.log("Artist: " + albumTrack[i].artists[i].name);
        console.log("Album Title: " + albumTrack[i].album.name);
        console.log("Spotify Link: " + albumTrack[i].preview_url);
        console.log("Track Title: " + albumTrack[i].name);
        }
    });
}

function Text(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }  
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(", ");
        console.log(dataArr);
        command = dataArr[0];
        userInput = dataArr[1];
        switchCall();
      }); 
}

switchCall();