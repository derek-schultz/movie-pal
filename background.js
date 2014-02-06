/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler() {
  return function(info, tab) {
    var text = info.selectionText;
    var message = {};

    chrome.tabs.sendMessage(tab.id, "loading", function(response) {});

    $.getJSON('http://www.canistream.it/services/search?movieName='+text, function(response){

      var movie_id = response[0]['_id'];
      $.get(response[0]['links']['imdb'], function (imdb_data) {
        var imdb_rating = $('.star-box-giga-star', imdb_data);
        message['imdb'] = $.trim(imdb_rating.text());
        message['imdb_link'] = response[0]['links']['imdb'];

        $.get(response[0]['links']['rottentomatoes'], function (rotten_data){
          var rotten_rating = $('#all-critics-meter', rotten_data)[0];
          message['rotten'] = $(rotten_rating).text();
          message['rotten_link'] = response[0]['links']['rottentomatoes'];
          $.getJSON('http://www.canistream.it/services/query?movieId='+movie_id+'&attributes=1&mediaType=streaming', function(info) {

            message['stream'] = info;
            console.log('sending...');
            chrome.tabs.sendMessage(tab.id, message, function(response) {});

          });

        }, 'html');
      }, 'html');

    });
  };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "Get movie info",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : getClickHandler()
});
