(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/index.js":[function(require,module,exports){
(function (global){
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
        background.classList.add('fadeIn');
        background.style.backgroundImage = 'url(' + this.src + ')';
    });

    // Show the spinner
    new LoadingIcon({
        target: '#battle .spinner'
    });

    setTimeout(function() {
        if (!global.fontsAreReady) {
            global.fontsAreReady = true;
            document.body.classList.add('loaded', 'slow');
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
            politiciansNode.classList.remove('loading');
            innerHeight; // Paint before fetching new assets
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AJAX":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\AJAX.js","./Countdown":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Countdown.js","./ImagePreloader":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\ImagePreloader.js","./LoadingIcon":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\LoadingIcon.js","./Queue":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\Queue.js"}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\AJAX.js":[function(require,module,exports){
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
    var request = requestAnimationFrame || setTimeout;
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

},{}]},{},["./js/index.js"]);
