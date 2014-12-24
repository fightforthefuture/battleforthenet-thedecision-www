var React = require('react');

var Logo = React.createClass({

    render: function() {
        var className = 'logo';
        if (this.state.loaded) {
            className += ' loaded';
        }

        return (
            <a href="#Let's get started.">
                <img
                    className={className}
                    onLoad={this.onLoad}
                    src="/design/Logo.png"
                    />
            </a>
        );
    },

    onLoad: function(e) {
        this.setState({
            loaded: true
        });
    },

    getInitialState: function() {
        return {
            loaded: false
        };
    },

});

module.exports = Logo;