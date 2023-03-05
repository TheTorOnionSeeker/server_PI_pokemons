const axios = require('axios');

const { Pokemon, Type } = require('../db.js');
const { URL_POKEMON, VARIABLE_LIMITE } = require('../constantData.js');

async function FilterForType(req,res) {

    try {

   //get DB pokemons
   const DBpokemons = await Pokemon.findAll({
    attributes: ["id", "name", "image"],
    include: [
        { model: Type, attributes: ["name"], through: { attributes: [] } },
    ]
    });

        //get API pokemons - first link

        const initPokemons = (await axios.get(`${URL_POKEMON}?offset=0&limit=${VARIABLE_LIMITE}`)).data.results;

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
                            image: e.data.sprites.other.dream_world.front_default,
                            Types: [{ name: e.data.types[0].type.name },
                                    { name: e.data.types[1]?.type.name }]
                         };
                });
            

            let pokemonsDBAndAPI=[];
            let pokemonFiltered=[];

            if(req.query.filter === "api") pokemonsDBAndAPI = [...pokemonsArray];                
            
            if(req.query.filter === "db") pokemonsDBAndAPI = [...DBpokemons];

            if(req.query.filter === "all" || !req.query.filter)  pokemonsDBAndAPI = [...DBpokemons, ...pokemonsArray];
                      
        
            if(pokemonsDBAndAPI) {
                
                pokemonFiltered=pokemonsDBAndAPI.filter(elem => 
            
                (elem.Types[0].name === req.query.type)
                ||(elem.Types[1]?.name === req.query.type));
            }
           
            if(pokemonFiltered.length === 0) return res.status(404).json('Pokemons not found!');

            res.status(200).json(pokemonFiltered);

        })
    
        } catch (error) {

            res.status(404).json('Pokemons not found!');
    }

}


// pokemon API detail info
/* const pokemonDetail = function (infoAPI) {

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
} */

module.exports = {
   FilterForType
};