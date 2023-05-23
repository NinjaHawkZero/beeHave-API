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

            let negativeBehaviors = resultNegative.rows;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////



            let [currentDay, oneDay, twoDay, threeDay, fourDay, fiveDay, sixDay] = getLastWeeksDates()

            const currentDayResults = await db.query(`SELECT * 
                                                    FROM behaviors
                                                    WHERE score = 1
                                                    AND chartDate = $1
        
                                                    
                                                     `, [currentDay]);



                    let currentDayPositive = currentDayResults.rows;




                    const secondDayResults = await db.query(`SELECT * 
                                                            FROM behaviors
                                                             WHERE score = 1
                                                            AND chartDate = $1

                    
                                                                 `, [oneDay]);


                    let secondDayPositive = secondDayResults.rows;

                            
                    
                    
                    
                    
                    
                    
                    const thirdDayResults = await db.query(`SELECT * 
                                                            FROM behaviors
                                                             WHERE score = 1
                                                            AND chartDate = $1

                    
                                                                 `, [twoDay]);


                    let thirdDayPositive = thirdDayResults.rows;






                    const fourthDayResults = await db.query(`SELECT * 
                                                            FROM behaviors
                                                             WHERE score = 1
                                                            AND chartDate = $1

                    
                                                                 `, [threeDay]);


                    let fourthDayPositive = fourthDayResults.rows;







                    const fifthDayResults = await db.query(`SELECT * 
                                                            FROM behaviors
                                                             WHERE score = 1
                                                            AND chartDate = $1

                    
                                                                 `, [fourDay]);


                    let fifthDayPositive = fifthDayResults.rows;








                    const sixthDayResults = await db.query(`SELECT * 
                                                            FROM behaviors
                                                             WHERE score = 1
                                                            AND chartDate = $1

                    
                                                                 `, [fiveDay]);


                    let sixthDayPositive = sixthDayResults.rows;





                    
                    const seventhDayResults = await db.query(`SELECT * 
                                                            FROM behaviors
                                                             WHERE score = 1
                                                            AND chartDate = $1

                    
                                                                 `, [sixDay]);


                    let seventhDayPositive = seventhDayResults.rows;



           
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    








                                const currentDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [currentDay]);


                                let currentDayNegative = currentDayResultsNegative.rows;


                                



                                const secondDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [oneDay]);


                                let secondDayNegative = secondDayResultsNegative.rows;



                                const thirdDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [twoDay]);


                                let thirdDayNegative = thirdDayResultsNegative.rows;





                                const fourthDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [threeDay]);


                                let fourthDayNegative = fourthDayResultsNegative.rows;





                                const fifthDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [fourDay]);


                                let fifthDayNegative = fifthDayResultsNegative.rows;





                                const sixthDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [fiveDay]);


                                let sixthDayNegative = sixthDayResultsNegative.rows;



                                const seventhDayResultsNegative = await db.query(`SELECT * 
                                FROM behaviors
                                 WHERE score = -1
                                AND chartDate = $1


                                     `, [sixDay]);


                                let seventhDayNegative = seventhDayResultsNegative.rows;



                             




            return {positiveBehaviors, negativeBehaviors, currentDayPositive, secondDayPositive, thirdDayPositive, fourthDayPositive, 
            fifthDayPositive, sixthDayPositive, seventhDayPositive, currentDayNegative, secondDayNegative, thirdDayNegative, fourthDayNegative,
        fifthDayNegative, sixthDayNegative, seventhDayNegative}





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
     

     let datesArr = [currentDay, oneDay, twoDay, threeDay, fourDay, fiveDay, sixDay]

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


function plusMinus(arr) {

    let zeros = 0
    let positive = 0
    let negative = 0

    for(let i=0; i<arr.length - 1; i++) {
        //Calculate each type
       
        if(arr[i] == 0) {
            zero++
        } else if (arr[i] < 0) {
            negative++
        } else {positive++}
    }

    let zeroRation = zeros / arr.length;
    let positiveRotation = positive / arr.length;
    let negativeRotation = negative / arr.length;

    return 
    {zeroRotation, positiveRotation, negativeRotation}


}