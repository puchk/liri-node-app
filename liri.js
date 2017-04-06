var userCommand = process.argv[2];
var additionalCommands = process.argv.splice(3);


// =======================TWITTER=======================
var twitter = require('twitter');

var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
// console.log(keys);
// console.log(twitterKeys);

var client = new twitter(twitterKeys);

// --------------------RETRIEVE TWEETS--------------------
function retrieveTweets(numberOfTweets){
	client.get('statuses/user_timeline', function(error, tweets, response) {
	   for(var i=0; i<numberOfTweets; i++){
	   	console.log(tweets[i].text);
		 }
	});
}
// ----------------------POST TWEETS-----------------------
function postTweets(){

		client.post('statuses/update', {status: additionalCommands}, function(error, tweet, response) {
		  if (!error) {
		    console.log(tweet);
		  }
		});
/*		var counter = 0;
		client.post('statuses/update', {status: additionalCommands + counter.toString()})
			.then(function(tweet){
				console.log(tweet);
				counter++;
			})
			.then(client.post('statuses/update'))*/

}
// =============================SPOTIFY================================
var spotify = require('spotify');

function searchSong(song){
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if ( err ) {
	      console.log('Error occurred: ' + err);
	  }
	  console.log("DATA: "+data);
	  var dataObject = data.tracks.items;
	  // console.log(dataObject);

/*	  for (var i=0; i<dataObject.length; i++) {
	  // for (var i=0; i<5; i++) {
		  songInfo(dataObject[i]);
		};*/
		songInfo(dataObject[0]);
	});
}

function defaultSong(){
	spotify.lookup({ type: 'track', id: "0hrBpAOgrt8RXigk83LLNE" }, function(err, data) {
	  if ( err ) {
	      console.log('Error occurred: ' + err);
	  } 
	  songInfo(data);
	});
}

function songInfo(data){
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

function getMovie(){

	var movieTitle = additionalCommands.join('+');
	
	request("http://www.omdbapi.com/?t="+movieTitle+"&plot=short&r=json&tomatoes=true", function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	  	var movieData = JSON.parse(body);
	    // console.log(movieData);
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
	    console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
	    // ROTTEN TOMATOES URL
	    console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
  		console.log("---------------------------------");

	  }
	});

}


switch(userCommand) {
	case "my-tweets":
		retrieveTweets(20);
		break;
	case "post-tweet":
		postTweets();
		break;
	case "spotify-this-song":
		if (additionalCommands.length === 0) {
			defaultSong();
			break;
		} 
		else {
			searchSong(additionalCommands);
			break;
		}
		searchSong(additionalCommands);
		break;
	case "movie-this":
		getMovie();
		break;
	default:
		console.log("Command not recognized.");
}