const express = require('express')
const config = require('config')
const sql = require('mssql')
const cors=require('cors')



const app = express()
app.use(cors({
    origin:["https://clientautoparadise.onrender.com"]
}))

//
app.use(express.json({ extendend: true, limit: '50mb' }))

app.use('/users', require('./routes/auth.routes'))
app.use('/cars', require('./routes/cars.routes'))


const PORT = config.get('port') || 5000

async function start() {
    try {
        await sql.connect(config.get('configsql'))
        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}`)
            // connection1.query('select * from Islander', function(err, result) {
            //     console.log('from User result', result)
            // })

            // sql.query('select * from Islander', function(err, result) {
            //     console.log(result)
            // })
        })
    }
    catch (e) {
        console.log("Server error ", e) 
        process.exit(1);
    }
}



start()




