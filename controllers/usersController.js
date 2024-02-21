//const passport = require('../config/passport');
const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');
const pushNotificationController = require('../controllers/pushNotificationController');
 

module.exports = {

    async getAll(req, res, next){
        try{
            const data =await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async findDeliveryMen(req, res, next){
        try{
            const data =await User.findByDeliveryMen();
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async register(req,res,next){
        try {
            
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1);
            const token = jwt.sign({id: data.id , email:user.email}, keys.secretOrKey, {
                //
            })

            const myData = {
                id: data.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                dni: user.dni,
                phone: user.phone,
                image: user.image,
                session_token: `JWT ${token}`
            };

            return res.status(201).json({
                success:true,
                message: 'El registro se realizo correctamente',
                data: myData
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },

    async login(req, res, next){

        try {

            const tokens = await User.getAdminsNotificationsTokens();
            let tokensString = []
            tokens.forEach(t=>{
                tokensString.push(t.notification_token)
            });
            
            // console.log('TOKENS', tokensString);
            // pushNotificationController.sendNotificationToMultipleDevices(tokensString,{
            //     title: 'Sesion Iniciada',
            //     body: 'Un cliente ha iniciado sesion',
            //     id_notification: '1'
            // });
            //pushNotificationController.sendNotification('cem5PRBaQ4aYtY9rpaNHJS:APA91bEaHaImIs01SgnqwSEt_c6TXFeddVeYEGyP1LsnX9qY5zIM8YjQnvHZ6f7gu9O5aiU-7GmNVtvzLgM87RwOL6ccyDPO1a8Tfb1iu9gnfcf5niC-HLJn1Y3eMN4phqU59stu6_TK',{
           //     title: 'Sesion Iniciada',
           //     body: 'Un cliente ha iniciado sesion',
            //    id_notification: '1'
          //  });


            const email = req.body.email;
            const password = req.body.password;
            const myUser = await User.findByEmail(email);
            
            if (!myUser){
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                })
            }
            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            
            if(isPasswordValid){
                const token = jwt.sign({id: myUser.id , email:myUser.email}, keys.secretOrKey, {
                    //
                })

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    dni: myUser.dni,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };
                
                await User.updateSessionToken(myUser.id, `JWT ${token}`);

                console.log(`USUARIO ENVIADO ${data}`)

                return res.status(201).json({
                    success: true,
                    message: 'El usuario ha sido autenticado',
                    data: data
                });
            }else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta',
                });
            }           
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },

    async update(req,res,next){

        try {

            const user = JSON.parse(req.body.user); //CLIENTE DEBE ENVIARNOS UN OBJETO USER
            const files = req.files;

            if(files.length > 0){ //CLIENTE NOS ENVIA UN ARCHIVO
                
                const pathImage = `image_${Date.now()}`;//NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if(url != undefined && url != null){
                    user.image = url;
                }
            }
            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualizado correctamente',
                data: user
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un al actualizar los datos del usuario',
                error: error
            });
        }
    },

    async updateWithoutImage(req,res,next){

        try {

            const user = req.body; //CLIENTE DEBE ENVIARNOS UN OBJETO USER

            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualizado correctamente',
                data: user
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un al actualizar los datos del usuario',
                error: error
            });
        }
    },

    async updateNotificationToken(req,res,next){

        try {

            const user = req.body; // CLIENTE

            await User.updateNotificationToken(user.id, user.notification_token);

            return res.status(201).json({
                success: true,
                message: 'El token de notificaciones se ha almacenado correctamente',
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar el token de notificaciones',
                error: error
            });
        }
    }
    
};