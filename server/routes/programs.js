const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Program = require('../models/program');

/* =========================================== UPDATE PROGRAM ================================================ */
router.post('/:programId/updateProgram', (req,res)=>{
    //create a new instance of a document (variable name can be anything) and save that it in the database - .POST?

    const {name, description} = req.body;
    //"--id" is auto generated - not a string in mongoDB - mongoose handles the conversion from to a string and then back again

    Program.findOne({id:req.params.programId}) //asynchronous
    .then((response)=>{
        response.name = name;
        response.description=description;

        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });

})

/* =========================================== DELETE PROGRAM ================================================ */

router.delete('/:programId', (req,res)=>{
    Program.deleteOne({id:req.params.programId})
    .then(response=>{
        res.send("Program successfully deleted");
    })
})

/* =========================================== ADD RESOURCE ================================================ */
router.post('/:programId/addResource', (req,res)=>{

    const {name, url, type} = req.body;

    const newResource = {
        id:uuidv4(),
        name,
        url,
        type
    }

    Program.findOne({id:req.params.programId}) //asynchronous
    .then((response)=>{
        response.resources.push(newResource);
        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });

})

/* =========================================== DELETE RESOURCE ================================================ */

router.delete('/:programId/:resourceId', (req,res)=>{
    Program.findOne({id:req.params.programId}) //asynchronous
    .then((response)=>{

        //find the index of the resources array to update
        let foundIndex;
        response.resources.filter((item, index) => { foundIndex = index; return item.id == req.params.resourceId; });
        
        response.resources.splice(foundIndex, 1);
        
        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})


module.exports = router;