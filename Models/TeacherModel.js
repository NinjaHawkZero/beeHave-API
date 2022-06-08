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

//Related methods for Teacher

class Teacher {

    //Register Teacher with data
    //Returns {name, password}
    //Throws BadRequestError on duplicates
static async register(name, password) {

    let newName = name
    
    console.log(`Checking for ${newName}`)
    const duplicateCheck = await db.query(
        `SELECT name
        FROM teachers
        WHERE name = $1`, 
        [newName]
    );

    if(duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${name}`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);


    const result = await db.query(
        `INSERT INTO teachers
        (name, password)
        VALUES ($1, $2)
        RETURNING name`, [newName, hashedPassword]

    );

    const teacher = result.rows[0];

    return teacher;
}

//Your current system is dumb, you need to make user names unique.
//Authenticate Teacher(user) for login
static async authenticate(name, password) {
    //Find teacher first
    const result = await db.query(
        `SELECT id, name,
        password
        FROM teachers
        WHERE name = $1
        `, [name]
    );

    const teacher = result.rows[0];
    
    if(teacher) {

        const isValid = await bcrypt.compare(password, teacher.password);
        if(isValid === true) {
            delete teacher.password;
            return teacher;
        } else {throw new UnauthorizedError("Invalid username/password")}
    }

    throw new UnauthorizedError("Invalid username/password");
}

//Given a teacher name, return teacher object

static async get(id) {
    const teacherRes = await db.query(
        `SELECT id, name
        FROM teachers
        WHERE id = $1`,
        [id],
    );

    const teacher = teacherRes.rows[0];

    if(!teacher) {throw new NotFoundError(`No user can be retrieved`)}

    return teacher;
}


//Given teacher name, update teacher data
static async update(id, data) {
    if(data.password) {
        data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForUpdate(
        data
    );

    const idIdx = "$" + (values.length + 1);

    const querySql = `UPDATE teachers
                      SET ${setCols}
                      WHERE id = ${idIdx}  
                      RETURNING name, img_url`;

    console.log(querySql)

    const result = await db.query(querySql, [...values, id]);
    
    const teacher = result.rows[0];

    if(!teacher) {throw new NotFoundError(`No user can be updated`)}

    return teacher
}



//Delete Given Teacher from DB; returns undefined

static async remove(id, name) {
    let result = await db.query(
        `DELETE 
        FROM teachers
        WHERE id = $1
        RETURNING name`,
        [id],
    );

    let teacher = result.rows[0]
    
    if(!teacher) {throw new NotFoundError(`No user: ${name} found to delete`)}

    return teacher
}



}

module.exports = {Teacher};