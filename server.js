const express = require('express');
const path = require('path');

const app = express();
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const middleware = webpackMiddleware(compiler, {
	serverSideRender: true,
	publicPath: webpackConfig.output.publicPath
});

const routes = require('./server/routes.js');
const bodyParser = require('body-parser');

const port = 3000;

app.use(middleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use('/js', express.static(path.join(__dirname, 'public/js')));

app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, err => {
    if (err) console.error(err);
    console.log("App listening on port " + port + "!");
})
