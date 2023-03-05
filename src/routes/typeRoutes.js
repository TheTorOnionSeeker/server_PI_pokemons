const { Router } = require('express');
const router = Router();

const { GetAllTypes } = require('../controllers/controllerTypes.js');

router.get('/', GetAllTypes/* (req,res)=>
{   try {
    let result=GetAllTypes(req,res);
    res.status(200).json(result);
} catch (error) {
    res.status(404).json({message:'Types not found!'});
}
} */
);


module.exports = router;