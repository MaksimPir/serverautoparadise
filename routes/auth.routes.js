const config = require('config')
const sql = require('mssql')
const jwt = require('jsonwebtoken')
const {Router} = require('express')
const router = Router()
const cors=require('cors')


// async function start() {
//     await sql.connect(config.get('configsql'))
// }

// /api/auth/register
router.post(
    '/', 
    cors(),
    async (req, res) => {
    try {
        const {login, password} = await req.body

       
        await sql.connect(config.get('configsql'))
        let str=`SELECT * FROM dbo.users where login='${login}' and password='${password}'`;
        const resultCheck = await sql.query(str)
        const check = resultCheck.recordset[0] 
        if(check)
        {
            return res.status(400).json({ message: "Пользователь существует" })
        }
        else
        {
            const result = await sql.query(`INSERT INTO dbo.users (login, password) values( '${login}', '${password}')`)
            return res.status(200).json({ message: "Новый пользователь зарегистрирован" })
        }
        
        
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})
// /api/auth/login
router.get(
    '/login',
    cors(),
    async (req, res) => {
    try {
        console.log(req.headers);
        const {login, password} = await req.headers
        let str=`SELECT * FROM dbo.users where login='${login}' and password='${password}'`;
        console.log(str);

        await sql.connect(config.get('configsql'))

        const result = await sql.query(str)
        const cand = result.recordset[0] 
        console.log(cand);
        if (cand) {
            return res.json({ id_user: cand.id_user })
        } 
        else {
            return res.status(400).json({ message: "Неверные данные, попробуйте снова" })
        }
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})

// start()

module.exports = router