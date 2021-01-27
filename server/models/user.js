const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//make schema that defines the structure
const userSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },

    profile: {
        type: String,
        required:true
    },
});

//make the model based on that schema

// const User = mongoose.model("User", userSchema)

//export the model?
module.exports = mongoose.model('User', userSchema, "Users")


//first argument name is important....it is going to look at that name and pluralize it to look for collection in the db (Users collection)
//second argument - schema we ar going ot base this model on
