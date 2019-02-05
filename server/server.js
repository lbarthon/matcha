var express = require('express');
var app = express();
var routes = require('./routes.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(3000, () => console.log("App listening on port 3000!"))