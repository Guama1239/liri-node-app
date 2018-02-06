require("dotenv").config();
//code required to import the key.js file
var keys = require('./keys.js');
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// Store all of the arguments in an array
var nodeArgs = process.argv;
// parses the command line argument to capture action desired
var command = nodeArgs[2];
// parses the search line to search parameter desired
var userSearch = nodeArgs[3];

switch (command) {
    case "my-tweets":
        fireTweeter();
        break;

    case "spotify-this-song":
        fireSpotify();
        break;

    case "movie-this":
        fireOMDB();
        break;

    case "do-what-it-says":
        fireDoWhat();
        break;

    default:
        break;
}


function fireOMDB() {
if (command === "movie-this" && userSearch) {
    var movieName = "";
    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        }
        else {
            movieName += nodeArgs[i];
        }
    }
    console.log(movieName)
}
else if (command === "movie-this" && userSearch === undefined) 
     {
        movieName = "Mr.Nobody";
        console.log("movie Name: ", movieName)
    }

// console.log("movieName" + movieName);
// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
//console.log(queryUrl);

request(queryUrl, function (error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
        // Parse the body of the site 
        console.log("==========================================");
        console.log("Title of the movie:      " + JSON.parse(body).Title);
        console.log("Year the movie came out: " + JSON.parse(body).Year);
        console.log("IMDB Rating:             " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating:  " + JSON.parse(body).Ratings[1].Value);
        console.log("Country:                 " + JSON.parse(body).Country);
        console.log("Language:                " + JSON.parse(body).Language);
        console.log("Plot:                    " + JSON.parse(body).Plot);
        console.log("Actors:                  " + JSON.parse(body).Actors);        //console.log(body) just to verify values are parsed correctly;
        console.log("==========================================");
        //append command with its respective data in log.txt file
        fs.appendFileSync("log.txt", "Command: " + `${command} ||  Search made for: ${movieName}
        \n===================================================================================\n`);
        fs.appendFileSync("log.txt", "Title of the movie:      " + `${JSON.parse(body).Title}\n`);
        fs.appendFileSync("log.txt", "Year the movie came out: " + `${JSON.parse(body).Year}\n`);
        fs.appendFileSync("log.txt", "IMDB Rating :            " + `${JSON.parse(body).imdbRating}\n`);
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating : " + `${JSON.parse(body).Ratings[1].Value}\n`);
        fs.appendFileSync("log.txt", "Country:                 " + `${JSON.parse(body).Country}\n`);
        fs.appendFileSync("log.txt", "Language:                " + `${JSON.parse(body).Language}\n`);
        fs.appendFileSync("log.txt", "Plot:                    " + `${JSON.parse(body).Plot}\n`);
        fs.appendFileSync("log.txt", "Actors:                  " + `${JSON.parse(body).Actors}\n`);
        fs.appendFileSync("log.txt", "==================================================================================="+`\n`);
    }
});
}

function fireTweeter() {
    var params = { screen_name: 'guamareports' };
    fs.appendFileSync("log.txt", "Command: " + `${command} ||  Search made for: last 20 tweets
        \n===================================================================================\n`);
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("-----------------------------------------------------");
                var tmessage = `tweet ${i + 1}:`;
                console.log(tmessage);
                fs.appendFileSync("log.txt", tmessage + `\n`);
                var tcreated = tweets[i].created_at;
                console.log(tcreated);
                fs.appendFileSync("log.txt", tcreated + `\n`);
                var ttext = tweets[i].text;
                console.log(ttext);
                fs.appendFileSync("log.txt", ttext + `\n`);
                fs.appendFileSync("log.txt", "===================================================================================" + `\n`);
                console.log("-----------------------------------------------------");
            }
        }
    });
    
};

 
function fireSpotify() {
    console.log(command);
    console.log(userSearch);
    if (command && userSearch) {
        var song = "";
        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                song = song + "+" + nodeArgs[i];
            }
            else {
                song += nodeArgs[i];
            }
        }
        console.log(song)
    }
    else if (command && userSearch === undefined) {
        song = "The Sign by Ace of Base";
        console.log("song Name: ", song)
    }

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("-----------------------------------------------------");
        fs.appendFileSync("log.txt", "Command: " + `${command} ||  Search made for: ${song}
        \n===================================================================================\n`);
        var artist = "Artist: " + data.tracks.items[0].artists[0].name;
        console.log(artist);
        fs.appendFileSync("log.txt", artist + `\n`);
        var choosenSong = "Song Name: " + data.tracks.items[0].name;
        console.log(choosenSong);
        fs.appendFileSync("log.txt", choosenSong + `\n`);
        var preview = "Preview: " + data.tracks.items[0].preview_url;
        console.log(preview);
        fs.appendFileSync("log.txt", preview + `\n`);
        var album = "Album: " + data.tracks.items[0].album.name;
        console.log(album);
        fs.appendFileSync("log.txt", album + `\n`);
        fs.appendFileSync("log.txt", "===================================================================================" + `\n`);
        console.log("-----------------------------------------------------");
        //console.log(song);
        //console.log(nodeArgs[3]);
        //console.log(artist);
    }
    );
}

function fireDoWhat() {
            fs.readFile("random.txt", "UTF-8", function(error, data){
               if (error) {return console.log(error);}
               console.log(data);
                var dataArr = data.split(",");
                command = dataArr[0];
                userSearch = dataArr[1];
                //console.log(command);
                //console.log(userSearch);
                //console.log(dataArr);
            });
            //console.log(command, "antes");
                if (command && userSearch) {
                    var song2 = "";
                    // Loop through all the words in the node argument
                    // And do a little for-loop magic to handle the inclusion of "+"s
                    for (var i = 3; i < nodeArgs.length; i++) {
                        if (i > 3 && i < nodeArgs.length) {
                            song2 = song2 + "+" + nodeArgs[i];
                        }
                        else {
                            song2 += dataArr[1];
                        }
                    }
                   // console.log(song2)
                }
                else if (command && userSearch === undefined) {
                    song2 = "I Want it That Way";
                    //console.log("song Name: ", song2)
                }

                spotify.search({ type: 'track', query: song2 }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    //console.log(command, "antes");
                    console.log("-----------------------------------------------------");
                    fs.appendFileSync("log.txt", "Command: " + `${command} ||  Search made for: ${song2}
                     \n===================================================================================\n`);
                    var artist = "Artist: " + data.tracks.items[0].artists[0].name;
                    console.log(artist);
                    fs.appendFileSync("log.txt", artist + `\n`);
                    var choosenSong = "Song Name: " + data.tracks.items[0].name;
                    console.log(choosenSong);
                    fs.appendFileSync("log.txt", choosenSong + `\n`);
                    var preview = "Preview: " + data.tracks.items[0].preview_url;
                    console.log(preview);
                    fs.appendFileSync("log.txt", preview + `\n`);
                    var album = "Album: " + data.tracks.items[0].album.name;
                    console.log(album);
                    fs.appendFileSync("log.txt", album + `\n`);
                    fs.appendFileSync("log.txt", "===================================================================================" + `\n`);
                    console.log("-----------------------------------------------------");
                    //console.log(song);
                    //console.log(nodeArgs[3]);
                    //console.log(artist);
                }
                );
                //fireSpotify(command, userSearch);
        
}