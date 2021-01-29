const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require('uuid');
const PORT = 8080;

//import models
const User = require('./models/user')
const Trainer = require('./models/trainer')
const Client = require('./models/client')
const Program = require('./models/program');
const { update } = require("./models/user");

app.use(cors());
//use .json to solve issues between json and text formats
app.use(express.json());


//Connect To mongodb
dbURI = 'mongodb+srv://pperlock:!Exploration105@plan2traindb.6efyn.mongodb.net/plan2train?retryWrites=true&w=majority'

//connect mongoose to the database
//mongoose.connect("mongodb://127.0.0.1:27017/details", {
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology:true}) //second argument stops deprecation warnings - asynchronous promise
.then((res)=> app.listen(PORT, function() {console.log("Server is running on Port: " + PORT)})) //only listening if connected to db
.catch((err)=>console.log(err))

/* =========================================== SIGN UP - CREATE TRAINER ================================================ */
app.post('/addTrainer', (req,res)=>{

    const {username,password,fname,lname,email} = req.body;

    const userId = uuidv4();

    const user = new User({
        //pass an object with the different properties in the schema
        userId:userId,
        username,
        password,
        profile:"trainer",
    });
        
    const trainer = new Trainer({
        userId:userId,
        contact:{
            username,
            password,
            fname,
            lname,
            email,
            phone:"Phone Number",
            address:"Street Address",
            city:"City",
            province:"Province",
            country:"Country",
            postal:"Postal"
        },
        company:{
            name:"Add Company Name",
            description:"Add Company Description",
            logo:""
        },
        social:{
            facebook:"",
            twitter:"",
            instagram:"",
            linkedIn:""
        }
    })

    user.save() ///asynchronous - returns a promise
    .then((response)=>{
        //once the data is saved, the database sends us back a new object version of document that was saved
        trainer.save()
        .then(trainerRes=>{
            const loginResponse = {
                loggedIn:true, 
                error:null, 
                userId:userId, 
                username, 
                password, 
                profile:"trainer"
            };
            res.send(loginResponse);
        })
        .catch((err)=>{
            console.log(err);
        });
    })
    .catch((err)=>{
        console.log(err);
    });
});
/* =========================================== SIGN IN - GET USER DETAILS ================================================ */
app.get('/user/:profile/:username/:password', (req,res)=>{

    User.findOne({username:req.params.username}) 
    .then((response)=>{

        const loginResponse = {
            loggedIn:false, 
            error:null, 
            userId:null, 
            username:null, 
            password:null, 
            profile:req.params.profile
        };

        if(!response){
            loginResponse.loggedIn = false;
            loginResponse.error = "Username Not Found";
            res.send(loginResponse);
        }else if(response.password === req.params.password && response.profile === req.params.profile){
            loginResponse.loggedIn = true;
            loginResponse.userId = response.userId;
            loginResponse.username = response.username;
            loginResponse.password = response.password;
            res.send(loginResponse);
        }else if(response.password !== req.params.password){
            loginResponse.loggedIn = false;
            loginResponse.error = "Incorrect Password";
            res.send(loginResponse);
        }else if(response.profile !== req.params.profile){
            loginResponse.loggedIn = false;
            loginResponse.error = "Profile Type Incorrect";
            res.send(loginResponse);
        }
    })
    .catch((err) =>{
        console.log(err)
    });
})

