const express = require("express")
const database = require("../database")

const routerClients = express.Router();

routerClients.delete("/:DNI", async (req, res) => {
    let DNIClient = req.params.DNI
    if (DNIClient == undefined){
        return res.status(400).json({ error: "no id params"})
    }

    database.connect();
    try{
        let ordersOfClient = await database.query("SELECT id from orders WHERE DNIClient = ?",
            [DNIClient])

        if ( ordersOfClient.length > 0){
            ordersOfClient = ordersOfClient.map( order => order.id )
            await database.query("DELETE FROM orders_items WHERE idOrder IN (?)",
                [ordersOfClient])
            await database.query("DELETE FROM orders WHERE DNIClient = ?",
                [DNIClient]
            )
        }

        await database.query("DELETE FROM clients WHERE DNI = ?",
            [DNIClient])  
    } catch (error){
        return res.status(400),json({ error: "error borrando el usuario"})
    }
  
    database.disConnect();
    res.json({ deleted: true})

})


module.exports = routerClients