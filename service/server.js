
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors());


// var keycloakConfig = {
//     "realm": "myrealm",
//     "bearer-only": true,
//     "auth-server-url": "http://localhost:8081/",
//     "ssl-required": "external",
//     "resource": "node-microservice",
//     //"confidential-port": 0
//   }


const memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({
  store: memoryStore
});

//}, keycloakConfig);

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

app.get('/service/public', function (req, res) {
  res.json({message: 'public'});
});

app.get('/service/protect', keycloak.protect(), function (req, res) {
    res.json({message: 'protect'});
  });

app.get('/service/secured', keycloak.protect('user'), function (req, res) {
  res.json({message: 'secured'});
});

app.get('/service/admin', keycloak.protect('admin'), function (req, res) {
  res.json({message: 'admin'});
});

app.get('/service/all', keycloak.protect(['user', 'admin']), function (req, res) {
    res.json({message: 'all'});
  });

app.use('*', function (req, res) {
  res.send('Not found!');
});

app.listen(5000, function () {
  console.log('Started at port 5000');
});
