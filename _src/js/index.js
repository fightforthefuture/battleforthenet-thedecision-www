var AJAX = require('./AJAX');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var Queue = require('./Queue');



// Design enhancements
(function(){
    // Preload the background
    new ImagePreloader('./images/background.jpg', function() {
        var background = document.getElementById('background');
        background.className = 'fadeIn';
        background.style.backgroundImage = 'url(' + this.src + ')';
    });

    // Show the spinner
    new LoadingIcon({
        target: '#battle .spinner'
    });
})();



// Load geography & politicians JSON
(function() {
    var ajaxResponses = {};
    var ajaxQueue = new Queue({
        callback: function() {
            var politiciansNode = document.querySelector('#battle .politicians');

            var isAmerican = (ajaxResponses.geography.country.iso_code === 'US');
            if (!isAmerican) {
                var countryName = ajaxResponses.geography.country.names.en;
                var thanksMessage =
                    'We noticed you are located in ' + countryName + '.' +
                    '\n\nPlease encourage your American friends & family to visit Battle for the Net.' +
                    '\n\nThanks for participating!';
                alert(thanksMessage);
                politiciansNode.textContent = 'Please encourage your American friends & family to visit Battle for the Net.';
            }

            politiciansNode.className = politiciansNode.className.replace(/ ?pulse ?/, '');
            politiciansNode.textContent = '<form />';
        },
        remaining: 2
    });
    new AJAX({
        url: 'https://fftf-geocoder.herokuapp.com',
        success: function(e) {
            var json = JSON.parse(e.target.responseText);
            ajaxResponses.geography = json;
            ajaxQueue.tick();
        }
    });
    new AJAX({
        url: 'https://spreadsheets.google.com/feeds/list/1-hBOL7oNJXWvUdhK0veiybSXaYFUZu1aNUuRyNeaUmg/default/public/values?alt=json',
        success: function(e) {
            var json = JSON.parse(e.target.responseText);
            ajaxResponses.politicians = json.feed.entry;
            ajaxQueue.tick();
        }
    });
})();
