(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/index.js":[function(require,module,exports){
(function (global){
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
                if (coin_toss < .33) {
                    random_org = 'fp';
                } else if (coin_toss < .66) {
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\AJAX.js","./Countdown":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Countdown.js","./ImagePreloader":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\ImagePreloader.js","./LoadingIcon":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\LoadingIcon.js","./Queue":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Queue.js","./Template":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Template.js"}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\AJAX.js":[function(require,module,exports){
function AJAX(params) {
    this.async = params.async || true;
    this.error = params.error;
    this.method = params.method || 'GET';
    this.success = params.success;
    this.url = params.url;

    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, this.async);

    if (this.success) {
        this.request.onload = this.success;
    }

    if (this.error) {
        this.request.onerror = this.error;
    }

    this.request.send();
}

module.exports = AJAX;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Countdown.js":[function(require,module,exports){
function Countdown(params) {
    this.date = params.date;
    this.interval = null;
    this.introWasShown = false;
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this.targets = {};
    this.tick = this.tick.bind(this);

    this.gatherTargets();
    this.start();
}

Countdown.prototype.constants = {
    day: (1000 * 60 * 60 * 24),
    hour: (1000 * 60 * 60),
    minute: (1000 * 60),
    second: (1000)
};

Countdown.prototype.destroy = function() {
    this.stop();

    delete this.date;
    delete this.targets;
    delete this.tick;
};

Countdown.prototype.gatherTargets = function() {
    this.targets.timer = document.querySelector('#battle .timer');
    this.targets.days = this.targets.timer.querySelector('.days .number');
    this.targets.hours = this.targets.timer.querySelector('.hours .number');
    this.targets.minutes = this.targets.timer.querySelector('.minutes .number');
    this.targets.seconds = this.targets.timer.querySelector('.seconds .number');
};

Countdown.prototype.padNumber = function(number) {
    if (number > 9) {
        return number;
    } else {
        return '0' + number;
    }
};

Countdown.prototype.requestAnimationFrame = function() {
    var request = window.requestAnimationFrame || setTimeout;
    request(this.tick);
};

Countdown.prototype.start = function() {
    this.stop();
    this.requestAnimationFrame();
    this.interval = setInterval(this.requestAnimationFrame, 1000);
};

Countdown.prototype.stop = function() {
    clearInterval(this.interval);
};

Countdown.prototype.showIntro = function() {
    this.targets.timer.classList.add('loaded');
    this.introWasShown = true;
};

Countdown.prototype.tick = function() {
    var now = Date.now();
    var difference = this.date - now;

    this.updateDates(difference);

    if (!this.introWasShown) {
        this.showIntro();
    }

    if (difference < 0) {
        document.querySelector('#battle h1').textContent = 'The most important FCC vote of our lifetime just happened.';
        this.destroy();
        return;
    }
};

Countdown.prototype.updateDates = function(difference) {
    var days = Math.floor(difference / this.constants.day);
    difference -= days * this.constants.day;

    var hours = Math.floor(difference / this.constants.hour);
    difference -= hours * this.constants.hour;

    var minutes = Math.floor(difference / this.constants.minute);
    difference -= minutes * this.constants.minute;

    var seconds = Math.floor(difference / this.constants.second);
    difference -= seconds * this.constants.second;

    this.targets.days.textContent = this.padNumber(days);
    this.targets.hours.textContent = this.padNumber(hours);
    this.targets.minutes.textContent = this.padNumber(minutes);
    this.targets.seconds.textContent = this.padNumber(seconds);
};

module.exports = Countdown;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\ImagePreloader.js":[function(require,module,exports){
function ImagePreloader(src, callback) {
    this.callback = callback;
    this.src = src;

    this.img = new Image();
    this.img.src = this.src;
    this.img.onload = this.onLoad.bind(this);
}

ImagePreloader.prototype.onLoad = function(e) {
    this.callback.call(this, this.src);
};

module.exports = ImagePreloader;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\LoadingIcon.js":[function(require,module,exports){
var html = '<div class="timer-spinner"><div style="-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);"></div><div style="-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);"></div></div>';

function LoadingIcon(params) {
    document.querySelector(params.target).innerHTML = html;
}

module.exports = LoadingIcon;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Queue.js":[function(require,module,exports){
function Queue(params) {
    this.callback = params.callback;
    this.context = params.context || this;
    this.remaining = params.remaining;
}

Queue.prototype.tick = function() {
    this.remaining--;

    if (this.remaining === 0) {
        this.callback.call(this.context);
        this.destroy();
    }
};

Queue.prototype.destroy = function() {
    delete this.callback;
    delete this.context;
};

module.exports = Queue;

},{}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Template.js":[function(require,module,exports){
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var cache = {};

var Template = function template(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
    cache[str] = cache[str] ||
    Template(document.getElementById(str).innerHTML) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

    // Introduce the data as local variables using with(){}
    "with(obj){p.push('" +

    // Convert the template into pure JavaScript
    str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
            + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
};

module.exports = Template;

},{}]},{},["./js/index.js"]);
