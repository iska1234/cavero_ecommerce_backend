const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');


module.exports = (app,upload) => {

    //get = traer datos
    app.get('/api/categories/getAll',passport.authenticate('jwt',{session: false}) ,CategoriesController.getAll);

    //post = enviar datos 
    app.post('/api/categories/create', passport.authenticate('jwt',{session: false}), upload.array('image', 1), CategoriesController.create);

    //ACTUALIZAR DATOS
    //401 UNAUTHORIZED
    
}