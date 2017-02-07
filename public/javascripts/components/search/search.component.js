app.component('search', {
    templateUrl: '/javascripts/components/search/search.html',
    controller: function(streamService) {
        console.log('hello from search component');

        this.searchQuery = null;

        this.search = function() {
          streamService.getSearchResults(this.searchQuery);
        };
    }
});
