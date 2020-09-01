import React from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import CanvasJSReact from './canvasjs.react.js';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Test extends React.Component {
  constructor(props) {
    super(props);

    this.charstats = {};
    this.bicharstats = {};

    this.options1 = {};
    this.options2 = {};
    this.state = ({
      all: [],
      word: [],
      correct: [],
      text: '',
      times: [],
      prev: 0,
      avg: 0,
      stats: false,
      prevChar: [],
      charhtml: '<></>',
    });
  }

  componentDidMount = () => {
    

    fetch('/dictFreq.tsv')
    .then((r) => r.text())
    .then(text => {
      var all = [];
      var data = text.split('\n');
      for(var i = 0; i < data.length; i++) {
        var line = data[i].split('\t');
        try{
          var w = line[1].split("");
          all.push({
            word: line[1].split(""),
            freq: line[2]
          })
        } catch {
          console.log('couldn\'t split: ' + line[1])
        }
        
      }
      this.setState({
        all: all
      }, this.newWord(all))
    });

    document.getElementById("filled-basic").focus()
  }

  newWord = (all) => {
    
    var num = Math.floor(Math.random() * all.length);
    console.log(num)
    console.log(all[num])
    this.setState({
      word: all[num]['word']
    }, function() {
      var c = []
      for(var i = 0; i < this.state.word.length; i++) {
        c.push("black")
      }
      this.setState({
        correct: c
      });
    });

    // var time = new Date();
    // var times = this.state.times
    // if(this.state.prev == 0){
    //   // do nothing
    // } else {
    //   var t1 = time.getTime()
    //   times.push(t1 - this.state.prev)
    //   this.setState({
    //     prev: t1,
    //     times: times
    //   });
    // }
    var times = this.state.times
    var count = 0;
    console.log(times)
    for(var i = 0; i < times.length; i++) {
      for(var j = 0; j < times[i].length; j++) {
        count = count + times[i][j];
      }
    }
    var mean = ((count / times.length) / 1000);
    
    this.setState({
      avg: mean.toFixed(2)
    });
    
    if(times.length == this.props.num) {
      this.setState({
        stats: true
      })
      this.setHtml();
    }
  }



  onKey = (e) => {
    
    console.log('in key')
    if(e.keyCode != 8 && e.keyCode != 46) {
      var time = new Date();
      var t1 = time.getTime();
      var times = this.state.times;
      if(this.state.prev == 0) {
        times.push([])
      } else {
        console.log(e.key);
        var cs = this.charstats
        var p = this.state.prev;
        var pc = this.state.prevChar;
        if(pc.length === 2) {
          pc.shift()
        }
        var d = {};
        d[e.key] = t1-p;
        pc.push([e.key, t1-p]);
        if(pc.length > 1) {
          var bcs = this.bicharstats;
          var bigram = pc[0][0] + pc[1][0]
          var bitime = parseFloat(pc[0][1]) + parseFloat(pc[1][1]);
          if(bigram in bcs) {
            var bichar = bcs[bigram];
            bichar.push(bitime)
            bcs[bigram] = bichar
          } else {
            bcs[bigram] = [bitime]
          }
        }
        
        if(e.key in cs) {
          var char = cs[e.key];
          char.push(t1-p);
          cs[e.key] = char
        } else {
          cs[e.key] = [t1-p]
        }
        this.charstats = cs;
        
        if(this.state.text.length == 0) {
          times.push([t1-p]);
        } else {
          times[this.state.times.length-1].push(t1-p)
        }
        
      }

      console.log(this.charstats)
      this.setState({
        prev: t1
      })
      var t = this.state.text
      
      var c = this.state.correct;
      if(e.key == this.state.word[t.length]) {
        c[t.length] = "green"
        this.setState({
          text: t+e.key
        });
      } 
    
   
    
      if(!c.includes("black") && !c.includes("red")) {
        this.newWord(this.state.all)
        this.setState({
          text: '',
          correct: c
        })
      }
    }
  }
    

  findMean = (array) => {
    var sum = 0;
    for(var i = 0; i < array.length; i++) {
      sum = sum + array[i];
    }
    return (sum / array.length).toFixed(2);
  }

  setHtml = () => {
    console.log(this.bicharstats)
    var dict = this.charstats;
    var newDict = {}
    for(var key in dict) {
      newDict[key] = this.findMean(dict[key]);
    }
    console.log(newDict)
    var sorted = this.sortJsObject(newDict);
    console.log('new dict')
    console.log(newDict)
    var h = ''
    sorted.map((element, index) => {
      h = h + `<p>${element[0]}: ${element[1]}</p>`
    })
    this.setState({
      charhtml: h
    })
    var datapoints = [];
    for(var i = 0; i < sorted.length; i++) {
      
      datapoints.push({ label: sorted[i][0], y: parseFloat(sorted[i][1])})
    }
    console.log(datapoints)
    this.options1 = {
        title: {
            text: "Character Level Stats"
        },
        axisX: {
          title: 'Character'
        }, 
        axisY: {
          title: 'Milliseconds'
        },
        data: [
          {
              indexLabelFontSize: 10,
              type: 'column',
              dataPoints: datapoints
              
          }
        ]
    }


    var dict = this.bicharstats;
    var newDict = {}
    for(var key in dict) {
      newDict[key] = this.findMean(dict[key]);
    }
    console.log(newDict)
    var sorted = this.sortJsObject(newDict);
    console.log('new dict')
    console.log(newDict)
    var h = ''
    sorted.map((element, index) => {
      h = h + `<p>${element[0]}: ${element[1]}</p>`
    })
    this.setState({
      charhtml: h
    })
    var datapoints = [];
    for(var i = 0; i < sorted.length; i++) {
      
      datapoints.push({ label: sorted[i][0], y: parseFloat(sorted[i][1])})
    }
    console.log(datapoints)
    this.options2 = {
        title: {
            text: "Bigram Stats"
        },
        axisX: {
          title: 'Bigram'
        }, 
        axisY: {
          title: 'Milliseconds'
        },
        data: [
          {
              indexLabelFontSize: 10,
              type: 'column',
              dataPoints: datapoints
              
          }
        ]
    }
    let historicalstats = {
      username: this.props.username,
      data: {
        unigram: this.charstats,
        bigram: this.bicharstats,
        times: this.state.times
      }
    }
    console.log(this.props.username)
    axios.post('http://localhost:9000/', historicalstats)
  }

  sortJsObject = (dict) => {
      
    var keys = [];
    for(var key in dict) { 
      keys[keys.length] = key;
    }

    var values = [];     
    for(var i = 0; i < keys.length; i++) {
      values[values.length] = dict[keys [i]];
    }

    var sortedValues = values.sort(this.sortNumber);
    console.log(sortedValues);

    var sorted = []
    for(var i = 0; i < sortedValues.length; i++) {
      for(var k in dict) {
        if(dict[k] == sortedValues[i]) {
          sorted.push([k, sortedValues[i]])
        }
      }
    }
    return sorted;
  } 

  // this is needed to sort values as integers
  sortNumber = (a,b) => {
    return a - b;
  }


  render() {
    
    var checker = this.state.word.map((element, index) => {
      return(
      <p
      id={`let${index + 1}`}
      style={{color: this.state.correct[index], display: 'inline-block'}}>
        {element}
      </p>
      );
    })
  

    
    return (
        <>
        <Button variant="contained" onClick={this.props.changeDisplay}>Back</Button>
        
        <div style={{margin: 'auto'}}>
        {!this.state.stats && 
        <>
          {checker}
          <br />
          <TextField 
            style={{ color: 'white' }} 
            id="filled-basic" 
            label="text" 
            multiline
            // onChange={this.change}
            onKeyDown={this.onKey}
            rows={4}
            variant="filled"
            value={this.state.text}
            />
            </>
          }
          {this.state.stats &&
          <>
          <p>Results: </p>
          
          </>
          }
            <p>
              Seconds per word: 
              {this.state.avg}
            </p>
            <p>
              Words per minute:
              {(60 / this.state.avg).toFixed(2)}
            </p>
            {/* {this.state.stats &&
            <div dangerouslySetInnerHTML={{ __html: this.state.charhtml }} />
            } */}
            {this.state.stats &&
            <>
            <div style={{ margin: '50px'}}>
              <CanvasJSChart options = {this.options1} />
            </div>
            <div style={{ margin: '50px'}}>
              <CanvasJSChart options = {this.options2} />
            </div>
            </>
            }
          
        </div>
        
        
        </>
    );
  }
}

