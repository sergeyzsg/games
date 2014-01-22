define(['jquery'], function() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return {
        players: [],
        thrownDice: [1, 2, 3, 4, 5],
        winningDice: [],

        addPlayer: function(name) {
            this.players.push(name);

            var td = $('<td></td>');
            td.text(name);

            $('#score').find('tr').first().append(td);
        },

        throwDice: function(leftCount) {
            var i,
                result = [];

            for(i=0; i <= leftCount; i++) {
                result.push(getRandomInt(1, 6))
            }

            return result;
        }
    };
})
