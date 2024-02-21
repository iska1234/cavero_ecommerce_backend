const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');
const User = require('../models/user');
const pushNotificationController = require('./pushNotificationController');

module.exports = {
    
    async create(req, res, next){
        try {

            let order = req.body;
            order.status = 'PAGADO';
            const data = await Order.create(order);

            const tokens = await User.getAdminsNotificationsTokens();
            let tokensString = []
            tokens.forEach(t=>{
                tokensString.push(t.notification_token)
            });
            
            console.log('TOKENS', tokensString);
            pushNotificationController.sendNotificationToMultipleDevices(tokensString,{
                title: 'Orden creada',
                body: 'Se ha creado la orden',
                id_notification: '5'
            });

            console.log('La orden se creo correctamente')

            // RECORRER TODOS LOS PRODUCTOS AGREGADOS A LA ORDEN
            for(const product of order.products){
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success:true,
                message: 'La orden se creo correctamente',
                data: {
                    'id': data.id
                }
            });
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error creando la orden",
                error: error
            });
        }
    },

    async updateToDispatched(req, res, next){
        try {
            
            let order = req.body;
            order.status = 'DESPACHADO';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_delivery);
            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'PEDIDO ASIGNADO',
                body: 'Te han asignado un pedido!',
                id_notification: '2'
            });

            return res.status(201).json({
                success:true,
                message: 'La orden se actualizo correctamente',
            });
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error creando la orden",
                error: error
            });
        }
    },

    async updateToOnTheWay(req, res, next){
        try {

            let order = req.body;
            order.status = 'EN CAMINO';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_client);
            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'TU PEDIDO ESTÁ EN CAMINO',
                body: 'Un repartidor está en camino con tu pedido',
                id_notification: '3'
            });

            return res.status(201).json({
                success:true,
                message: 'La orden se actualizo correctamente',
            });
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error creando la orden",
                error: error
            });
        }
    },

    async updateToDelivery(req, res, next){
        try {

            let order = req.body;
            order.status = 'ENTREGADO';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_client);
            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'TU PEDIDO HA LLEGADO',
                body: 'El repartidor ha llegado con tu pedido',
                id_notification: '4'
            });

            return res.status(201).json({
                success:true,
                message: 'La orden se actualizo correctamente',
            });
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error creando la orden",
                error: error
            });
        }
    },

    async findByStatus(req, res, next){
        try {

            const status = req.params.status;
            const data = await Order.findByStatus(status);
            console.log(`Status ${JSON.stringify(data)}`);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            });
            
            return res.status(201).json(data);
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error al encontrar las ordenes por estado",
                error: error
            });
        }
    },

    async findByClientAndStatus(req, res, next){
        try {

            const status = req.params.status;
            const id_client = req.params.id_client;
            let data = await Order.findByClientAndStatus(id_client,status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            });

            return res.status(201).json(data);
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error al encontrar las ordenes por estado",
                error: error
            });
        }
    },

    async findByDeliveryAndStatus(req, res, next){
        try {

            const status = req.params.status;
            const id_delivery = req.params.id_delivery;
            let data = await Order.findByDeliveryAndStatus(id_delivery,status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            });

            return res.status(201).json(data);
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error al encontrar las ordenes por estado",
                error: error
            });
        }
    },

    async updateLatLng(req, res, next){
        try {

            let order = req.body;
            await Order.updateLatLng(order);
            return res.status(201).json({
                success:true,
                message: 'La orden se actualizo correctamente',
            });
            
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: "Hubo un error creando la orden",
                error: error
            });
        }
    }
}