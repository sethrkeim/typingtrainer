const express = require('express')
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");

var logger = require("morgan");
const app = express()
const port = 9000
const fs = require('fs');
var cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

app.post('/', function (req, res, next) {
  // console.log(req.body)
  console.log(req.body.username)
  var data = req.body.data;
  var username = req.body.username;
  const path = '~/Documents/projects/typing_trainer/api/' + username + '.json'
  try {
    if (fs.existsSync(path)) {
      //file exists
    } else {
      console.log('doesnt exist')
      data = JSON.stringify(data);
      fs.writeFileSync(username+'.json', data);
    }
  } catch(err) {
    console.error(err)
    
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
