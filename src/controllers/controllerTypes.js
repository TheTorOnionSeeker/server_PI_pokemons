const { Type } = require('../db.js');

//get all pokemon types of DB
async function GetAllTypes(req, res) {

    try {
        //find in DB types, only show id and name attributes
        let type=await Type.findAll({
            attributes: ["id" , "name"]
        });
        res.status(200).json(type);

    } catch (error) {

        res.status(404).json('Types not found!');
    }
}

module.exports = {
    GetAllTypes,
};