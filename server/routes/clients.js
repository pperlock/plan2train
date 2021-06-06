const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Client = require('../models/client');

/* =========================================== GET A SINGLE CLIENT FOR CLIENT SIDE ================================================ */

router.get('/:userId', (req, res) => {

    Client.findOne({userId:req.params.userId}) //asynchronous
    .then((response)=>{
         res.send(response);
    })
    .catch((err) =>{
        console.log(err)
    });
});

/* =========================================== CHECK USER NAME ================================================ */

router.get('/checkUsername/:username', (req,res)=>{
    
    User.findOne({username:req.params.username}, async(err,doc)=>{
         if (err) throw err;
 
         //sends true back if the username already exists
         if (doc) {
             res.send(true);
         }
         
          //sends false back if the username doesn't exist
         if(!doc){
             res.send(false);
         }
     });
 });

/* =========================================== DELETE CLIENT ================================================ */

router.delete('/:clientId', (req,res)=>{
    Client.deleteOne({userId:req.params.clientId})
    .catch(err=>{
        console.log(err);
    })

    User.deleteOne({userId:req.params.clientId})
    .then(userRes=>{
        res.send("Client successfully deleted");
    })
    .catch(err=>{
        console.log(err);
    })
})

/* =========================================== UPDATE CLIENT DETAILS ================================================ */
router.put('/:clientId/updateDetails', (req,res)=>{

    Client.findOne({userId:req.params.clientId}) 
    .then((response)=>{
       
        response.userProfile = req.body;

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

/* =========================================== ADD CLIENT NOTE ================================================ */

router.post(`/:clientId/addNote`, (req, res)=>{

    const newNote = req.body.note;

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        response.notes=newNote;

        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends back the updated client
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

/* =========================================== UPDATE CLIENT PROGRAMS ================================================ */
router.put('/:clientId/updatePrograms', (req,res)=>{
    //create a new instance of a document (variable name can be anything) and save that it in the database - .POST?

    Client.findOne({userId:req.params.clientId}) 
    .then((response)=>{
    
        response.programs = req.body;

        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response.programs);
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