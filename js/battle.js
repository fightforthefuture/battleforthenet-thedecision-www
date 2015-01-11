(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/index.js":[function(require,module,exports){
var ImagePreloader = require('./ImagePreloader');

new ImagePreloader('./images/background.jpg', function() {
    var background = document.getElementById('background');
    background.className = 'fadeIn';
    background.style.backgroundImage = 'url(' + this.src + ')';
});

var LoadingIcon = require('./LoadingIcon');
new LoadingIcon({
    target: '#battle .spinner'
});

},{"./ImagePreloader":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\ImagePreloader.js","./LoadingIcon":"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\LoadingIcon.js"}],"c:\\Users\\Chris\\projects\\battleforthenet-thedecision-www\\_src\\js\\ImagePreloader.js":[function(require,module,exports){
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
var svg = '<svg class="fadeIn" width="120px" height="120px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(0 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(30 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.16666666666666666s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(60 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.3333333333333333s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(90 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.5s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(120 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.6666666666666666s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(150 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.8333333333333334s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(180 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(210 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1.1666666666666667s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(240 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1.3333333333333333s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(270 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1.5s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(300 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1.6666666666666667s" repeatCount="indefinite"/></rect><rect  x="47" y="40" width="6" height="20" rx="3" ry="3" fill="#747499" transform="rotate(330 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1.8333333333333333s" repeatCount="indefinite"/></rect></svg>';

function LoadingIcon(params) {
    document.querySelector(params.target).innerHTML = svg;
}

module.exports = LoadingIcon;

},{}]},{},["./js/index.js"]);
