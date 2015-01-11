(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/index.js":[function(require,module,exports){
var ImagePreloader = require('./ImagePreloader');

new ImagePreloader('/images/background.jpg', function() {
    var background = document.getElementById('background');
    background.className = 'fadeIn';
    background.style.backgroundImage = 'url(' + this.src + ')';
});

},{"./ImagePreloader":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\src\\js\\ImagePreloader.js"}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\src\\js\\ImagePreloader.js":[function(require,module,exports){
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

},{}]},{},["./src/js/index.js"]);
