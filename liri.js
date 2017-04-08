var userCommand = process.argv[2];
var additionalCommands = process.argv.splice(3);
var movieTitle = additionalCommands.join('+');

// =======================TWITTER=======================
var twitter = require('twitter');

var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
var client = new twitter(twitterKeys);

// --------------------RETRIEVE TWEETS--------------------
function retrieveTweets(numberOfTweets) {
	client.get('statuses/user_timeline', function(error, tweets, response) {
	   for(var i=0; i<numberOfTweets; i++){
	   	console.log(tweets[i].user.name + " tweeted " + tweets[i].text + " at "+ tweets[i].created_at);
	   	// console.log(tweets[i]);
		 }
	});
}
// ----------------------POST TWEETS-----------------------
function postTweets(tweet) {
		client.post('statuses/update', {status: tweet}, function(error, tweet, response) {
		  if(!error) {
		    console.log(tweet);
		  }
		});
}
// =============================SPOTIFY================================
var spotify = require('spotify');

function searchSong(song) {
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if( err ) {
	      console.log('Error occurred: ' + err);
	  }
	  var dataObject = data.tracks.items;
		songInfo(dataObject[0]);
	});
}

function defaultSong() {
	spotify.lookup({ type: 'track', id: "0hrBpAOgrt8RXigk83LLNE" }, function(err, data) {
	  if( err ) {
	      console.log('Error occurred: ' + err);
	  } 
	  songInfo(data);
	});
}

function songInfo(data) {
  console.log("---------------------------------");
  // ARTIST
  console.log("Artist: " + data.artists[0].name);
  // SONG NAME
  console.log("Song: " + data.name);
  // PREVIEW LINK FROM SPOTIFY
  console.log("Preview link: " + data.preview_url);
  // ALBUM OF THE SONG
  console.log("Album: " + data.album.name);
  console.log("---------------------------------");
}
// ==============================OMDB===================================
var request = require('request');

function getMovie(movieName) {
	
	request("http://www.omdbapi.com/?t="+movieName+"&plot=short&r=json&tomatoes=true", function(error, response, body) {
	  if(!error && response.statusCode === 200) {
	  	var movieData = JSON.parse(body);
	  	console.log("---------------------------------");
	    // TITLE
	    console.log("Title: " + movieData.Title);
	    // YEAR
	    console.log("Year: " + movieData.Year);
	    // IMDB RATING
	    console.log("IMDB Rating: " + movieData.imdbRating);
	    // COUNTRY
	    console.log("Country: " + movieData.Country);
	    // LANGUAGE
	    console.log("Language: " + movieData.Language);
	    // PLOT
	    console.log("Plot: " + movieData.Plot);
	    // ACTORS
	    console.log("Actors: " + movieData.Actors);
	    // ROTTEN TOMATOES RATING
	    // If Ratings is a property in movieData
			if(Object.keys(movieData).indexOf("Ratings") !== -1) {
				if(movieData.Ratings.length > 2) {
	    		console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
	    	}
	  	}
	    // ROTTEN TOMATOES URL
	    console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
  		console.log("---------------------------------");
	  }
	});
}
// ===============================FS====================================
var fs = require('fs');

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		// console.log(data);

		var dataArray = data.split(",");
		if(dataArray.length > 1) {
			var movieArray = dataArray[1];
			movieTitle = dataArray[1].split(" ").join("+");
		} 
		switch(dataArray[0]) {
			case "my-tweets":
				retrieveTweets(20);
				break;
			case "post-tweet":
				postTweets(dataArray[1]);
				break;
			case "spotify-this-song":
				if(dataArray.length === 1) {
					defaultSong();
					break;
				}
				else {
					searchSong(dataArray[1]);
					break;
				}
			case "movie-this":
				console.log("movieTitle: "+movieTitle);
				if(movieTitle === "") {
					movieTitle = "Mr+Nobody";
				}
				getMovie(movieTitle);
				break;
			case "do-what-it-says":
				errorNotice(1);
				break;
			default:
				errorNotice(0);
		}
	})
}
// ==================================================================
function errorNotice(number) {
	var errorList = ["Command not recognized", "Can't run this command in .txt file"];
	console.log(errorList[number]);
}

switch(userCommand) {
	case "my-tweets":
		retrieveTweets(20);
		break;
	case "post-tweet":
		postTweets(additionalCommands);
		break;
	case "spotify-this-song":
		if(additionalCommands.length === 0) {
			defaultSong();
			break;
		} 
		else {
			searchSong(additionalCommands);
			break;
		}
	case "movie-this":
		if(movieTitle === "") {
			movieTitle = "Mr+Nobody";
		}
		getMovie(movieTitle);
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
	default:
		errorNotice(0);
}