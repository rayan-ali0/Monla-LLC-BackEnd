import Order from "../Models/Order.js"
import Product from '../Models/Product.js'
import User from '../Models/User.js'
// import Shipping from '../Models/Shipping.js'

export const orderController = {
    createOrder: async (req, res) => {
        const { userName,userEmail,total,shippingId,userPhone,address, userId, productsOrdered } = req.body
        // const orderedDate = new Date()
        // const user = await User.findById({ _id: userId })
        const orders = await Order.find()
        // let total = 0,
        let count = orders.length + 1
        // for (let product in productsOrdered)
        //     total += (product[i].quantity * product[i].price)
        try {
            const newOrder = await Order.create({
                userName,
                userEmail,
                shippingId,
                userPhone,
                address,
                orderNumber: count,
                status: 'pending',
                total,
                userId,
                productsOrdered
            })
            await newOrder.save()
            // await user.order.push(newOrder._id) //user.order is an array attribute in user model which refers to this order model
            newOrder ? res.status(200).json({ message: 'New Order has been created!', Order: newOrder }) :
                res.status(400).send('Error occured, failed to create a new order!')
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error.message })
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find()
            res.status(200).json({ Orders: orders })
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    },
    getOrderById: async (req, res) => {
        const id = req.params.id
        try {
            const order = await Order.findById(id)
            order ? res.status(200).json({ Order: order }) :
                res.status(404).send(`Order with ID ${id} is not found!`)
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    },
    getOrderByOrderNumber: async (req, res) => {
        const orderNumber = req.body.orderNumber
        try {
            const order = await Order.findOne({ orderNumber: orderNumber })
            order ? res.status(200).json({ Order: order }) : 
                res.status(404).send(`Order with Order Number ${orderNumber} doesn't exist!`)
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    },
    getOrdersByUser: async (req, res) => {
        const userId = req.body.userId
        try {
            const orders = await Order.find({ userId: userId })
            orders ? res.status(200).json({ Orders: orders }) :
                res.status(404).send(`Invalid UserID ${userId}!`)
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    },
    getOrdersByDate: async (req, res) => {
        const date = req.body.date
        try {
            const orders = await Order.find({ createdAt: date })
            orders ? res.status(200).json({ Orders: orders }) :
                res.status(404).send(`No orders on date ${date} or an error occured!`)
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    },

    updateOrder: async (req, res) => {
        const id = req.params.id
        const { address, status, productsOrdered } = req.body
        let deliverDate = null, total = 0
        for (let product in productsOrdered)
            total += (product[i].quantity * product[i].price)

        (status === 'delivered') ? deliverDate = new Date() : deliverDate = null

        try {
            const editOrder = await Order.findByIdAndUpdate( id, { 
                address,
                status,
                total,
                deliverDate,
                productsOrdered
             })
           if(editOrder)
           {
            if(status==="rejected" && productsOrdered){
                for(let i=0;i<editOrder.pruductsOrdered.length;i++){
                   const productId=editOrder.pruductsOrdered[i].id
                   const productExist=await Product.findById(productId)
                   if(productExist){
                    const orderedStock=editOrder.productsOrdered[i].stock
                    const returnedStock=productExist.stock+orderedStock
                    await findByIdAndUpdate(productId,{stock:returnedStock})

                   }
                }

            }
            res.status(200).send(`Order with ID ${id} has been updated successfully!`) 
        }
            res.status(400).send(`Error occured or Order with ID ${id} is not found!`)


        }   
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    },
    
    deleteOrder: async (req, res) => {
        const id = req.params.id
        try {
            const user = await User.findOne({ order: { $in: id } })
            const removeOrder = await Order.findByIdAndDelete({ _id: id })
            await user.order.filter(item => item.toString() !== id)
                removeOrder ? res.status(200).send(`Order with ID ${id} has been deleted successfully!`) :
                    res.status(400).send(`Error occured or Order with ID ${id} is not found!`)
        }
        catch (error) {
            res.status(404).json({ status: 404, error: error })
        }
    }
}