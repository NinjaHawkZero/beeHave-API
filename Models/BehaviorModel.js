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


class Behaviors {

    //Create A Behavior


    static async createBehavior(studentID, assigned, name, note, score) {


        const result = await db.query(`INSERT INTO behaviors
                                    (studentID, assigned, name, note, score)
                                       VALUES($1, $2, $3, $4, $5)
                                       RETURNING  assigned`, [studentID, assigned, name, note, score ]);
        

        console.log(result.rows)
        const assignedDate = result.rows[0];

        
        if(!assignedDate) {throw new BadRequestError(`Could not create behavior assigned ${assigned}`)}
        
        return assignedDate

    }




    //Get all behaviors for a student
    static async getBehaviors(studentID) {

        const result = await db.query(`SELECT *
                                       FROM behaviors
                                       WHERE studentID = $1`, [studentID]);
        
        let behaviors = result.rows;
        console.log(behaviors)

        return behaviors
    }



    //Get Positive and Negative Behaviors At Once

        static async behaviorAnalytics(studentID) {

            const resultPositive = await db.query(`SELECT *
                                           FROM behaviors
                                           WHERE studentID = $1
                                           AND score = 1`, [studentID]);

            let positiveBehaviors = resultPositive.rows;

            const resultNegative = await db.query(`SELECT *
                                                   FROM behaviors
                                                   WHERE studentID = $1
                                                   AND score = 1`, [studentID]);

            let negativeBehaviors = resultNegative.rows

            return {positiveBehaviors, negativeBehaviors}

        }


    //Get single Behavior for student

    static async getBehavior(id) {
        
        const result = await db.query(`SELECT id,
                                        studentID,
                                        assigned,
                                        name,
                                        note,
                                        score
                                        FROM behaviors
                                        WHERE id = $1`, [id]);
        let behavior = result.rows[0];

        if(!behavior) {throw new NotFoundError("Behavior Not Found")};
        return behavior
    }


    //Delete A Behavior

   static async deleteBehavior(id) {

        const result = await db.query(`DELETE FROM behaviors
                                     WHERE id = $1
                                     RETURNING date, id`, [id]);

        const deletedBehavior = result.rows[0];

        if(!deletedBehavior) {throw new BadRequestError(`Could not delete behavior`)};

        return deletedBehavior
        
   }







}






module.exports = {Behaviors}