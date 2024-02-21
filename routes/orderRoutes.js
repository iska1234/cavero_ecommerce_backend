const OrderController = require('../controllers/ordersController');
const passport = require('passport');


module.exports = (app) => {

    //get = traer datos
    app.get('/api/orders/findByStatus/:status',passport.authenticate('jwt',{session: false}) ,OrderController.findByStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status',passport.authenticate('jwt',{session: false}) ,OrderController.findByClientAndStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',passport.authenticate('jwt',{session: false}) ,OrderController.findByDeliveryAndStatus);
    //post = enviar datos 
    app.post('/api/orders/create', passport.authenticate('jwt',{session: false}), OrderController.create);

    //ACTUALIZAR DATOS
    app.put('/api/orders/updateToDispatched', passport.authenticate('jwt',{session: false}), OrderController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay', passport.authenticate('jwt',{session: false}), OrderController.updateToOnTheWay);
    app.put('/api/orders/updateToDelivery', passport.authenticate('jwt',{session: false}), OrderController.updateToDelivery);
    app.put('/api/orders/updateLatLng', passport.authenticate('jwt',{session: false}), OrderController.updateLatLng);
}