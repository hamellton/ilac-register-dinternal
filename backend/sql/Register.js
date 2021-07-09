// get the client
const mysql = require('mysql2');
const config = require('./config');
const logger = require('../logger/Pino');

// create the connection to database
const pool = mysql.createPool(config);

const promisePool = pool.promise();

const checkEmailExist = async (email) => {
  const select = 'SELECT * FROM `subscribers` WHERE `email` = ?';
  const [rows, fields] = await promisePool.query(select, [email], (err, results) => {
    if (err) throw err;
  });
  return !!(rows[0]);
};
let registrationInfo = {
  status: 'init',
  id: '',
  number: '-',
  name: '',
  lname: '',
  phone: '',
  email: '',
  total: 0,
  feePercent: 0.0282776,
  fee: 0,
  totalfeesumm: 0,
};

const registerUser = async (val) => {
  await checkEmailExist(val.email)
    .then((result) => {
      // set email exist status
      // registrationInfo.status = (result) ? 'email exist' : 'allow registration';
      // disallow status
      registrationInfo.status = 'allow registration';
    })
    .then(async () => {
      if (registrationInfo.status === 'allow registration') {
        const insert = 'INSERT INTO subscribers(email,phone,name,l_name,age,center,birth,level_id,session_month,session_year,total,contract_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
        const [value] = await promisePool.query(insert, [
          val.email,
          val.phone,
          val.name,
          val.lname,
          val.old,
          val.center,
          val.birth,
          val.level,
          val.month,
          val.year,
          val.total,
          val.contract,
        ], (err, results) => {
          if (err) throw err;
        });
        registrationInfo.status = 'registration in progress';
        registrationInfo.id = value.insertId;
        registrationInfo.name = val.name;
        registrationInfo.lname = val.lname;
        registrationInfo.level = val.level;
        registrationInfo.birth = val.birth;
        registrationInfo.phone = val.phone;
        registrationInfo.email = val.email;
        registrationInfo.total = Number(val.total);
        registrationInfo.contract = val.contract;
        registrationInfo.fee = (+val.total * +registrationInfo.feePercent).toFixed(2);
        registrationInfo.totalfeesumm = (+registrationInfo.total + +registrationInfo.fee).toFixed(2);
      }
    })
    .then(async () => {
      if (registrationInfo.status === 'registration in progress') {
        const uniqueNumber = [val.center, val.month, val.year, registrationInfo.id].join('_');
        const update = 'UPDATE subscribers SET number = ? WHERE ID = ?';
        const [value] = await promisePool.query(update, [
          uniqueNumber,
          registrationInfo.id,
        ], (err, results) => {
          if (err) throw err;
        });
        registrationInfo.status = 'registered';
        registrationInfo.number = uniqueNumber;
      };
    })
    .catch((err) => {
      
      logger.info(err);
      logger.error(err);
    });
  return registrationInfo;
};


module.exports = {
  registerUser,
  // emailExist,
};
