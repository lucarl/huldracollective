const express = require('express');
const app = express();
var bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const path = require('path');

const creds = require('./client_secret.json')


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