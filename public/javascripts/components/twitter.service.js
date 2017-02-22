app.service('twitterService', function($http, $state, $interval) {

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/

    // Initialize arrays for data
    this.tweetScores = [];
    this.tweetTimes = [];
    this.tweetText = [];
    this.filteredResponse = [];
    this.positiveResults = [];
    this.negativeResults = [];

    this.positivePercentage = null;
    this.negativePercentage = null;
    let timer = null;


    // Save search query in service so we can use it later to restart stream
    this.query = null;

    // Initiate stream on the server by passing it a query
    this.startStream = (streamQuery) => {
      // Reset all of these arrays to 0 for when we start a new query
      this.tweetScores.length = 0;
      this.tweetTimes.length = 0;
      this.tweetText.length = 0;
      this.filteredResponse.length = 0;

      // Saving this for restarting the stream
      this.query = streamQuery;

      $http.get('/stream/' + streamQuery).then( (response) => {
        $state.go('stream')
        this.getUpdate();
      });
    };
    // Restart stream from stream view page
    this.restartStream = (streamQuery) => {
      this.query = streamQuery;
      $http.get('/stream/' + streamQuery).then( (response) => {
        $state.go('stream')
        this.getUpdate();
        // timer = $interval( () => {
        //   console.log('we are polling');
        //   this.getUpdate();
        // }, 3000);
      });
    };

    // Helper function to conduct polling
    this.getUpdate = () => {
      $http.get('/stream/update').then( (response) => {
        // Filter out tweets with sentiment score of 0
        let filteredResponse = response.data.filter( tweet => tweet.sentiment.score !== 0 );
        this.filteredResponse.push.apply(this.filteredResponse, filteredResponse);
        // Map out y-axis data
        let tweetScores = filteredResponse.map( tweet => tweet.sentiment.score );
        // Push these onto the array because we don't want it to reset each interval
        let latest = this.tweetScores.concat( tweetScores ).slice( -100 )
        this.tweetScores.splice(0, this.tweetScores.length)
        this.tweetScores.push.apply(this.tweetScores,latest)
        // this.tweetScores.push.apply(this.tweetScores, tweetScores);
        // Map out x-axis data
        let tweetTimes  = filteredResponse.map( tweet => tweet.time );
        this.tweetTimes.push.apply(this.tweetTimes, tweetTimes);

        let tweetText   = filteredResponse.map( tweet => tweet.text );
        this.tweetText.push.apply(this.tweetText, tweetText);

        //Pie chart data
        let positiveResults = filteredResponse.filter( tweet => tweet.sentiment.score > 0);
        this.positiveResults.push.apply(this.positiveResults, positiveResults);

        this.positivePercentage = this.positiveResults.length / this.filteredResponse.length;
        console.log('here is our positive percentage', this.positivePercentage);

        let negativeResults = filteredResponse.filter( tweet => tweet.sentiment.score < 0);
        this.negativeResults.push.apply(this.negativeResults, negativeResults);

        this.negativePercentage = this.negativeResults.length / this.filteredResponse.length;
        console.log('here is our negative percentage', this.negativePercentage);
      });
    };

    this.stopPolling = () => {
        $http.get('/stream/stop');
    };
});
