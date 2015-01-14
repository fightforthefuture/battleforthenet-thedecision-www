var AJAX = require('./AJAX');
var Countdown = require('./Countdown');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var OrganizationRotation = require('./OrganizationRotation');
var PetitionForm = require('./PetitionForm');
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

            new PetitionForm({
                allPoliticians: ajaxResponses.politicians,
                formTemplate: ajaxResponses.formTemplate,
                geography: ajaxResponses.geography,
                target: '#battle .form-wrapper'
            });

            // Add events
            new OrganizationRotation();
        },
        remaining: 3
    });

    var LiveURLs = {
        geography: 'https://fftf-geocoder.herokuapp.com',
        politicians: 'https://spreadsheets.google.com/feeds/list/12g70eNkGA2hhRYKSENaeGxsgGyFukLRMHCqrLizdhlw/default/public/values?alt=json'
    };
    var DebugURLs = {
        geography: 'debug/geography.json',
        politicians: 'debug/politicians.json'
    };

    var URLs;
    if (location.href.match(/localhost/)) {
        URLs = DebugURLs;
    } else {
        URLs = LiveURLs;
    }

    new AJAX({
        url: URLs.geography,
        success: function(e) {
            var json = JSON.parse(e.target.responseText);
            ajaxResponses.geography = json;
            ajaxQueue.tick();
        }
    });

    new AJAX({
        url: URLs.politicians,
        success: function(e) {
            var json = JSON.parse(e.target.responseText);
            ajaxResponses.politicians = json.feed.entry;
            ajaxQueue.tick();
        }
    });

    new AJAX({
        url: 'snippets/form.html',
        success: function(e) {
            ajaxResponses.formTemplate = e.target.responseText;
            ajaxQueue.tick();
        }
    });
})();
