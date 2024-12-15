import app from './app.js'
import db_connect from './db/database_connect.js'
import dotenv from 'dotenv'
import path from 'path';


dotenv.config();

const port = process.env.PORT || 9000;
const __dirname = path.resolve(); // Correct directory name

// Serve React Frontend in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

//database connect and backend server start
db_connect()
    .then(() => {
        app.listen(port, () => {
            console.log(` This server is listening at port : ${port}`);
        })
        app.get('/', (req,res) => {
            res.send('this is server')
        })
    })
    .catch(error => console.log(error));
    
