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
