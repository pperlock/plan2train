const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PORT = process.env.PORT || 5000;
const dotenv= require('dotenv');
dotenv.config();
const path = require('path');

//import routes
const trainerRouter = require("./routes/trainer");
const loginRouter = require("./routes/login");
const clientsRouter = require("./routes/clients");
const lessonsRouter = require("./routes/lessons");
const programsRouter = require("./routes/programs");


//*********************************************** END OF IMPORTS ******************************************************************** */

//connect mongoose to the database
mongoose.connect(process.env.MONGO_DBURI, {useNewUrlParser: true, useUnifiedTopology:true}) //second argument stops deprecation warnings - asynchronous promise
.then((res)=> app.listen(PORT, function() {console.log("Server is running on Port: " + PORT)})) //only listening if connected to db
.catch((err)=>console.log(err))


//use .json to solve issues between json and text formats
app.use(express.json());

/* =========================================== MIDDLEWARE ====================================================================================================== */

if (process.env.NODE_ENV === "production"){
    app.use(cors({
        origin:"https://plan2train.herokuapp.com",
        credentials:true, // <-- very important - must have
        allowedHeaders: "Content-Type, Authorization",
    }))
}else{
    app.use(cors({
        origin: "http://localhost:3000", // <--location of the react app we are connecting to
        credentials:true, // <-- very important - must have
        allowedHeaders: "Content-Type, Authorization",
    }))
}

app.use(session({
    secret:"secretcode",
    resave:true,
    saveUninitialized:true
}));

app.use(cookieParser('secretcode'));

app.use(passport.initialize());
app.use(passport.session());

require('./passportConfig')(passport); //using the instance of passport we created above as the parameter

//apply routes
app.use('/', loginRouter);
app.use('/api/trainer/', trainerRouter);
app.use('/api/client/', clientsRouter);
app.use('/api/client/', lessonsRouter);
app.use('/api/program/', programsRouter);


if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("../client/build"));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
    });
}
