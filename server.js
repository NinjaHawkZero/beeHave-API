//Start server for TeacherAPI

const app = require("./app")
const {PORT} = require("./config");

//Connect to client

if(process.env.NODE_ENV === "production") {
    app.use(express.static('teacher/build'))
}


app.listen(PORT, function() {
    console.log(`Started on http://localhost:${PORT}`)
});