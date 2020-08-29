import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'

export default class Test extends React.Component {
  constructor(props) {
    super(props);
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

  // change = (e) => {
  //   if(this.state.prev == 0) {
  //     var time = new Date();
  //     var t1 = time.getTime();
  //     this.setState({
  //       prev: t1
  //     })
  //   }

  //   var text = e.target.value
  //   this.setState({
  //     text: e.target.value
  //   })
  //   for(var i = 0; i < this.state.word.length; i++) {
  //     var key = text[i];
  //     var c = this.state.correct;
  //     if(text.length-1 < i) {
  //       c[i] = "black"
  //     } else if(key == this.state.word[i]) {
  //       c[i] = "green";
  //     } else {
  //       c[i] = "red"
  //     }
      
  //   }
  //   if(!c.includes("black") && !c.includes("red")) {
  //     this.newWord(this.state.all)
  //     this.setState({
  //       text: '',
  //       correct: c
  //     })
  //   }

  // }



  onKey = (e) => {
    
    
    
    if(e.keyCode != 8 && e.keyCode != 46) {
      var time = new Date();
      var t1 = time.getTime();
      var times = this.state.times;
      if(this.state.prev == 0) {
        times.push([[]])
      } else {
        var p = this.state.prev;
        times[this.state.times.length-1].push(t1-p)
      }

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
    }
   
    
    if(!c.includes("black") && !c.includes("red")) {
      this.newWord(this.state.all)
      this.setState({
        text: '',
        correct: c
      })
    }
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
        </div>
        
        
        </>
    );
  }
}

