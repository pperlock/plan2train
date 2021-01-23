const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require('uuid');
const PORT = 8080;

//import models
const User = require('./models/user')
const Trainer = require('./models/trainer')
const Client = require('./models/client')
const Program = require('./models/program')

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
        notes:[],
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

    Trainer.find({userId:req.params.trainerId}) //asynchronous
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

/* =========================================== ADD LESSON NOTE ================================================ */

app.post(`/client/:clientId/:lessonId/addNote`, (req, res)=>{

    const {message} = req.body;

    const newNote = {
        id:uuidv4(),
        message
    }
    
    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        // get the lesson to update
        const updateLesson = response.lessons.find(lesson=> lesson.id === req.params.lessonId);
        
        updateLesson.notes.push(newNote);

        //needs to be marked as modified for the database to undertand that an array has been updated
        response.markModified('lessons');
        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(saveRes);
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

    const {message} = req.body;

    const newHomework = {
        id:uuidv4(),
        message
    }
    
    Client.findOne({userId:req.params.clientId}) //asynchronous
    .then((response)=>{

        // get the lesson to update
        const updateLesson = response.lessons.find(lesson=> lesson.id === req.params.lessonId);
        
        updateLesson.homework.push(newHomework);

        //needs to be marked as modified for the database to undertand that an array has been updated
        response.markModified('lessons');
        response.save()
        .then((saveRes)=>{
            //once the data is saved, the database sends us back a new object version of document that was saved
            res.send(saveRes);
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


