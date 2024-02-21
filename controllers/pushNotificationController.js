const https= require('https');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');


module.exports = {
    sendNotification(token, data){
        const notification = JSON.stringify({
            'to':token,
            "data":{
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification
            },
            'priority': 'high',
            'ttl': '4500s',
        });
        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA9eEyvvs:APA91bFCK3nR1hbkCxeZ94gwb1oURr_tDyYcnRk7Y-tw3QbXko-B7ZNLLGkBD6NQzmRuhMsZ1cPu7Fx6FEFcpc0ocS-x66eE8k-8OKZ5QAyC9zxYThKROwltGjcigw3esTsrO6lEatAJ'
            }
        }
        const req = https.request(options, (res) =>{
            console.log('Status code notification',res.statusCode);
            res.on('data',(d) =>{
                process.stdout.write(d)
            })
        })

        req.on('error', (error)=>{
            console.error(error)
        })

        req.write(notification);
        req.end();
    },
    sendNotificationToMultipleDevices(tokens, data){
        const notification = JSON.stringify({
            'registration_ids':tokens,
            "data":{
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification
            },
            'priority': 'high',
            'ttl': '4500s',
        });
        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA9eEyvvs:APA91bFCK3nR1hbkCxeZ94gwb1oURr_tDyYcnRk7Y-tw3QbXko-B7ZNLLGkBD6NQzmRuhMsZ1cPu7Fx6FEFcpc0ocS-x66eE8k-8OKZ5QAyC9zxYThKROwltGjcigw3esTsrO6lEatAJ'
            }
        }
        const req = https.request(options, (res) =>{
            console.log('Status code notification',res.statusCode);
            res.on('data',(d) =>{
                process.stdout.write(d)
            })
        })

        req.on('error', (error)=>{
            console.error(error)
        })

        req.write(notification);
        req.end();
    }
}