const config = require('./server/config');
const db_infos = require('./server/database');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('./server/io').init(server);
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const notify = require('./server/user/notification/notify')

const prod = (process.env.PROD == "true" || false);
const port = (process.env.PORT || 3000);

process.on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
})
.on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
});

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
    key: 'session_cookie_name',
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 60 * 60 * 24 * 1000
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', socket => {
  let currentUserId;
  socket.on('disconnect', () => {
    console.log(currentUserId);
    // requete qui update la derniere connexion ici
  });
  socket.on('join', data => {
    currentUserId = data.id;
    socket.join(data.id);
  });
  socket.on('new_message', data => {
    io.sockets.in(data.to).emit('new_message', {roomId: data.roomId});
  });
  socket.on('is_online', data => {
    let online = io.sockets.adapter.rooms[data.userId] !== undefined ? true : false;
    socket.emit('is_online', online);
  });
});

app.use('/api', routes);

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(port, err => {
    if (err) console.error(err);
    console.log("App listening on port " + port + "!");
})
