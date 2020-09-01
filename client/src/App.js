import React from 'react';
import Test from './test'
import { Button } from '@material-ui/core'
import { TextField } from '@material-ui/core'

export default class App extends React.Component {
    constructor() {
        super()
        this.state = ({
            toDisplay: false,
            num: 0,
            disUser: true,
            username: ''
        })
    }

    change = (e) => {
        this.setState({
            num: e.target.value
        })
    }

    submit = () => {
        console.log(this.state.num)
        if(this.state.num > 0) {
            console.log('in submit')
            this.setState({
                toDisplay: true
            })
        }
        
    }


    subUser = () => {
        this.setState({
            username: document.getElementById("username").value,
            disUser: false
        });
    }

    displayfalse = () => {
        this.setState({
            toDisplay: false
        })
    }

    render() {
        return (
            <>
            <p>{this.state.username}</p>
            <div className="App" style={{ paddingTop: '200px', width: '100%', textAlign: 'center'}}>
                
                {this.state.disUser  &&
                <>
                <TextField
                    label="username"
                    id="username"
                    name="username"
                    variant="filled"
                    type="text"
                />
                <Button variant="contained" onClick={this.subUser} style={{  margin: '10px'}}>Save</Button>
                </>
                }


                {(!this.state.toDisplay && !this.state.disUser) &&
                <>
                    <TextField
                    label="Number of words"
                    name="num"
                    variant="filled"
                    type="number"
                    onChange={this.change}
                    value={this.state.num}
                    required
                    />
                    <br />
                    <Button type="submit" variant="contained" onClick={this.submit} style={{  margin: '10px'}}>Start</Button>
                </>
                }
                {(this.state.toDisplay && !this.state.disUser) &&
                <Test username={this.state.username} changeDisplay={this.displayfalse} num={this.state.num} />
                }
            </div>
            </>
        );
    }
}
