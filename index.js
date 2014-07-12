var http = require('http');
var express = require('express');
var breach = require('breach_module');
var cons = require('consolidate');
var swig = require('swig');
var config = require(__dirname + '/package.json');

var bootstrap = function(port) {
    breach.init(function(next) {
        breach.expose('init', function(src, args, next) {
            breach.module('core').call('tabs_new_tab_url', {
                url: 'http://127.0.0.1:' + port + '/'
            }, function(err) {
                console.log('New tab page set! [' + err + ']');
            });
            return next();
        });

        breach.expose('kill', function(args, next) {
            process.exit(0);
        });

        console.log('Exposed: `http://127.0.0.1:' + port + '/newtab`');
    });
};

(function setup() {
    var app = express();

    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/dist'));

    app.use('/', function(req, res, next){
        res.render('index', {
            name: config.name,
            version: config.version
        });
    });

    var server = http.createServer(app).listen(0, '127.0.0.1');

    server.on('listening', function() {
        var port = server.address().port;
        return bootstrap(port);
    });
})();
