//Student Routes
const express = require("express");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {ExpressError} = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn} = require("../authorize");
const axios = require("axios");

const{Students} = require("../Models/StudentsModel")

const studentsRouter = new express.Router();





//Create Student

studentsRouter.post("/:id/createStudent",  async function(req, res, next) {
    try {
        //Send class object data, specifically ID of the class
         let {name} = req.body;
         let id = req.body.id;

         let student = await Students.createStudent(id, name);
         let returnArr = [student]

         return res.status(201).json({returnArr})



    }
    catch (err) {return next(err)}
});




//Retrieve all students for class
studentsRouter.get("/:id/class/:classid/students",  async function(req, res, next) {
    try{
        //ID of the class needed
        let id = req.params.classid;
        let students = await Students.getStudents(id);

        return res.status(201).json({students})

    }
    catch(err) {return next(err)}
});


//Retrieve one student from class
studentsRouter.get("/:id/class/:classid/getStudent/:studentid", async function(req, res, next) {
    try{

        let id = req.params.studentid;
        let student = await Students.getStudent(id);
        let returnArr = [student]

        return res.status(201).json({returnArr})
    }
    catch(err) {next(err)}
});




studentsRouter.patch("/:id/updateStudent",  async function(req, res, next) {
    try{
        let data = req.body;
        let {id, name} = data;

        let student = await Students.updateStudent(id, name, data);
        let returnArr = [student]

        return res.status(201).json({returnArr})

    }
    catch(err) {next(err)}
});



studentsRouter.patch("/:id/updateScore",  async function(req, res, next) {
    try{

        let student = req.body.student;
        let behaveValue = req.body.behaveValue;

        let newScore = await Students.updateBehaveScore(student, behaveValue);
        let returnArr = [newScore]

        return res.status(201).json({returnArr})
    }
    catch(err) {return next(err)}
});



studentsRouter.delete("/:id/removeStudent",  async function(req, res, next) {
    try{
        let id = req.body;
        let newID = id.id

        console.log(newID)
        

        let deletedStudent = await Students.removeStudent(newID);

        return res.status(201).json({deletedStudent})

    }
    catch(err) {return next(err)}
});


module.exports = studentsRouter;