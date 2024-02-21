const AddressController = require('../controllers/addressController');
const passport = require('passport');


module.exports = (app) => {

    //get = traer datos
    app.get('/api/address/findByUser/:id_user',passport.authenticate('jwt',{session: false}) ,AddressController.findByUser);

    //post = enviar datos 
    app.post('/api/address/create', passport.authenticate('jwt',{session: false}), AddressController.create);

    //ACTUALIZAR DATOS
    //401 UNAUTHORIZED
    
}