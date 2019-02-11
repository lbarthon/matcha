var express = require('express');
var path = require('path');

var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

var routes = require('./server/routes.js');
var bodyParser = require('body-parser');

var port = 3000;

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/css/*.css', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/', req.originalUrl));
});

app.get('/js/*.jsx?', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', req.originalUrl));
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
	console.log("API listening on port " + port + "!");
})
