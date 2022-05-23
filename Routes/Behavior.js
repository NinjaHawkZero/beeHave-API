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
        let {assigned, name, note, score} = req.body;
        let studentID = req.body.studentID
        let assignedDate = await Behaviors.createBehavior(studentID, assigned, name, note, score);

        return res.status(201).json({assignedDate})

    }
    catch(err) {return next(err)}
});



behaviorRouter.get("/:id/getBehaviors",  async function(req, res, next) {
    try{
        //Get student id 
        let studentID = req.body.studentID
        let behaviors = await Behaviors.getBehaviors(studentID);

        return res.status(201).json({behaviors})
    }
    catch(err) {return next(err)}
});



behaviorRouter.get("/:id/getBehavior",  async function(req, res, next) {
    try{
        //Get id of behavior
        let id = req.body.id;
        let behavior = await Behaviors.getBehavior(id);

        return res.status(201).json({behavior})

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