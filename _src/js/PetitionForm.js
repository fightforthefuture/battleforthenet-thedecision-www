var Template = require('./Template');


function PetitionForm(params) {
    this.formSnippet = params.formSnippet
    this.geography = params.geography;
    this.politicians = params.politicians;
    this.target = params.target;

    var politicians = [];
    if (this.geography.country.iso_code === 'US') {
        var stateName = this.geography.subdivisions[0].names.en;
        politicians = this.politicians.filter(function(politician) {
            return (
                (politician.gsx$state.$t === stateName)
                &&
                (politician.gsx$organization.$t === 'Senate')
            );
        });
    }

    if (politicians.length === 0) {
        var teamCable = this.politicians.filter(function(politician) {
            return (
                (politician.gsx$team.$t === 'team-cable')
            )
        });

        politicians = [];
        politicians[0] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        while (!politicians[1] || politicians[0] === politicians[1]) {
            politicians[1] = teamCable[Math.floor(Math.random() * teamCable.length) - 1];
        }
    }

    var formWrapperNode = document.querySelector(this.target);
    formWrapperNode.innerHTML = Template(this.formSnippet, {
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
            };
        })
    });
    formWrapperNode.className = formWrapperNode.className.replace(/loading/, ' ');
}

module.exports = PetitionForm;
