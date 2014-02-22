
/*
 * GET home page.
 */

var path = require('path');
var fs = require('fs');

exports.index = function(req, res) {
    res.render('index', {title: 'Игра Кубики'});
};

exports.rules = function(req, res) {
    var rulesHTMLpath = path.normalize(path.join(path.normalize(__dirname), '../public/static/html/slava/rules2.html'));

    res.render('rules', {title: 'Правила', content: fs.readFileSync(rulesHTMLpath, {encoding: 'utf8'})});
};