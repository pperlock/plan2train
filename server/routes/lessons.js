const express = require("express");
const router = express.Router();
const Client = require('../models/client');
const { v4: uuidv4 } = require('uuid');

/* =========================================== ADD NEW LESSON ================================================ */

router.post('/:clientId/addLesson', (req,res)=>{

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

router.delete('/:clientId/:lessonId/deleteLesson', (req,res)=>{

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

/* =========================================== UPDATE LESSON DETAILS ================================================ */
router.put('/:clientId/:lessonId/updateLessonDetails', (req,res)=>{

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

/* =========================================== ADD LESSON NOTE ================================================ */

router.post(`/:clientId/:lessonId/addNote`, (req, res)=>{

   
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

router.post(`/:clientId/:lessonId/addHomework`, (req, res)=>{

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

/* =========================================== UPDATE LESSON STATUS ================================================ */
router.put('/:clientId/:lessonId/updateStatus', (req,res)=>{

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

/* =========================================== ADD LESSON RESOURCE ================================================ */
router.put('/:clientId/:lessonId/updateResource', (req,res)=>{

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

module.exports = router;
