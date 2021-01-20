const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//make schema that defines the structure
const clientSchema = new Schema({
    userId: {
        type: String,
        required:true
    },
    trainerId: {
        type: String
    },

    userProfile:{
        type: Object
    },

    programs: {
        type: Array
    },
    lessons: {
        type: Array
    },
    notes:{
        type:Array
    },
    photos:{
        type:Array
    } 
});


//export the model
module.exports = mongoose.model('Client', clientSchema, "Clients")