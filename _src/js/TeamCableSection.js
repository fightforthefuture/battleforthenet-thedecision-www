var Template = require('./Template');

function TeamCableSection(params) {
    this.target = params.target;
    this.template = params.template;

    this.DOMNode = document.querySelector(this.target);

    this.render();
}

TeamCableSection.prototype.render = function() {
    this.DOMNode.innerHTML = Template(this.template, {});
};

module.exports = TeamCableSection;
