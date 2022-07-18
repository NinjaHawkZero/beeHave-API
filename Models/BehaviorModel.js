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


    static async createBehavior(studentID, assigned, name, note, score, chartDate) {


        const result = await db.query(`INSERT INTO behaviors
                                    (studentID, assigned, name, note, score, chartDate)
                                       VALUES($1, $2, $3, $4, $5, $6)
                                       RETURNING  assigned`, [studentID, assigned, name, note, score, chartDate ]);
        

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
                                                   AND score = -1`, [studentID]);

            let negativeBehaviors = resultNegative.rows






            let [currentDay, oneDay, twoDay, threeDay, fourDay, fiveDay, sixDay, sevenDay] = getLastWeeksDates()

            const postitiveChartDataResults = await db.query(`SELECT * 
                                                    FROM behaviors
                                                    WHERE score = 1
                                                    AND chartDate = $1
                                                    OR chartDate = $2
                                                    OR chartDate = $3
                                                    OR chartDate = $4
                                                    OR chartDate = $5
                                                    OR chartDate = $6
                                                    OR chartDate = $7
                                                    OR chartDate = $8
                                                     `, [currentDay, oneDay, twoDay, threeDay, fourDay, fiveDay, sixDay, sevenDay]);



                    let positiveChartData = postitiveChartDataResults.rows


                             const negativeChartDataResults = await db.query(`SELECT * 
                                                     FROM behaviors
                                                     WHERE score = -1
                                                     AND chartDate = $1
                                                     OR chartDate = $2
                                                     OR chartDate = $3
                                                     OR chartDate = $4
                                                     OR chartDate = $5
                                                     OR chartDate = $6
                                                     OR chartDate = $7
                                                     OR chartDate = $8
                                                      `, [currentDay, oneDay, twoDay, threeDay, fourDay, fiveDay, sixDay, sevenDay]);


                                let negativeChartData = negativeChartDataResults.rows

            return {positiveBehaviors, negativeBehaviors, negativeChartData, positiveChartData}

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
                                     RETURNING  id`, [id]);

        const deletedBehavior = result.rows[0];

        if(!deletedBehavior) {throw new BadRequestError(`Could not delete behavior`)};

        return deletedBehavior
        
   }







}



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

assignCurrentDate()

//Returns Array of 8 days of dates, starting with current day
function getLastWeeksDates() {
    const now = new Date();
  
   let currentDay =  new Date(now.getFullYear(), now.getMonth(), now.getDate()).toUTCString();
   let oneDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toUTCString();
   let twoDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toUTCString();
   let threeDay =  new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toUTCString();
   let fourDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4).toUTCString();
    let fiveDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toUTCString();
    let sixDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toUTCString();
     let sevenDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toUTCString();

     let datesArr = [currentDay, oneDay, twoDay, threeDay, fourDay, fiveDay, sixDay, sevenDay]

     console.log(datesArr[0], datesArr[1])
     return datesArr.map(function(date) {
        
       let split = date.split(" ")
       split.pop();
       split.pop()
       let joinedDate = split.join(" ")
       

       return joinedDate
     })


     

  }

console.log(getLastWeeksDates())



module.exports = {Behaviors}