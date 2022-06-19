import './UserInput.css';
import React, {Component} from 'react';

// import {Routes, Route, useNavigate} from 'react-router-dom';
// const ApiService = require('./ApiService');

function PokomonNotFound(){
    return(
        <div> 
            <p>Pokomon Not Found. Please try again </p>
        </div>
    );
}

function getPokomonStats(stats){
    var rows = [];
    var length = Object.keys(stats).length;
    for(let i=0; i<length ; i++){
        rows.push([stats[i].stat, stats[i].base_stat, stats[i].effort]);
    }
    return rows;
}


function Output(pokomon){
    console.log(pokomon);

    console.log(pokomon.stats.pokomonStat[1].effort)

    const pokomonStats = getPokomonStats(pokomon.stats.pokomonStat);

    return(
        <div className="pokomon-stats">
            <img className="pokomon-sprite"src={pokomon.stats.img} alt="pokomon" height="150" width="150"></img>
            <p>Name:<b>{pokomon.stats.name}</b></p>
            <p>Height:<b> {pokomon.stats.height}</b></p>
            <p>Weight:<b> {pokomon.stats.weight}</b></p>
            <p>Apperenceses:<b> {pokomon.stats.gameApperenceCount}</b></p>
            <p><u>Stats</u></p>
            <ul>
                {pokomonStats.map(stats => (
                    <p><b>{`Name: ${stats[0]}, Base Stat: ${stats[1]}, Effort: ${stats[2]}`}</b></p>
                ))}
            </ul>
        </div>
    );
}

class UserInput extends Component {

    constructor(props){
        super(props);
        //different states to check for output, error and name
        this.state = {pokomonName: '', isNotFound: false, hasData: false};
        //The pokomons states from api call
        this.pokomonStats = {
            name: '',
            height: 0,
            weight: 0,
            img: '',
            pokomonStat:{},
            gameApperenceCount: 0,
        }

        this.handleStateChange = this.handleStateChange.bind(this);
        this.apiCall = this.apiCall.bind(this);
    }

    handleStateChange(event){
        this.setState({pokomonName: event.target.value});
    }

    processData(data){
        this.pokomonStats.name = data.name;
        this.pokomonStats.height = data.height;
        this.pokomonStats.weight = data.weight;
        this.pokomonStats.img = data.sprites.front_default;
        for(let i = 0; i < data.stats.length; i++){
            this.pokomonStats.pokomonStat[i] = {
                stat: data.stats[i].stat.name,
                base_stat: data.stats[i].base_stat,
                effort: data.stats[i].effort
            }
        }
        
        this.pokomonStats.gameApperenceCount = data.game_indices.length;
        this.setState({hasData: true});
    }

    apiCall(event){
        //Stops page from refreshing
        event.preventDefault();
        //Set found to false as default before each call 
        this.setState({isNotFound: false});
        //Make fetch request to this url
        fetch(`https://pokeapi.co/api/v2/pokemon/${this.state.pokomonName.toLowerCase()}`)
            .then(response => response.json()) //get response in json format
            .then(result => { //process result
                this.processData(result);
            },
            (error) => {
                console.log(error);
                this.setState({isNotFound: true});
            }
        )
    }

    render() {
        const isNotFound = this.state.isNotFound;
        const hasData = this.state.hasData;

        let error, output;
        if(isNotFound){
            console.log("error");
            error = <PokomonNotFound/>
        }
        if(hasData){
            console.log("output");
            output = <Output stats={this.pokomonStats}/>

        }

        return (
            <div className="inputArea">
                <h2><u>Pokomon Api</u></h2>
                <form>
                    <input className="nameTxt" onChange={this.handleStateChange} type="text"/>
                    <button className="enterBtn" onClick={(event) => {this.apiCall(event);}} type="submit">Get</button>
                </form>
                {error}
                {output}
            </div>
        );
    };
}

export default UserInput;
