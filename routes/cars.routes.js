const config = require('config')
const sql = require('mssql')
const jwt = require('jsonwebtoken')
const {Router} = require('express')
const router = Router()
const cors=require('cors')


// async function start() {
//     await sql.connect(config.get('configsql'))
// }

// /api/cars/create
router.post(
    '/create', 
    cors(),
    async (req, res) => {
    try {
        const data = await req.body
      
       
        await sql.connect(config.get('configsql'))

        const result = await sql.query(`INSERT INTO dbo.car(
            name, value, description, idCategory, price, src) values( N'${data.newItem.name}', ${data.newItem.value},
            N'${data.newItem.desc}',${data.newItem.locMarka}
            ,${data.newItem.price},'${data.newItem.src}')`)
            return res.status(200).json({ message: "Новый авто создан" })
        
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})
// /api/cars/create
router.delete(
    '/delete', 
    cors(),
    async (req, res) => {
    try {
        const data = await req.body
        
        await sql.connect(config.get('configsql'))

        const result = await sql.query(`DELETE from  dbo.car where id=${data.itemId}`)
            return res.status(200).json({ message: "Машина удалена" })
        
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})
// /api/cars
router.get(
    '/',
    cors(),
    async (req, res) => {
    try {


        await sql.connect(config.get('configsql'))

        const result = await sql.query(`SELECT * FROM dbo.car`)
        const cars = result.recordset  

        if (cars) {
            return res.json(cars)
        } 
        else {
            return res.status(400).json({ message: "Неверные данные, попробуйте снова" })
        }
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})
// /api/cars
router.get(
    '/searchname',
    cors(),
    async (req, res) => {
    try {
        
        let data=req.headers

        await sql.connect(config.get('configsql'))

        const result = await sql.query(`SELECT * FROM dbo.car where name like '%${data.searchname}%'`)
        console.log(result);
        const cars = result.recordset  

        if (cars) {
            return res.json(cars)
        } 
        else {
            return res.status(400).json({ message: "Неверные данные, попробуйте снова" })
        }
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})
// /api/cars
router.get(
    '/searcfilter',
    cors(),
    async (req, res) => {
    try {
        
        let data=req.headers

        await sql.connect(config.get('configsql'))
        console.log(data)
        let highprice=data.highprice;
        let lowprice=data.lowprice;
        let strsql=`SELECT * FROM dbo.car where name like '%${data.searchname}%'
        and (value=${data.value} or ${data.value}=0) and (idCategory=${data.idcategory} or ${data.idcategory}=-1)
        and ((price<=${highprice} and price>=${lowprice}) or (price>=${lowprice} and 0=${highprice})
        or(price<=${highprice} and 0=${lowprice}) or (0=${lowprice} and 0=${highprice}))`;
        console.log(strsql);
        const result = await sql.query(strsql)
        console.log(result);
        const cars = result.recordset  

        if (cars) {
            return res.json(cars)
        } 
        else {
            return res.status(400).json({ message: "Неверные данные, попробуйте снова" })
        }
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})
// /api/cars/marks
router.get(
    '/marks',
    cors(),
    async (req, res) => {
    try {
      


        await sql.connect(config.get('configsql'))

        const result = await sql.query(`SELECT * FROM dbo.spr_category`)
        console.log(result);
        const marks = result.recordset 

        if (marks) {
            return res.json(marks)
        } 
        else {
            return res.status(400).json({ message: "Неверные данные, попробуйте снова" })
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({message: "Что-то пошло не так"})
    }
})
// start()

module.exports = router