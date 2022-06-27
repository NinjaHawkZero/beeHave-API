const { BadRequestError } = require("./expressError")


//Helper function for helping with SQL update queries
//HAD TO TAKE OUT jsToSql code, it was breaking function

function sqlForUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);

    if(keys.length === 0) {throw BadRequestError("No Data")};
    
    console.log(keys)

    let sqlCols = keys.map((colName, idx) => `"${  colName}"=$${idx + 1}`,);

    return {
        setCols: sqlCols.join(", "),
        values: Object.values(dataToUpdate)
    }
}





module.exports = {sqlForUpdate}