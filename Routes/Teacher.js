//Teacher Routes
const express = require("express");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {ExpressError} = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn} = require("../authorize");
const axios = require("axios");

const{Teacher} = require("../Models/TeacherModel")

const teacherRouter = new express.Router();






//Retrieve current teacher

teacherRouter.get("/teacher/:id",  async function(req, res, next) {
    try {
        const user = await Teacher.get(req.params.id);

        return res.json({user});
    }
    catch(err) {return next(err);}
});


//Update teacher data

teacherRouter.patch("/teacherUpdate/:id",  async function(req, res, next) {
    try {
        console.log(req.body)
        const user = await Teacher.update(req.params.id, req.body);

        return res.json({user});
    } catch (err) {next(err)};
});



//Delete a teacher

teacherRouter.delete("/teacherDelete/:id",  async function(req, res, next) {
    try {
        let {id, name} = req.body;
         await Teacher.remove(id, name);

        return res.json({deleted: id})
    } catch(err) {return next(err)}
});



module.exports = teacherRouter;