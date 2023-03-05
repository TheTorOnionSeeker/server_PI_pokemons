const { Router } = require('express');
const router = Router();

const {New, GetAll, SearchById, SearchByName} = require('../controllers/controllerPokemon.js');
const {FilterForType} = require('../controllers/controllerFilters.js');


//Pokemon --> NEW
router.post('/', New/* (req,res)=>{
    let {name, hp, attack, defense, speed, height, weight, image, type} = req.body;
    try {
    let result=New(name, hp, attack, defense, speed, height, weight, image, type);
    res.status(201).json(result);
    } catch (error) {
    res.status(404).json({message:'Pokemon NOT CREATED!'});
    }
} */);

//Pokemon --> NAME
router.get('/name/:name', SearchByName/* (req,res)=>{
    let {name}=req.params.name;
    try {
        let result=SearchByName(name);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message:`Pokemon name:${name} not found!`});
    }
} */);

//Pokemon --> Filter for Type
router.get('/filters/', FilterForType/* (req,res)=>{
    let {filter, type}=req.query;
    try {
        let result=FilterForType(filter, type);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
} */);

//Pokemon --> ID
router.get('/:id', SearchById/* (req,res)=>{
    let {id}=req.params.id;
    try {
        let result=SearchById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message:`Pokemon ID : ${id} not found!`});
    }
} */);

//Pokemon --> todos
router.get('/', GetAll/* (req,res)=>
{ try {
    let result=GetAll();
    res.status(200).json(result);
} catch (error) {
    res.status(404).json(error.message);
}
} */
);

module.exports = router;