import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'

export default class Test extends React.Component {
  constructor(props) {
    super(props);

    this.charstats = {};


    this.state = ({
      all: [],
      word: [],
      correct: [],
      text: '',
      times: [],
      prev: 0,
      avg: 0,
      stats: false
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

    var dict = this.charstats
    
  
    

    function sortJsObject(dict) {
      
      var keys = [];
      for(var key in dict) { 
         keys[keys.length] = key;
       }
  
       var values = [];     
       for(var i = 0; i < keys.length; i++) {
           values[values.length] = dict[keys [i]];
       }
  
       var sortedValues = values.sort(sortNumber);
       console.log(sortedValues);
    } 
  
    // this is needed to sort values as integers
    function sortNumber(a,b) {
      return a - b;
    }


    var characterstats = () => {
      if(this.state.stats) {
        var newDict = {}
        for(var key in dict) {
          newDict[key] = this.findMean(dict[key]);
        }
        newDict = sortJsObject(newDict);
        Object.keys(newDict).map((key) => {
          return (
            <p>{key}: {newDict[key]}</p>
          )
        })

      } else {
        return (
          <></>
        )
      }
    }
    // if(this.state.stats) {
    //   var newDict = {};
    //   for(var key in dict) {
    //     var count = 0;
    //     for(var i = 0; i < dict[key].length; i++) {
    //       count = count + dict[key][i];
    //     }
    //     count = (count / dict[key].length).toFixed(2);
    //     newDict[key] = count;
    //   }
    //   newDict = sortJsObject(newDict);
    //   console.log(newDict);
    //   var characterstats = Object.getOwnPropertyNames(newDict).map(function(key) {
        
    //     return (
    //       <p>{key}: {newDict[key]}</p>
    //     );
    //   });
    // }
    
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
            {this.state.stats &&
            characterstats
            }
          
        </div>
        
        
        </>
    );
  }
}

