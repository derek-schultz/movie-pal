var last_click = [0, 0];

document.addEventListener("contextmenu", function (e) {
    last_click = [e.x, e.y];
});

var popup;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request == "loading") {
        popup = $('<div>Loading...</div>').appendTo('body').css({
            'position': 'fixed',
            'z-index': 999999,
            'top': last_click[1],
            'left': last_click[0],
        });
    }

    else {
        popup.html('');
        var list = $('<ul>');
        list.append('<li><a href="'+request['rotten_link']+'">Rotten tomatoes: '+request['rotten']+'</a></li>');
        list.append('<li><a href="'+request['imdb_link']+'">IMDb: '+request['imdb']+'</a></li>');
        var i = 0;
        for (stream in request['stream']) {
            i++;
            if (i > 3)
                break;
            list.append('<li><a href="'+request['stream'][stream]['direct_url']+'">'+request['stream'][stream]['friendlyName']+'</a></li>');
            popup.append(list);
        }
        popup.append(list);
    }
  }
);