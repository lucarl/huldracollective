const express = require('express');
const app = express();
var bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const path = require('path');

const creds = require('./client_secret.json')

const fs = require('fs');
const http = require('http');
const https = require('https');

//testing
// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/huldracollective.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/huldracollective.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/huldracollective.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use((req, res) => {
	res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var information = {}

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

/*app.get('/.well-known/acme-challenge', (req,res) => {
  res.send({ express: '3e-OYSuCvGwxlp4grPhBhFx5Eu5FG_nn0C7mmGZ6pDQ.31evO60z7E6d-CuygpDNYFb5XjoRjRHwQyyZPq3GIZA'})
  
});*/ 

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet('1nnhZboHVmk0NXOvAvcgqm15x1CNSJf_2ap6Apd_0h6s')
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  
  /*const rows = await promisify(sheet.getRows)({
      offset: 1
  })

  rows.array.forEach(row => {
      printStudent(row);
  });*/

  const row = information

  await promisify(sheet.addRow)(row)
}

app.post('/submit', function(req, res, next){
  const newInformation = {
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    personalnumber: req.body.personalNumber,
    email: req.body.eMail
  };
  information = newInformation
  console.log(information)
  accessSpreadsheet();
});