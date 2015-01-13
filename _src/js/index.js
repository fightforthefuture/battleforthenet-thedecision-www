var AJAX = require('./AJAX');
var Countdown = require('./Countdown');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var Queue = require('./Queue');



// Design enhancements
(function(){
    // Start the countdown
    setTimeout(function() {
        var countdownDelay = 0;
        if (!global.fontsAreReady) {
            countdownDelay = 1000;
        }

        setTimeout(function() {
            var countdown = new Countdown({
                date: new Date(Date.UTC(2015, 1, 26, 15, 30, 0)).getTime()
            });
        }, countdownDelay);
    }, 200);

    // Preload the background
    new ImagePreloader('./images/background.jpg', function() {
        var background = document.getElementById('background');
        background.className += ' fadeIn ';
        background.style.backgroundImage = 'url(' + this.src + ')';
    });

    // Show the spinner
    new LoadingIcon({
        target: '#battle .spinner'
    });

    setTimeout(function() {
        if (!global.fontsAreReady) {
            global.fontsAreReady = true;
            document.body.className += ' loaded slow ';
        }
    }, 1200);
})();



// Load geography & politicians JSON
(function() {
    var ajaxResponses = {};
    var ajaxQueue = new Queue({
        callback: function() {
            var pleaseWaitNode = document.querySelector('#battle .please-wait');
            pleaseWaitNode.parentNode.removeChild(pleaseWaitNode);

            var isAmerican = (ajaxResponses.geography.country.iso_code === 'US');
            if (!isAmerican) {
                var countryName = ajaxResponses.geography.country.names.en;
                var thanksMessage =
                    'We noticed you are located in ' + countryName + '.' +
                    '\n\nPlease encourage your American friends & family to visit Battle for the Net.' +
                    '\n\nThanks for participating!';
                alert(thanksMessage);
                return;
            }

            var stateName = ajaxResponses.geography.subdivisions[0].names.en;
            var politicians = ajaxResponses.politicians.filter(function(politician) {
                return (
                    (politician.gsx$state.$t === stateName)
                    &&
                    (politician.gsx$organization.$t === 'Senate')
                );
            });

            var politiciansNode = document.querySelector('#battle .politicians');
            politicians.forEach(function(politician) {
                var politicianNode = document.createElement('div');
                politicianNode.textContent = politician.gsx$first.$t + ' ' + politician.gsx$name.$t;
                politiciansNode.appendChild(politicianNode);
            });
            politiciansNode.className = politiciansNode.className.replace(/loading/, ' ');
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
