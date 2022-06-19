import './UserInput.css';
import React, {Component} from 'react';

// import {Routes, Route, useNavigate} from 'react-router-dom';
// const ApiService = require('./ApiService');

//Name: PokemonNotFound
//Description: Returns not found text to the screen
//Parameters: none
//returns: <div>
function PokemonNotFound(){
    return(
        <div> 
            <p className="not-found">pokemon Not Found. Please try again </p>
        </div>
    );
}

//Name: getpokemonStats
//Description: returns 2d array of pokemon stats
//Parameters: Json object
//returns: 2d array
function getpokemonStats(stats){
    var rows = [];
    //Get length
    var length = Object.keys(stats).length;
    //Loop over number of stats
    for(let i=0; i<length ; i++){
        rows.push([stats[i].stat, stats[i].base_stat, stats[i].effort]);
    }
    return rows;
}

//Name: Output
//Description: Returns details on the pokemon
//Parameters: Json object
//returns: <div>
function Output(pokemon){
    const pokemonStats = getpokemonStats(pokemon.stats.pokemonStat);

    return(
        <div className="pokemon-stats">
            <img className="pokemon-sprite"src={pokemon.stats.img} alt="pokemon" height="150" width="150"></img>
            <p>Name:<b>{pokemon.stats.name}</b></p>
            <p>Height:<b> {pokemon.stats.height}</b></p>
            <p>Weight:<b> {pokemon.stats.weight}</b></p>
            <p>Apperenceses:<b> {pokemon.stats.gameApperenceCount}</b></p>
            <p><u>Stats</u></p>
            
            {pokemonStats.map(stats => (
                <p><b>{`Name: ${stats[0]}, Base Stat: ${stats[1]}, Effort: ${stats[2]}`}</b></p>
            ))}
            
        </div>
    );
}

//Name: UserInput
//Description: Class that renders user input fields and displays pokemon data
class UserInput extends Component {

    constructor(props){
        super(props);
        //different states to check for output, error and name
        this.state = {pokemonName: '', isNotFound: false, hasData: false};
        //The pokemons states from api call
        this.pokemonStats = {
            name: '',
            height: 0,
            weight: 0,
            img: '',
            pokemonStat:{},
            gameApperenceCount: 0,
        }

        this.handleStateChange = this.handleStateChange.bind(this);
        this.apiCall = this.apiCall.bind(this);
    }

    //Name: handleStateChange
    //Description: Reads from text input field
    //Parameters: event handle
    //returns: none
    handleStateChange(event){
        this.setState({pokemonName: event.target.value});
    }

    //Name: processData
    //Description: Processes pokemon data into new formatted json object
    //Parameters: Json object
    //returns: none
    processData(data){
        this.pokemonStats.name = data.name;
        this.pokemonStats.height = data.height;
        this.pokemonStats.weight = data.weight;
        this.pokemonStats.img = data.sprites.front_default;
        for(let i = 0; i < data.stats.length; i++){
            this.pokemonStats.pokemonStat[i] = {
                stat: data.stats[i].stat.name,
                base_stat: data.stats[i].base_stat,
                effort: data.stats[i].effort
            }
        }
        
        this.pokemonStats.gameApperenceCount = data.game_indices.length;
        this.setState({hasData: true});
    }

    //Name: apiCall
    //Description: Makes call to pokemon api to get data
    //Parameters: event handle
    //returns: none
    apiCall(event){
        //Stops page from refreshing
        event.preventDefault();
        //Set found to false as default before each call 
        this.setState({isNotFound: false});
        //Make fetch request to this url
        fetch(`https://pokeapi.co/api/v2/pokemon/${this.state.pokemonName.toLowerCase()}`)
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
        //check for if pokomon is found 
        const isNotFound = this.state.isNotFound;
        //check for pokemon data
        const hasData = this.state.hasData;
        //error and output functional components
        let error, output;

        if(isNotFound){
            error = <PokemonNotFound/>
        }

        if(hasData){
            output = <Output stats={this.pokemonStats}/>
        }

        return (
            <div className="inputArea">
                <h2><u>Pokemon Api</u></h2>
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
