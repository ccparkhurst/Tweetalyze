app.component('stream', {
    templateUrl: '/javascripts/components/stream/stream.html',
    controller: function(twitterService, $log, $scope, $interval, $timeout, $state) {
      let vm = this;
      this.tweetText = twitterService.tweetText;
      this.tweetScores = twitterService.tweetScores;
      this.tweetTimes = twitterService.tweetTimes;
      this.filteredResponse = twitterService.filteredResponse;
      vm.tweetCount = 0;
      vm.negativePercentage = 50;
      vm.positivePercentage = 50;

      // Need this to restart stream
      this.query = twitterService.query;

      this.restartStream = () => {
        twitterService.restartStream(this.query);
        this.poll();
      };

      this.chartConfig = {
          options: {
              chart: {
                  type: 'area'
              }
          },

          title: {
              text: 'How Twitter feels about ' + twitterService.query,
              style: {
                color: '#616161',
                fontFamily: 'Lato',
                fontSize: '24px'
              },
          },
          yAxis: {
              min: -15,
              max: 15,
              title: {
                  text: 'Sentiment Score'
              }
          },
          xAxis: {
              title: {
                  text: 'Time'
              },
              categories: this.tweetText,
              labels: {
                enabled: false
              },
              type: 'datetime',
              minTickInterval: 100,
              minRange: 0,
              maxRange: 100 * 5
          },
          legend: {
            enabled: false
          },
          plotOptions: {
              line: {
                  dataLabels: {
                      enabled: false
                  },
                  enableMouseTracking: true
              }
          },
          series: [
              {
                  zones: [{
                    value: 0,
                    color: '#ED4337'
                  }],
                  name: 'Sentiment Score',
                  data: this.tweetScores
              }
          ]
      }; // End of chartconfig1

      this.poll = () => {
          this.interval = $interval(() => {
            twitterService.getUpdate();
            vm.negativePercentage = parseInt((this.filteredResponse.filter(tweet => tweet.sentiment.score < 0).length / this.filteredResponse.length) * 100);
            vm.positivePercentage = parseInt((this.filteredResponse.filter(tweet => tweet.sentiment.score > 0).length / this.filteredResponse.length) * 100);
            vm.tweetCount = twitterService.filteredResponse.length;
          }, 500);
      };
        
      // Starts polling process
      this.$onInit = () => {
          // twitterService.initialPieChart();
          this.poll();
      };

      this.stopPoll = () => {
        twitterService.stopPolling();
        $interval.cancel(this.interval);
      };

//Pie chart - work in progress
      // this.chartConfig2 = {
      //       chart: {
      //           plotBackgroundColor: null,
      //           plotBorderWidth: null,
      //           plotShadow: false,
      //           type: 'pie'
      //       },
      //       title: {
      //           text: 'Sentiment Share'
      //       },
      //       tooltip: {
      //           pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      //       },
      //       plotOptions: {
      //           pie: {
      //               allowPointSelect: true,
      //               cursor: 'pointer',
      //               dataLabels: {
      //                   enabled: true,
      //                   format: '<b>{point.name}</b>: {point.percentage:.1f} %',
      //                   style: {
      //                       color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
      //                   }
      //               }
      //           }
      //       },
      //       series: [{
      //           name: 'Sentiment',
      //           colorByPoint: true,
      //           data: [{
      //               name: 'Positive',
      //               y: twitterService.positivePercentage
      //           }, {
      //               name: 'Negative',
      //               color: '#ED4337',
      //               y: twitterService.negativePercentage,
      //               sliced: true,
      //               selected: true
      //           }]
      //       }]
      // };

  } // End of controller
}); // End of component
