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

class Students {



//Create student
static async createStudent(id, name, age, behaveScore = 0) {

    let result = await db.query(`
                                INSERT INTO students
                                (classID, name, age, behaveScore)
                                VALUES ($1, $2, $3, $4)
                                RETURNING id, classID, name, age, behaveScore
                                `, [id, name, age, behaveScore]);

    let student = result.rows[0];

    if(!student) {throw new NotFoundError(`Student ${name} could not be created `)}

    return student;

}



//Get all students with classID

static async getStudents(id) {

    let result = await db.query(`
                                SELECT *
                                FROM students
                                WHERE classID = $1`, [id]);
    let students = result.rows;

    if(!students) {throw new NotFoundError(`Could not find students with classID: ${classID}`)};

    return students
}


//Get student with classID, id, name

static async getStudent(id) {

    let result = await db.query(`
                                SELECT classID,
                                id,
                                name,
                                age,
                                behaveScore,
                                img_url
                                FROM students
                                WHERE id = $1`, [id]);

    let student = result.rows[0];

    if(!student) {throw new NotFoundError(`Student Not Found`)}

    return student;
}




    //Update Student Data, using ID, Name, and data
    static async updateStudent(id, name, data){ 
        const { setCols, values } = sqlForUpdate( data);

        const idIndex = "$" + (values.length + 1);

        const sqlQuery = `UPDATE students
                          SET ${setCols}
                          WHERE id = ${idIndex}
                          RETURNING id, classID, name, age, behaveScore, img_url`;

        const result = await db.query(sqlQuery, [...values, id]);

        const student = result.rows[0];

        if(!student) {throw new NotFoundError(`No Student named ${name}`)}

        return student;

    }


    //Update BehaveScore for a student

    static async updateBehaveScore(student, behaveValue) {

        student.behaveScore += behaveValue;

        const {setCols, values} = sqlForUpdate(student);

        const idIndex = $ + (values.length + 1);

        
        const sqlQuery = `UPDATE students
                          SET  ${setCols}
                          WHERE id = ${student.id}
                          RETURNING behaveScore `;

        const result = await db.query(sqlQuery, [...values, idIndex])

        const newScore = result.rows[0];

        if(!newScore) {throw new NotFoundError(`Couldn't update score for ${student.name}`)};

        return newScore;
    }



    //Delete Student


    static async removeStudent(id) {

        let result = await db.query(`DELETE
                                    FROM students
                                    WHERE id=$1
                                    RETURNING name`, [id]);
        
        let studentName = result.rows[0]

        if(!studentName) {throw new NotFoundError(`No student named ${studentName} found to delete.`)}

        return studentName;
        
        

    }




















}

module.exports = {Students}