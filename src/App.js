import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TextField } from '@material-ui/core'
import { tsImportEqualsDeclaration } from '@babel/types';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = ({
      all: [],
      word: [],
      correct: [],
      text: '',
      times: [],
      prev: 0,
      avg: 0
    });
  }

  componentDidMount = () => {
    

    fetch('/dictFreq.tsv')
    .then((r) => r.text())
    .then(text => {
      var all = [];
      var data = text.split('\n');
      // var line = data[0].split("\t")
      // console.log(line[1].split(""));
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
      console.log(this.state.all[1]['word'])
    });

    
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

    var time = new Date();
    if(this.state.prev == 0){
      var t1 = time.getTime();
      this.setState({
        prev: t1
      })
    } else {
      var times = this.state.times
      var t1 = time.getTime()
      times.push(t1 - this.state.prev)
      this.setState({
        prev: t1,
        times: times
      });
    }
    var count = 0;
    for(var i = 0; i < this.state.times; i++) {
      count = count + this.state.times[i];
    }

    this.setState({
      avg: ((count / this.state.times.length) / 1000)
    })
    console.log(this.state.times)
  }

  change = (e) => {
    var text = e.target.value
    this.setState({
      text: e.target.value
    })
    for(var i = 0; i < this.state.word.length; i++) {
      var key = text[i];
      var c = this.state.correct;
      if(text.length-1 < i) {
        c[i] = "black"
      } else if(key == this.state.word[i]) {
        c[i] = "green";
      } else {
        c[i] = "red"
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
      <div className="App" style={{ height:'1000px', width: '100%'}}>
        
        <div style={{margin: 'auto', marginBottom: '50vh', paddingTop: '300px'}}>
          {checker}
          <br />
          <TextField 
            style={{ color: 'white' }} 
            id="filled-basic" 
            label="text" 
            multiline
            onChange={this.change}
            rows={4}
            variant="filled"
            value={this.state.text}
            />
            <p>
              Seconds per word: 
              {this.state.avg}
            </p>
        </div>
      </div>
    );
  }
}

