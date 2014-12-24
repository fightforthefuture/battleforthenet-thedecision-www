var React = require('react');

var Logo = require('./Logo.jsx');

var Page = React.createClass({

    render: function() {
        return (
            <section id="page" className="page">
                <Logo />
            </section>
        );
    }

});

module.exports = Page;