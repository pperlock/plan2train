const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//make schema that defines the structure
const trainerSchema = new Schema({
    userId: {
        type: String,
        required:true
    },
    contact:{
        type: Object
    },
    company:{
        type: Object
    },
    social: {
        type: Object
    }
});

//export the model
module.exports = mongoose.model('Trainer', trainerSchema, "Trainers")