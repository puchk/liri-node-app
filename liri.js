var userCommand = process.argv[2];
var additionalCommands = process.argv[3];


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
}
// =============================SPOTIFY================================
var spotify = require('spotify');

function searchSong(song){
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if ( err ) {
	      console.log('Error occurred: ' + err);
	  }

	  var dataObject = data.tracks.items;
	  // console.log(dataObject);

	  for (var i=0; i<dataObject.length; i++) {
	  // for (var i=0; i<1; i++) {
		  songInfo(dataObject[i]);
		};
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


switch(userCommand) {
	case "my-tweets":
		retrieveTweets(20);
		break;
	case "post-tweet":
		postTweets();
		break;
	case "spotify-this-song":
		if (additionalCommands === undefined) {
			defaultSong();
			break;
		} 
		else {
			searchSong(additionalCommands);
			break;
		}
		searchSong(additionalCommands);
		break;
	default:
		console.log("Command not recognized.");
}