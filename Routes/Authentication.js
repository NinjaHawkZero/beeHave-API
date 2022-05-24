//Authentication Routes
const express = require("express");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {ExpressError} = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn} = require("../authorize");
const axios = require("axios");

const{Teacher} = require("../Models/TeacherModel")

const authenticationRouter = new express.Router();





//Register Teacher: registers, logs in, and returns JWT Token.


authenticationRouter.post("/register", async function(req, res, next) {
    try {
        console.log(req.body)
        let {username, password} = req.body;
        console.log(username, password)
        const newUser = await Teacher.register(username, password);
        console.log(`Before the sign: ${newUser}`)
        const token = jwt.sign(newUser, SECRET_KEY);
        return res.status(201).json({token})
    }
    catch(err) {return next(err)}
});



//Login Teacher: logs in teacher, returns token


authenticationRouter.post("/login", async function(req, res, next) {
    try {
        let {username, password} = req.body;
        if(await Teacher.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            return res.json({token})
        } else  {
            throw new ExpressError("Invalid username/password", 400)
        }
    } catch (err) {return next(err)}
});




module.exports = authenticationRouter;