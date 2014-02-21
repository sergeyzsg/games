define(['jquery', 'underscore'], function() {
    var _ = require('underscore');
    var $ = require('jquery');

    var countRules = {
        1: {1: 10, 2: 20, 3: 100, 4: 200, 5: 1000},
        2: {3: 20, 4: 40, 5: 200},
        3: {3: 30, 4: 60, 5: 300},
        4: {3: 40, 4: 80, 5: 400},
        5: {1: 5, 2: 10, 3: 50, 4: 100, 5: 500},
        6: {3: 60, 4: 120, 5: 600}
    };

    return ({
        players: [],
        tableDices: [],
        winningDices: [],
        activePlayer: null,
        state: {
            moveNumber: 1,
            started: false,
            canAddPlayers: true,
            tableState: {
                canThrow: false,
                throwFail: false,
                score: 0
            }
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
        /*
        Состояния not-entered, entered, barrel, win
         */

        addPlayer: function(name) {
            if (!this.state.canAddPlayers) {
                return;
            }

            this.players.push({
                id: this.players.length + 1,
                name: name,
                state: {
                    code: 'not-entered',
                    score: 0,
                    barrelState: {
                        scoreToCollect: 0,
                        score: 0,
                        throwCount: 0
                    },
                    failCount: 0
                }
            });

            var td = $('<td></td>');
            td.text(name);

            $('#score').find('tr').first().append(td);
        },

        genDices: function(leftCount) {
            var i,
                result = [];

            for(i=0; i < leftCount; i++) {
                result.push(_.random(1, 6));
            }

            return result;
        },

        startGame: function() {
            if (this.state.started) {
                return;
            } else {
                this.state.started = true;
            }

            this.state.canAddPlayers = false;
            this.players = _.shuffle(this.players);
            var activePlayer = this.players[0];

            this.setActivePlayer(activePlayer);
            this.display();
        },

        resetTable: function() {
            this.moveDicesToTable(this.winningDices);
            this.state.tableState.score = 0;
            this.state.tableState.throwFail = false;
            this.state.tableState.canThrow = true;
        },

        setActivePlayer: function(player) {
            this.resetTable();

            this.activePlayer = player;
        } ,

        throwDices: function() {
            if (!this.state.tableState.canThrow) {
                return;
            }

            if (_.size(this.tableDices) === 0) {
                this.moveDicesToTable(this.winningDices);
            }

            var self = this;
            var values = this.genDices(_.size(this.tableDices));

            _.each(values, function(value, index) {
                self.tableDices[index].value = value;
            });

            this.calcThrowResult();

            this.display();
        },

        display: function() {
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

            if (this.activePlayer) {
                $('#player_name').text(this.activePlayer.name);
            }

            if (this.state.tableState.throwFail) {
                $('#current_score').text('Чирк');
            } else {
                $('#current_score').text(this.state.tableState.score);
            }
        },

        calcThrowResult: function() {
            var self = this;

            var diceByNumber = {};
            _.times(6, function(index) {
                diceByNumber[index + 1] = [];
            });

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

            if (!totalScore) {
                this.state.tableState.canThrow = false;
                this.state.tableState.throwFail = true;
            } else {
                this.state.tableState.score += totalScore;
            }
        },

        endMove: function() {
            var playerState = this.activePlayer.state;
            var nextIndex, nextPlayer;

            this.state.tableState.canThrow = false;

            this.processAndWriteScore();

            if (playerState.code !== 'win') {
                nextIndex = _.indexOf(this.players, this.activePlayer) + 1;
                if (nextIndex === _.size(this.players)) {
                    nextIndex = 0;
                    this.state.moveNumber++;
                }

                nextPlayer = this.players[nextIndex];

                this.setActivePlayer(nextPlayer);
            }

            this.display();
        },

        processAndWriteScore: function() {
            var fail = this.state.tableState.throwFail;
            var score = this.state.tableState.score;
            var write = '';

            var playerState = this.activePlayer.state;
            switch(playerState.code) {
                case 'not-entered':
                    if (fail) {
                        playerState.failCount++;

                        if (playerState.failCount === 3) {
                            playerState.failCount = 0;
                            playerState.score -= 100;
                            write = playerState.score;
                        } else {
                            write = '&mdash;';
                        }
                        break;
                    }

                    playerState.score += score;
                    write = this.checkWinAndBarrels(playerState);
                    if (write) {
                        break;
                    }

                    if (playerState.score >= 35) {
                        playerState.code = 'entered';
                        write = playerState.score;
                        break;
                    }

                    if (playerState.score > 0) {
                        playerState.score = 0;
                    }

                    write = playerState.score;
                    break;
                case 'entered':
                    if (fail) {
                        playerState.failCount++;

                        if (playerState.failCount === 3) {
                            playerState.failCount = 0;
                            playerState.score -= 100;
                        } else {
                            write = '&mdash;';
                            break;
                        }
                    } else {
                        playerState.score += score;
                    }

                    write = this.checkWinAndBarrels(playerState);
                    if (write) {
                        break;
                    }

                    write = playerState.score;
                    break;
                case 'barrel':
                    playerState.barrelState.throwCount++;

                    if (fail) {
                        playerState.failCount++;

                        if (
                            (playerState.failCount === 3) ||
                            (playerState.barrelState.throwCount === 3)
                        ) {
                            playerState.score = playerState.score - 100 + playerState.barrelState.score;
                            playerState.code = 'entered';
                            playerState.failCount = 0;
                            write = playerState.score;
                        } else {
                            write = '&mdash;';
                        }
                        break;
                    }

                    playerState.barrelState.score += score;

                    if (playerState.barrelState.score >= playerState.barrelState.scoreToCollect) {
                        playerState.code = 'entered';
                        playerState.score += playerState.barrelState.score;

                        write = this.checkWinAndBarrels(playerState);
                        if (write) {
                            break;
                        }
                        write = playerState.score;
                        break;
                    }

                    if (playerState.barrelState.throwCount === 3) {
                        playerState.score = playerState.score - 100 + playerState.barrelState.score;
                        playerState.code = 'entered';
                        write = playerState.score;
                        break;
                    }

                    write = playerState.barrelState.score;
                    break;
                case 'win':
                    break;
                default: alert('error');
            }

            var trId = 'move_' + this.state.moveNumber;

            var $tr = $('#' + trId);
            if (!$tr.size()) {
                $tr = $('<tr id="' + trId + '"><td>' + this.state.moveNumber + '</td></tr>');
                _.times(_.size(this.players), function() {
                    $tr.append('<td></td>')
                });
                $('#score').append($tr);
            }

            $tr.find('td').eq(this.activePlayer.id).html(write);
        },

        checkWinAndBarrels: function(playerState) {
            var score = playerState.score;

            if (score >= 1000) {
                playerState.code = 'win';
                return 'Победа';
            }

            if ((200 <= score) && (score < 275)) {
                playerState.code = 'barrel';
                playerState.score = 200;
                playerState.barrelState = {
                    scoreToCollect: 75,
                    score: 0,
                    throwCount: 0
                }
                return playerState.score;
            }

            if ((400 <= score) && (score < 475)) {
                playerState.code = 'barrel';
                playerState.score = 400;
                playerState.barrelState = {
                    scoreToCollect: 75,
                    score: 0,
                    throwCount: 0
                }
                return playerState.score;
            }

            if ((700 <= score) && (score < 775)) {
                playerState.code = 'barrel';
                playerState.score = 700;
                playerState.barrelState = {
                    scoreToCollect: 75,
                    score: 0,
                    throwCount: 0
                }
                return playerState.score;
            }

            if ((900 <= score) && (score < 1000)) {
                playerState.code = 'barrel';
                playerState.score = 900;
                playerState.barrelState = {
                    scoreToCollect: 100,
                    score: 0,
                    throwCount: 0
                }
                return playerState.score;
            }

            return false;
        },

        moveDicesToWin: function(dices) {
            var self = this;

            self.tableDices = _.without.apply(_, ([self.tableDices]).concat(dices));
            self.winningDices = _.union.apply(_, ([self.winningDices]).concat(dices));

        },

        moveDicesToTable: function(dices) {
            var self = this;

            self.winningDices = _.without.apply(_, ([self.winningDices]).concat(dices));
            self.tableDices = _.union.apply(_, ([self.tableDices]).concat(dices));

        }
    }).init();
})
