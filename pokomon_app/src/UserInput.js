import './UserInput.css';
import React, {Component} from 'react';
const ApiService = require('./ApiService');


class UserInput extends Component {

    constructor(props){
        super(props);
        this.state = {pokomonName: ''};

        this.handleStateChange = this.handleStateChange.bind(this);
        this.output = this.output.bind(this);
    }

    handleStateChange(event){
        this.setState({pokomonName: event.target.value});
        // console.log(`Name: ${this.state.pokomonName}`);
    }

    output(event){
        event.preventDefault();
        console.log(`Name Log: ${this.state.pokomonName}`);
        ApiService.apiCall(this.state.pokomonName);
    }

    render() {
        return (
        <div className="inputArea">
          <p><u>Pokomon Api</u></p>
          <form>
            <input className="nameTxt" onChange={this.handleStateChange} type="text"/>
            <button className="enterBtn" onClick={(event) => {this.output(event)}} type="submit">Get</button>
          </form>
          
        </div>);
    };


}

export default UserInput;
