const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 8080;

//import models
const User = require('./models/user')
const Trainer = require('./models/trainer')
const Client = require('./models/client')
const Program = require('./models/program')

app.use(cors());


//Connect To mongodb
dbURI = 'mongodb+srv://pperlock:!Exploration105@plan2traindb.6efyn.mongodb.net/plan2train?retryWrites=true&w=majority'

//connect mongoose to the database
//mongoose.connect("mongodb://127.0.0.1:27017/details", {
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology:true}) //second argument stops deprecation warnings - asynchronous promise
.then((res)=> app.listen(PORT, function() {console.log("Server is running on Port: " + PORT)})) //only listening if connected to db
.catch((err)=>console.log(err))

//sandbox routes ....
// app.get('/add-user', (req,res)=>{
//     //create a new instance of a blog document (variable name can be anything) and save that it in the database - .POST?

//     //"--id" is auto generated - not a string in mongoDB - mongoose handles the conversion from to a string and then back again
//     const user = new User({
//         //pass an object with the different properties in the schema
//         name:"Patti",
//         profile:"Trainer"
//     });

//     user.save() ///asynchronous - returns a promise
//     .then((res)=>{
//         //once the data is saved, the database sends us back a new object version of document that was saved
//         res.send(res);
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// })

// app.get('/trainer/:username', (req, res) => {

//     let trainer = {userprofile:{}, clients:[], programs:[] }

//     Trainer.find({username:req.params.username}) //asynchronous
//     .then((response)=>{
//         const trainerId = response[0]._id
//         trainer.userprofile = response;
            
//             Program.find({trainer_id:trainerId})
//             .then((programRes)=>{
//                 trainer.programs=programRes
//                 res.send(trainer);
//             })
//         })

//         .catch((err) =>{
//             console.log(err)
//         });

// })

app.get('/trainer/:trainerId/clients', (req, res) => {

    Client.find({trainerId:req.params.trainerId}) //asynchronous
    .then((response)=>{
         res.send(response);
    })
    .catch((err) =>{
        console.log(err)
    });
});


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




// app.get('/clients', (req, res) => {

//     Client.find() //asynchronous
//     .then((response)=>{
//         res.send(response);
//     })
//     .catch((err) =>{
//         console.log(err)
//     });
// })

// app.get('/programs', (req, res) => {

//     Program.find() //asynchronous
//     .then((response)=>{
//         res.send(response);
//     })
//     .catch((err) =>{
//         console.log(err)
//     });
// })

// app.get('/single-user', (req,res)=>{
//     User.findById("id")
//     .then((res)=>{
//         res.send(res);
//     })
//     .catch((err) =>{
//         console.log(err)
//     });
// })

/** end of sandbox routses */

//I am assuming we are creating these routes and then axios to them?

//Blog.find().sort();


