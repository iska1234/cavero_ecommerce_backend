const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114,function(stringValue){
    return stringValue;
});

const databaseConfig = {
    'host':'containers-us-west-113.railway.app',
    'port':6984,
    'database':'railway',
    'user':'postgres',
    'password':'57KPsMaXPNkdJQptwxlM'
};

const db =pgp(databaseConfig);

module.exports = db;