/* =========================================== UPDATE TRAINER DETAILS ================================================ */
app.put('/trainer/:trainerId/updateDetails', (req,res)=>{

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

/* =========================================== ADD CLIENT ================================================ */
app.post('/trainer/:trainerId/addClient', (req,res)=>{
    //create a new instance of a document (variable name can be anything) and save that it in the database - .POST?

    const {username,password,profile,status,userProfile, programs} = req.body;
    //"--id" is auto generated - not a string in mongoDB - mongoose handles the conversion from to a string and then back again
    const date = new Date().getFullYear();
    const client = new Client({
        //pass an object with the different properties in the schema
        userId:uuidv4(),
        trainerId: req.params.trainerId,
        yearAdded: date,
        username,
        password,
        profile,
        status,
        userProfile,
        programs,
        lessons:[],
        notes:"",
        photos:[]
    });

    client.save() ///asynchronous - returns a promise
    .then((response)=>{
        //once the data is saved, the database sends us back a new object version of document that was saved
        res.send(response);
    })
    .catch((err)=>{
        console.log(err);
    })
})

/* =========================================== DELETE CLIENT ================================================ */

app.delete('/client/:clientId', (req,res)=>{
    Client.deleteOne({userId:req.params.clientId})
    .then(response=>{
        res.send("Client successfully deleted");
    })
})

/* =========================================== UPDATE CLIENT DETAILS ================================================ */
app.put('/client/:clientId/updateDetails', (req,res)=>{

    Client.findOne({userId:req.params.clientId}) 
    .then((response)=>{
       
        response.userProfile = req.body;

        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response.userProfile);
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

app.post(`/client/:clientId/addNote`, (req, res)=>{

    const newNote = req.body.note;

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        response.notes=newNote;

        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(newNote);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})


/* =========================================== DELETE CLIENT NOTE ================================================ */

app.delete(`/client/:clientId/:noteId/deleteNote`, (req, res)=>{

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        //find the index of the note to delete
        let foundIndex;
        response.notes.find((note, index) => {foundIndex = index; return note.id === req.params.noteId; });
        
        response.notes.splice(foundIndex, 1);
        
        response.markModified('notes');
        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response.notes);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
});

/* =========================================== ADD PROGRAM ================================================ */
app.post('/trainer/:trainerId/addProgram', (req,res)=>{
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

/* =========================================== DELETE PROGRAM ================================================ */

app.delete('/program/:programId', (req,res)=>{
    Program.deleteOne({id:req.params.programId})
    .then(response=>{
        res.send("Program successfully deleted");
    })
})

/* =========================================== ADD RESOURCE ================================================ */
app.post('/program/:programId/addResource', (req,res)=>{

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

app.delete('/program/:programId/:resourceId', (req,res)=>{
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


/* =========================================== GET CLIENTS ================================================ */

app.get('/trainer/:trainerId/clients', (req, res) => {

    Client.find({trainerId:req.params.trainerId}) //asynchronous
    .then((response)=>{
         res.send(response);
    })
    .catch((err) =>{
        console.log(err)
    });
});

/* =========================================== GET TRAINER ================================================ */

app.get('/trainer/:username/:trainerId', (req, res) => {

    let trainer = {userProfile:{}, programs:[] }

    Trainer.findOne({userId:req.params.trainerId}) //asynchronous
    .then((response)=>{
        trainer.userProfile = response;
            
            Program.find({trainerId:req.params.trainerId})
            .then((programRes)=>{
                trainer.programs=programRes
                res.send(trainer);
            })
        })

        .catch((err) =>{
            console.log(err)
        });

})

/* =========================================== ADD NEW LESSON ================================================ */

app.post('/client/:clientId/addLesson', (req,res)=>{

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        
        const newLesson = {
        id:uuidv4(),
        current: response.lessons.length===0 ? true : false,
        name:"",
        location:{name:"", address:"", city:"", province:"", country:"" },
        date:"",
        time:"",
        resources:[],
        homework:[],
        notes:[],
    }
        // get the lesson to update
        response.lessons.push(newLesson);
        
        //needs to be marked as modified for the database to undertand that an array has been updated
        response.markModified('lessons');
        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(newLesson);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

/* =========================================== DELETE LESSON ================================================ */

app.delete('/client/:clientId/:lessonId/deleteLesson', (req,res)=>{

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

         //find the index of the note to delete
         let foundIndex;
         response.lessons.find((lesson, index) => {foundIndex = index; return lesson.id === req.params.lessonId; });
         
         response.lessons.splice(foundIndex, 1);

        //needs to be marked as modified for the database to undertand that an array has been updated
        response.markModified('lessons');
        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(response.lessons);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

/* =========================================== ADD LESSON NOTE ================================================ */

app.post(`/client/:clientId/:lessonId/addNote`, (req, res)=>{

   
    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        const newNote = req.body.note;

        // get the lesson to update
        const updateLesson = response.lessons.find(lesson=> lesson.id === req.params.lessonId);
        
        updateLesson.notes=newNote;

        //needs to be marked as modified for the database to undertand that an array has been updated
        response.markModified('lessons');
        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(newNote);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

// /* =========================================== DELETE LESSON NOTE ================================================ */

// app.delete(`/client/:clientId/:lessonId/:noteId/deleteNote`, (req, res)=>{

//     Client.findOne({userId:req.params.clientId}) //asynchronous
//     .then((response)=>{

//          // get the lesson to update
//          const updateLesson = response.lessons.find(lesson=> lesson.id === req.params.lessonId);

//         //find the index of the note to delete
//         let foundIndex;
//         updateLesson.notes.filter((item, index) => { foundIndex = index; return item.id == req.params.noteId; });
        
//         updateLesson.notes.splice(foundIndex, 1);

//         response.markModified('lessons');
//         response.save()
//         .then((response)=>{
//             //once the data is saved, the database sends us back a new object version of document that was saved
//             res.send(updateLesson.notes);
//         })
//         .catch((err)=>{
//             console.log(err);
//         })        
//     })
//     .catch((err) =>{
//         console.log(err)
//     });
// });


/* =========================================== ADD LESSON HOMEWORK ================================================ */

app.post(`/client/:clientId/:lessonId/addHomework`, (req, res)=>{

    const newHomework = req.body.note;

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        // get the lesson to update
        const updateLesson = response.lessons.find(lesson=> lesson.id === req.params.lessonId);
        
        updateLesson.homework=newHomework;

        //needs to be marked as modified for the database to undertand that an array has been updated
        response.markModified('lessons');
        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(newHomework);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

// /* =========================================== DELETE LESSON HOMEWORK ================================================ */

// app.delete(`/client/:clientId/:lessonId/:homeworkId/deleteHomework`, (req, res)=>{

//     Client.findOne({userId:req.params.clientId}) //asynchronous
//     .then((response)=>{

//          // get the lesson to update
//          const updateLesson = response.lessons.find(lesson=> lesson.id === req.params.lessonId);

//         //find the index of the note to delete
//         let foundIndex;
//         updateLesson.homework.filter((item, index) => { foundIndex = index; return item.id == req.params.homeoworkId; });
        
//         updateLesson.homework.splice(foundIndex, 1);

//         response.markModified('lessons');
//         response.save()
//         .then((response)=>{
//             //once the data is saved, the database sends us back a new object version of document that was saved
//             res.send(updateLesson.homework);
//         })
//         .catch((err)=>{
//             console.log(err);
//         })        
//     })
//     .catch((err) =>{
//         console.log(err)
//     });
// });

//Blog.find().sort();

/* =========================================== ADD LESSON RESOURCE ================================================ */
app.put('/client/:clientId/:lessonId/updateResource', (req,res)=>{

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{
        const updatedLesson = response.lessons.find(lesson => lesson.id ===req.params.lessonId)
        updatedLesson.resources=req.body;

        response.markModified('lessons');
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

/* =========================================== UPDATE LESSON DETAILS ================================================ */
app.put('/client/:clientId/:lessonId/updateLessonDetails', (req,res)=>{

    const {current, name, date, time, location} = req.body;

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{
        //find lesson to be updated
        const updatedLesson = response.lessons.find(lesson => lesson.id ===req.params.lessonId)
        updatedLesson.current = current;
        updatedLesson.name = name;
        updatedLesson.date = date;
        updatedLesson.time = time;
        updatedLesson.location = location;

        response.markModified('lessons');
        response.save()
        .then((response)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(updatedLesson);
        })
        .catch((err)=>{
            console.log(err);
        })        
    })
    .catch((err) =>{
        console.log(err)
    });
})

/* =========================================== UPDATE LESSON STATUS ================================================ */
app.put('/client/:clientId/:lessonId/updateStatus', (req,res)=>{

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{
        //find lesson to be updated
        response.lessons.map(lesson => lesson.current = false);
        const updatedLesson = response.lessons.find(lesson => lesson.id ===req.params.lessonId)
        updatedLesson.current = true;
        
        response.markModified('lessons');
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