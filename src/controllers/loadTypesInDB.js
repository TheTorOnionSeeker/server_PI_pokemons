const axios = require('axios');
const { URL_TYPE } = require('../constantData.js');
const { Type } = require('../db.js');

async function loadTypesInDB() {

    try {

        const initTypesByAPI = await axios.get(URL_TYPE);

        const dataResultsTypesByAPI = await initTypesByAPI.data.results;

        let newType = {};

        for (let i = 0; i < dataResultsTypesByAPI.length; i++) {

            newType = {
                id: i,
                name: dataResultsTypesByAPI[i].name
            }

            await Type.create(newType);
        }

        console.log('Charged API pokemons types in DB')

    } catch (error) {

        console.log({err:error.message,message:'Error with charge de API pokemons types in DB'});
    }
}

module.exports = {
    loadTypesInDB,
};