const axios = require('axios');
const { Pokemon, Type } = require('../db.js');
const { URL_POKEMON, VARIABLE_LIMITE } = require('../constantData.js');


const { v1: uuidv1 } = require("uuid");

async function New(req,res) {
//POST: localhost:3001/pokemons/
    try {
        // get info of the body for create a new pokemon
        const { name, hp, attack, defense, speed, height, weight, image, type } = req.body;
      
        const newPokemon = await Pokemon.create({
            id: uuidv1(),
            name: name,
            hp: hp,
            attack: attack,
            defense: defense,
            speed: speed,
            height: height,
            weight: weight,
            image: image
        });

        const matchingTypes = await Type.findAll({
            where: {
                id: type,
            
            },
          });
      
        await newPokemon.setTypes(matchingTypes);
        
        res.status(201).json(newPokemon);

    } catch (error) {

        res.status(404).json('Error pokemon NOT created!');

    }
}

async function GetAll(req, res) {

    //http://localhost:3001/pokemons?name=name or http://localhost:3001/pokemons
    
    if (req.query.name) {   //evaluates if a name is received

        try {

            //search pokemon name in DB
         
            const pokemonDbFound = await Pokemon.findOne({
                where: { name: req.query.name },
                attributes: ["id", "name", "hp", "attack", "defense", "speed", "height", "image"],
                include: [
                    { model: Type, attributes: ["name"], through: { attributes: [] } },
                ]
            });

            //resolve DB's pokemon
            if (pokemonDbFound) return res.status(404).json(pokemonDbFound);

            //resolve API's pokemon    
            return res.status(200).json(Detail(await axios.get(`${URL_POKEMON}/${req.query.name}`)));

        } catch (error) {

            res.status(404).json(`Pokemon name: ${req.query.name} not found!`);
        }

    } else {

    try {

        //get DB pokemons
        const DBpokemons = await Pokemon.findAll({
            attributes: ["id", "name", "hp", "image"],
            include: [
                { model: Type, attributes: ["name"], through: { attributes: [] } },
            ]
        });

        //get API pokemons - first link
        const initPokemons = (await axios.get(`${URL_POKEMON}?offset=0&limit=${VARIABLE_LIMITE}`)).data.results

        let listpokemons = [];

        initPokemons.forEach(e => {
            let aux = e.url.slice(34, -1);
            listpokemons.push(axios.get(`${URL_POKEMON}/${aux}`));
        });

        Promise.all(listpokemons)
            .then((pokemon) => {
                let pokemonsArray = pokemon.map((e) => {
                    return {
                        id: e.data.id,
                        name: e.data.name,
                        hp: e.data.stats[0].base_stat,
                        image: e.data.sprites.other.dream_world.front_default,
                        Types: [{ name: e.data.types[0].type.name },
                                { name: e.data.types[1]?.type.name }]
                    };
                });

                const pokemonsDBAndAPI = pokemonsArray.concat(DBpokemons);
                res.status(200).json(pokemonsDBAndAPI);
            })
    } catch (error) {

        res.status(404).json('Pokemons not found!');
    }
}
}


async function SearchById(req,res) {

    try {

        // Search the pokemomn id in the DB

        let pokemonDbFound = await Pokemon.findOne({
            where: { id: req.params.id },
            attributes:["id", "name", "hp", "attack", "defense", "speed", "height", "image"],
            include: [
                { model: Type, attributes: ["name"], through: { attributes: [] } },
                ]
        });
     

       if (pokemonDbFound) return res.status(200).json(pokemonDbFound); // Exist id in DB -> Resolve

       res.status(200).json(Detail(await axios.get(`${URL_POKEMON}/${req.params.id}`)));
    
    } catch (error) {

        res.status(404).json(`Pokemon ID : ${req.params.id} not found!`);;
    
    }

}



async function SearchByName(name) {
  
    try {
        //search pokemon name in DB
        const pokemonDbFound = await Pokemon.findOne({
            where: { name: name },
            attributes:["id", "name", "hp", "attack", "defense", "speed", "height", "image"],
            include: [
                { model: Type, attributes: ["name"], through: { attributes: [] } },
              ]
        }) ;

        if (pokemonDbFound) return pokemonDbFound; //resolve DB's pokemon 
    
        //resolve API's pokemon 
        return Detail(await axios.get(`${URL_POKEMON}${name}`));

    } catch (error) {

        return error;
    }
}


//pokemon API detail info
const Detail = function (infoAPI) {

    return {
        id: infoAPI.data.id,
        name: infoAPI.data.name,
        hp: infoAPI.data.stats[0].base_stat,
        attack: infoAPI.data.stats[1].base_stat,
        defense: infoAPI.data.stats[2].base_stat,
        speed: infoAPI.data.stats[5].base_stat,
        height: infoAPI.data.height,
        weight: infoAPI.data.weight,
        image: infoAPI.data.sprites.other.dream_world.front_default,
        Types: [{name: infoAPI.data.types[0].type.name}, 
                {name: infoAPI.data.types[1]?.type.name}]
    }
   
}

module.exports = {
    New,
    GetAll,
    SearchById,
    SearchByName
};