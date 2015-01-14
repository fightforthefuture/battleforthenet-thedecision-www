var AJAX = require('./AJAX');
var Countdown = require('./Countdown');
var ImagePreloader = require('./ImagePreloader');
var LoadingIcon = require('./LoadingIcon');
var Queue = require('./Queue');
var Template = require('./Template');



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

            var politicians = [];
            if (ajaxResponses.geography.country.iso_code === 'US') {
                var stateName = ajaxResponses.geography.subdivisions[0].names.en;
                politicians = ajaxResponses.politicians.filter(function(politician) {
                    return (
                        (politician.gsx$state.$t === stateName)
                        &&
                        (politician.gsx$organization.$t === 'Senate')
                    );
                });
            }

            if (politicians.length === 0) {
                var teamCable = ajaxResponses.politicians.filter(function(politician) {
                    return (
                        (politician.gsx$team.$t === 'team-cable')
                    );
                });

                politicians = [];
                politicians[0] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
                while (!politicians[1] || politicians[0] === politicians[1]) {
                    politicians[1] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
                }
            }

            var formWrapperNode = document.querySelector('#battle .form-wrapper');
            formWrapperNode.innerHTML = Template(ajaxResponses.formSnippet, {
                politicians: politicians.map(function(politician) {
                    var team = politician.gsx$team.$t;
                    var stance = 'undecided';
                    if (team === 'team-cable') {
                        stance = 'anti internet';
                    } else if (team === 'team-internet') {
                        stance = 'pro internet';
                    }
                    return {
                        image: 'images/scoreboard/' + politician.gsx$imagepleasedontedit.$t,
                        name: politician.gsx$name.$t,
                        stance: stance,
                        team: team
                    }
                })
            });
            formWrapperNode.className = formWrapperNode.className.replace(/loading/, ' ');

            // Randomize disclaimer
            var loc = window.location.href;
            random_org = null;
            if (loc.indexOf('org=') == -1) {
                var coin_toss = Math.random();
                if (coin_toss < .2) {
                    random_org = 'fp';
                } else if (coin_toss < .6) {
                    random_org = 'dp';
                } else {
                    random_org = 'fftf';
                }
            }
            if (loc.indexOf('org=fp') != -1 || random_org == 'fp') {
                document.getElementById('org').value = 'fp';
                document.getElementById('randomize_disclosure').style.display = 'none';
                document.getElementById('fp_disclosure').style.display = 'block';
            } else if (loc.indexOf('org=dp') != -1 || random_org == 'dp') {
                document.getElementById('org').value = 'dp';
                document.getElementById('randomize_disclosure').style.display = 'none';
                document.getElementById('dp_disclosure').style.display = 'block';
            } else if (loc.indexOf('org=fftf') != -1 || random_org == 'fftf') {
                document.getElementById('org').value = 'fftf';
                document.getElementById('randomize_disclosure').style.display = 'none';
                document.getElementById('fftf_disclosure').style.display = 'block';
            }
        },
        remaining: 3
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
    new AJAX({
        url: 'snippets/form.html',
        success: function(e) {
            ajaxResponses.formSnippet = e.target.responseText;
            ajaxQueue.tick();
        }
    });
})();
