var Template = require('./Template');

function TeamInternetSection(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
}

TeamInternetSection.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
};

module.exports = TeamInternetSection;
