//Behavior Routes
const express = require("express");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {ExpressError} = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn} = require("../authorize");
const axios = require("axios");








const { Behaviors } = require("../Models/BehaviorModel");


const behaviorRouter = new express.Router();


//Create Behavior

behaviorRouter.post("/:id/createBehavior",  async function(req, res, next) {
    try{
        let {assigned, name, note, score, chartDate} = req.body;
        chartDate = assignCurrentDate()
        console.log(chartDate)
        let studentID = req.body.studentID
        let assignedDate = await Behaviors.createBehavior(studentID, assigned, name, note, score, chartDate);
        let returnArr = [assignedDate]

        return res.status(201).json({returnArr})

    }
    catch(err) {return next(err)}
});



behaviorRouter.get("/:id/student/:studentid/getBehaviors",  async function(req, res, next) {
    try{
        //Get student id 
        let studentID = req.params.studentid
        
        let behaviors = await Behaviors.getBehaviors(studentID);

        return res.status(201).json({behaviors})
    }
    catch(err) {return next(err)}
});





behaviorRouter.get("/:id/student/:studentid/getAnalytics",  async function(req, res, next) {
    try{
        //Get student id 
        let studentID = req.params.studentid
        
        let behaviors = await Behaviors.behaviorAnalytics(studentID);

        return res.status(201).json(behaviors)
    }
    catch(err) {return next(err)}
});




behaviorRouter.get("/:id/student/:studentid/getBehavior/:behaviorid",  async function(req, res, next) {
    try{
        //Get id of behavior
        let id = req.params.behaviorid;
        let behavior = await Behaviors.getBehavior(id);
        let returnArr = [behavior]

        return res.status(201).json({returnArr})

    }

    catch(err) {return next(err)}
});



behaviorRouter.delete("/:id/deleteBehavior",  async function(req, res, next) {
    try{
        //Get Id of behavior
        let id = req.body.id;
        let deletedBehavior = await Behaviors.deleteBehavior(id);

        return res.status(201).json({deletedBehavior})

    }
    catch(err) {return next(err)};
});


module.exports = behaviorRouter;




//Returns string of current date, properly formatted
function assignCurrentDate() {
    const now = new Date();

    let currentDay =  new Date(now.getFullYear(), now.getMonth(), now.getDate()).toUTCString();

    let split = currentDay.split(" ");
    split.pop();
    split.pop();

    let joinedDate = split.join(" ")
    console.log(joinedDate)

    return joinedDate
}