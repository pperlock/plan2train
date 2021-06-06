const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Trainer = require('../models/trainer');
const Program = require('../models/program');
const User = require('../models/user');
const Client = require('../models/client');

/* =========================================== GET TRAINER ================================================ */

router.get('/:trainerId', (req, res) => {

    let trainer = {userProfile:{}, programs:[] }

    Trainer.findOne({userId:req.params.trainerId}) //asynchronous
    .then((response)=>{
        trainer.userProfile = response;
            
            Program.find({trainerId:req.params.trainerId})
            .then((programRes)=>{
                trainer.programs=programRes
                res.status(200).send(trainer);
            })
        })
        .catch((err) =>{
            console.log(err)
        });

})

/* =========================================== UPDATE TRAINER DETAILS ================================================ */
router.put('/:trainerId/updateDetails', (req,res)=>{

    const hashPassword = async ()=>{
        const hashedPassword = await bcrypt.hash(req.body.contact.password, 10);
        return hashedPassword;
    }

    Trainer.findOne({userId:req.params.trainerId}) 
    .then((response)=>{
        //find the trainer and set the new values
        response.contact = req.body.contact;
        response.company = req.body.company;
        response.social = req.body.social;

        //save the updated trainer
        response.save()
        .then((response)=>{
            //once the trainer is updated, update the user collection
            User.findOne({userId:req.params.trainerId})
            .then(userResponse=>{

                //find the user and set the new username and password
                userResponse.username=req.body.contact.username;
                //userResponse.password=hashPassword();
                userResponse.password=req.body.contact.password;
                userResponse.save()
                .then(saveRes=>{
                    //once the user is saved, return the new profile from the Trainer document
                    res.send(response);
                })
                .catch((err)=>{
                    console.log(err);
                })  
            })
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

/* =========================================== UPDATE LOGO ================================================ */
router.put('/:trainerId/updateLogo', (req,res)=>{

    Trainer.findOne({userId:req.params.trainerId}) 
    .then((response)=>{
       
        //find the trainer and set the new values
        response.company.logo = req.body.logo;
    
        //save the updated trainer
        response.markModified('company');
        response.save()
        .then((response)=>{
            res.send(response.company.logo);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

/* =========================================== ADD CLIENT ================================================ */
router.post('/:trainerId/addClient', (req,res)=>{
    
    const {username,password,profile,status,userProfile, programs} = req.body;
    const date = new Date().getFullYear();
    const userId = uuidv4();

    User.findOne({username:username}, async(err,doc)=>{
        if (err) throw err;

        if (doc) {
            res.send("Username already exists");
        }

        if(!doc){
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = new User({
                userId:userId,
                username,
                password:hashedPassword,
                profile:"client"
            });

            const client = new Client({
                //pass an object with the different properties in the schema
                userId:userId,
                trainerId: req.params.trainerId,
                yearAdded: date,
                username,
                password:"",
                profile,
                status,
                userProfile,
                programs,
                lessons:[],
                notes:"",
                photos:[]
            });

            await newUser.save();
            await client.save();
            // loginResponse.loggedIn = true;
            res.send(client);
        }
    })
})

/* =========================================== GET CLIENTS ================================================ */

router.get('/:trainerId/clients', (req, res) => {

    Client.find({trainerId:req.params.trainerId}) //asynchronous
    .then((response)=>{
         res.send(response);
    })
    .catch((err) =>{
        console.log(err)
    });
});

/* =========================================== ADD PROGRAM ================================================ */
router.post('/:trainerId/addProgram', (req,res)=>{
    //create a new instance of a document (variable name can be anything) and save that it in the database - .POST?

    const {name, description} = req.body;
    //"--id" is auto generated - not a string in mongoDB - mongoose handles the conversion from to a string and then back again
    const program = new Program({
        //pass an object with the different properties in the schema
        id:uuidv4(),
        trainerId: req.params.trainerId,
        name,
        description,
        resources:[]
    });

    program.save() ///asynchronous - returns a promise
    .then((response)=>{
        //once the data is saved, the database sends us back a new object version of document that was saved
        res.send(response);
    })
    .catch((err)=>{
        console.log(err);
    })
})


module.exports = router;