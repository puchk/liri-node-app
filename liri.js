var userCommand = process.argv[2];
// console.log(userCommand);

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
/*client.post('statuses/update', {status: userCommand}, function(error, tweet, response) {
  if (!error) {
    console.log(tweet);
  }
});*/



switch(userCommand){
	case "my-tweets":
		retrieveTweets(3);
		break;
	case "post-tweet":
		console.log("post-tweet");
		break;
	default:
		console.log("Command not recognized.")
}