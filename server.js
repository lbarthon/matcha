const config = require('./server/config');
const db_infos = require('./server/database');
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const ws = require('express-ws')(app);

const prod = (process.env.PROD == "true" || false);
const port = (process.env.PORT || 3000);


if (!prod) {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('./webpack.config.js');
    const compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, {
        serverSideRender: true,
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
}

const routes = require('./server/routes.js');

var sqlOptions = {
    host     : db_infos.db_host,
    port     : 3306,
    user     : db_infos.db_user,
    password : db_infos.db_pwd,
    database : db_infos.db_name
}
var sessionStore = new MySQLStore(sqlOptions)

app.set('trust proxy', 1);
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { 
        maxAge: 60 * 60 * 24
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.ws('/socket');

app.use('/api', routes);

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, err => {
    if (err) console.error(err);
    console.log("App listening on port " + port + "!");
})
