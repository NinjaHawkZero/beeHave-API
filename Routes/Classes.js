//Classes Routes

const express = require("express");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {ExpressError} = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn} = require("../authorize");
const axios = require("axios");

const{Classes} = require("../Models/ClassesModel")

const classesRouter = new express.Router();



//Route to create a class
classesRouter.post("/:id/createClass",  async function(req, res, next) {
    try{
        let {id, name} = req.body;

        let createdClass = await Classes.createClass(id, name);
        let returnArr = [createdClass]

        return res.status(201).json({returnArr})


    } catch(err) {return next(err)}
});








//Route to retrieve all of teachers classes

classesRouter.get("/:id/classes", async function(req, res, next) {
    try{

        let teacherClasses = await Classes.getClasses(req.params.id);


        return res.status(201).json({teacherClasses})

    } catch (err) {return next(err)}
});








//Route to update class data


classesRouter.patch("/:id/updateClass", async function(req, res, next) {
    try{

        let classObj = req.body;
        let {id} = req.body;

        const updatedClass = await Classes.updateClass(id, classObj);
        const returnArr = [updatedClass]

        return res.json({returnArr})

    } catch(err) {return next(err)}

});







//Route to remove a class

classesRouter.delete("/:id/deleteClass", ensureCorrectUser, async function(req, res, next) {
    try{
        let {id} = req.body;
        await Classes.removeClass(id);

        return res.json({deleted: id})

    } catch (err) {return next(err)}
});


module.exports = classesRouter;