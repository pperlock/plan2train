const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
//const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
const dotenv= require('dotenv');
dotenv.config();

require ('./passportConfig');


//import models
const User = require('./models/user')
const Trainer = require('./models/trainer')
const Client = require('./models/client')
const Program = require('./models/program');
const { update } = require("./models/user");

//*********************************************** END OF IMPORTS ******************************************************************** */

//connect mongoose to the database
mongoose.connect(process.env.MONGO_DBURI, {useNewUrlParser: true, useUnifiedTopology:true}) //second argument stops deprecation warnings - asynchronous promise
.then((res)=> app.listen(PORT, function() {console.log("Server is running on Port: " + PORT)})) //only listening if connected to db
.catch((err)=>console.log(err))

//use .json to solve issues between json and text formats
app.use(express.json());

/* =========================================== MIDDLEWARE ====================================================================================================== */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin: "http://localhost:3000", // <--location of the react app we are connecting to
    credentials:true, // <-- very important - must have
    allowedHeaders: "Content-Type, Authorization",
}))

app.use(session({
    secret:"secretcode",
    resave:true,
    saveUninitialized:true
}));

app.use(cookieParser('secretcode'));

app.use(passport.initialize());
app.use(passport.session());

require('./passportConfig')(passport); //using the instance of passport we created above as the parameter


/* ************************************************AUTHENTICATION ROUTES ********************************************************************* */

/* =========================================== SIGN UP/ CREATE TRAINER  ================================================ */

app.post('/addTrainer', (req,res)=>{

    const {username,password,email} = req.body;

    const userId = uuidv4();

    User.findOne({username:username}, async(err,doc)=>{

        const loginResponse = {
            loggedIn:false, 
            error:null, 
            userId:userId, 
            username, 
            profile:"trainer"
        };

        if (err) {
            loginResponse.error = err;
            throw err;
        }

        if (doc) {
            loginResponse.error = "Username already exists";
            res.send(loginResponse);
        }

        if(!doc){
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                userId:userId,
                username,
                password:hashedPassword,
                profile:"trainer"
            });

            const trainer = new Trainer({
                userId:userId,
                contact:{
                    username,
                    password:"",
                    fname: "First Name",
                    lname: "Last Name",
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
            });

            await newUser.save();
            await trainer.save();
            loginResponse.loggedIn = true;
            res.send(loginResponse);
        }
    })
    
});
    
/* =========================================== LOG IN - GET USER DETAILS ================================================ */

app.post("/login", (req,res, next)=>{

    const loginResponse = {
        loggedIn:false, 
        error:null, 
        userId:null, 
        username:null, 
        profile:req.params.profile
    };

    //the string "local" tells it to use the local strategy that we defined
    passport.authenticate('local', (err,user,info) =>{
        if (err){
            loginResponse.error = err;
            throw err;
        }
        if (!user){
            loginResponse.error = info.message; //contains error log in message
            res.send(loginResponse);
        }
        else{
            req.logIn(user, err =>{
                if (err) throw err;
                loginResponse.loggedIn = true;
                loginResponse.userId = req.user.userId;
                loginResponse.username = req.user.username;
                 loginResponse.profile = req.user.profile;
                res.send(loginResponse);
                // console.log(req.user);
                // console.log(info);
            })
        }
    })(req, res, next);
})

app.get("/logout", (req,res)=>{
    req.logout();
    // console.log(req);
    res.send("Logged Out");
});


//login using google
app.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
  function(req, res) {
    console.log(req.user);
    res.redirect(`http://localhost:3000/trainer/pperlock/${req.user.userId}`);
  });


//*********************************************** END OF AUTHENTICATION ROUTES ******************************************************************** */


/* =========================================== GET A SINGLE CLIENT FOR CLIENT SIDE ================================================ */

app.get('/client/:username/:userId', (req, res) => {

    Client.findOne({userId:req.params.userId}) //asynchronous
    .then((response)=>{
         res.send(response);
    })
    .catch((err) =>{
        console.log(err)
    });
});

/* =========================================== UPDATE TRAINER DETAILS ================================================ */
app.put('/trainer/:trainerId/updateDetails', (req,res)=>{

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
app.put('/trainer/:trainerId/updateLogo', (req,res)=>{

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
app.post('/trainer/:trainerId/addClient', (req,res)=>{
    
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

/* =========================================== DELETE CLIENT ================================================ */

app.delete('/client/:clientId', (req,res)=>{
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

/* =========================================== UPDATE CLIENT PROGRAMS ================================================ */
app.put('/client/:clientId/updatePrograms', (req,res)=>{
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

/* =========================================== UPDATE PROGRAM ================================================ */
app.post('/trainer/:trainerId/:programId/updateProgram', (req,res)=>{
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

app.get('/trainer/:trainerId', (req, res) => {

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

    const {name, date, time, location} = req.body

    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        
        const newLesson = {
        id:uuidv4(),
        current: response.lessons.length===0 ? true : false,
        name,
        location,
        date,
        time,
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