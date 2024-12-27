import app from './app.js'
import db_connect from './db/database_connect.js'
import dotenv from 'dotenv'



dotenv.config();

const port = process.env.PORT || 9000;

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
    
