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
  if(!req.body.getData) {
    console.log(req.body.username)
    var data = req.body;
    var username = req.body.username;
    const path = username + '.json'
    try {
      if (fs.existsSync(path)) {
        console.log('\n\nexists and writing')
        var newdata = {
          
        }
        let rawdata = fs.readFileSync(username+'.json')
        rawdata = JSON.parse(rawdata);
        // console.log(rawdata)
        for(var key in rawdata) {
          console.log('times')
          if(key != 'times') {
            for(var subkey in rawdata[key]) {
           
              newdata[key] = rawdata[key][subkey];
            }
            for(var subkey in data['data'][key]) {
              if(subkey in newdata[key]) {
                var currlist = newdata[key][subkey]
                // console.log('currlist')
                // console.log(currlist)
                // console.log('other list')
                // console.log(data['data'][key][subkey])
                currlist = currlist.concat(data['data'][key][subkey])
                newdata[key][subkey] = currlist
              } else {
                newdata[key][subkey] = data['data'][key][subkey]
              }
            }
          } else {
            console.log('times')
            console.log(rawdata['times'])
            console.log(data['data']['times'])
            var currlist = rawdata['times'];
            currlist = currlist.concat(data['data']['times']);
            newdata['times'] = currlist;
          }
        }
        console.log('newdata')
        console.log(newdata)
        newdata = JSON.stringify(newdata);
        fs.writeFileSync(username+'.json', newdata)
      } else {
        // console.log('\n\ndoesnt exist and writing')
        data = JSON.stringify(data['data']);
        // console.log(data)
        fs.writeFileSync(username+'.json', data);
      }
    } catch(err) {
      console.error(err)
    }
  } else {
    
    const path = req.body.username + '.json'

    try {
      if (fs.existsSync(path)) {
        console.log('\n\nexists and getting')
        let rawdata = fs.readFileSync(req.body.username+'.json')
        rawdata = JSON.parse(rawdata);
        console.log(rawdata)
        res.send(rawdata);
      } else {
        console.log('\n\ndoesnt exist and getting')
        let rawdata = {
          data: {
            getData: false
          }
        }
        res.send(rawdata);
      }
    } catch(err) {
      console.error(err);
    }
    
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
