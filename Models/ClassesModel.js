"use strict";

const db = require("../db.js");
const bcrypt = require("bcrypt");
const { sqlForUpdate } = require("../sqlhelper");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config")

class Classes {


    //Create a class, given a teacher id and name
   static async createClass(id, name, classTime) {

    let result = await db.query(
        `
                                INSERT INTO classes
                                (teacherID, name, classTime)
                                VALUES ($1, $2)
                                RETURNING id, teacherID, name, classTime`, [id, name, classTime]);
    
    
    const classResult =  result.rows[0];

    return classResult;

    }



    //Retrieve all classes for a teacher, given a teacherID
    static async getClasses(id) {

        let result = await db.query(
            `                       SELECT *
                                    FROM classes
                                   WHERE teacherID = $1`, [id]);

        const classesResult = result.rows;


        if(!classesResult) {throw new NotFoundError(`Could not find classes for TeacherID: ${teacherID}`)}

        return classesResult;
                                   
    }


    //Update class data
    static async updateClass(id, data) {
        

        const { setCols, values } = sqlForUpdate(data)

        const classID = "$" + (values.length + 1);

        const sqlQuery = `UPDATE classes
                          SET ${setCols}
                          WHERE id = ${classID}
                          RETURNING id, teacherID, name, classTime `;

        const result = await db.query(sqlQuery, [...values, id]);

        const classResult = result.rows[0];

        if(!classResult) {throw new NotFoundError(`No class with id: ${id} found to update`)};
        
        return classResult
    }


    //Remove a class
    static async removeClass (id) {

        

        let result = await db.query(`
                                    DELETE
                                    FROM classes
                                    WHERE id = $1
                                    RETURNING id, name`, [id]);

        let classResult = result.rows[0];

        if(!classResult) {throw new NotFoundError(`No class found with id:${classID}`)};

        return classResult
    }

}   


module.exports = {Classes}

