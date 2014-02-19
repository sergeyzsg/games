define(['jquery', 'underscore'], function() {
    var _ = require('underscore');

    var countRules = {
        1: {1: 10, 2: 20, 3: 100, 4: 200, 5: 1000},
        2: {3: 20, 4: 40, 5: 200},
        3: {3: 30, 4: 60, 5: 300},
        4: {3: 40, 4: 80, 5: 400},
        5: {1: 5, 2: 10, 3: 50, 4: 100, 5: 500},
        6: {3: 60, 4: 120, 5: 600}
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return ({
        players: [],
        tableDices: [],
        winningDices: [],
        state: {
            activePlayer: null,
            canThrow: true,
            score: 0
        },

        init: function() {
            var self = this;

            _.times(5, function(index) {
                self.tableDices.push({
                    id: index + 1,
                    value: 1
                })
            });

            return this;
        },

        addPlayer: function(name) {
            this.players.push(name);

            var td = $('<td></td>');
            td.text(name);

            $('#score').find('tr').first().append(td);
        },

        genDices: function(leftCount) {
            var i,
                result = [];

            for(i=0; i < leftCount; i++) {
                result.push(getRandomInt(1, 6))
            }

            return result;
        },



        throwDices: function() {
            var self = this;
            var values = this.genDices(_.size(this.tableDices));

            _.each(values, function(value, index) {
                self.tableDices[index].value = value;
            });

            this.calcThrowResult();
        },

        displayDices: function() {
            var tableDices = $('#table_dices');
            tableDices.html('');
            _.each(this.tableDices, function(dice) {
                tableDices.append('<div class="cub pull-left" id="' + dice.id + '-dice">' + dice.value + '</div>');
            });

            var winningDices = $('#winning_dices');
            winningDices.html('');
            _.each(this.winningDices, function(dice) {
                winningDices.append('<div class="cub pull-left" id="' + dice.id + '-dice">' + dice.value + '</div>');
            });
        },

        calcThrowResult: function() {
            var self = this;
            var diceByNumber = {1:[], 2: [], 3: [], 4: [], 5: []};
            var totalScore = 0;

            _.each(this.tableDices, function(dice) {
                diceByNumber[dice.value].push(dice);
            });

            _.each(_.range(1, 7), function(diceValue) {
                var diceCount = _.size(diceByNumber[diceValue] || []);

                var score = countRules[diceValue][diceCount] || 0;

                if (score) {
                    self.moveDicesToWin(diceByNumber[diceValue]);
                    totalScore += score;
                }
            });
        },

        moveDicesToWin: function(dices) {
            var self = this;

            _.each(dices, function(dice) {
                self.tableDices = _.without.apply(_, ([self.tableDices]).concat(dices));
                self.winningDices = _.union.apply(_, ([self.winningDices]).concat(dices));
            });

        }
    }).init();
})
