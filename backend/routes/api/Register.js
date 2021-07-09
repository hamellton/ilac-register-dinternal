const express = require('express');
const bodyParser = require('body-parser');
const email = require('../../emailing/Email');
const sql = require('../../sql/Register');
const sqlGetValue = require('../../sql/GetValue');
const pdf = require('../../pdf/CreateReceipt');
const log = require('../../logger/Pino');
// const path = require('path');
// const appPath = path.join(__dirname, '/payment/liqpay/PayButton');

// const rootPath = path.dirname(require.main.filename);
const liqpay = require('../../payment/liqpay/PayButton');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const test = {
  email: 'test@gmail.com',
};

router.get('/check/email/:email', (req, res) => {
  if (req.params.email === test.email) res.send(`email ${req.params.email} has been founded in database!`);
  else res.send('no email has been found');
});

router.post('/', (req, res) => {
  const valueObj = {};
  let student = {};
  valueObj.old = (req.body.yearsoldmore) ? req.body.yearsoldmore : req.body.yearsoldless;
  valueObj.name = (req.body.firstnamemore) ? req.body.firstnamemore : req.body.firstnameless;
  valueObj.lname = (req.body.lastnamemore) ? req.body.lastnamemore : req.body.lastnameless;
  valueObj.email = (req.body.emailmore) ? req.body.emailmore : req.body.emailless;
  valueObj.phone = (req.body.phonemore) ? req.body.phonemore : req.body.phoneless;
  valueObj.center = (req.body.centermore) ? req.body.centermore : req.body.centerless;
  valueObj.level = (req.body.levelmore) ? req.body.levelmore : req.body.levelless;
  valueObj.month = (req.body.monthmore) ? req.body.monthmore : req.body.monthless;
  valueObj.year = (req.body.yearmore) ? req.body.yearmore : req.body.yearless;
  valueObj.birth = (req.body.birthmore) ? req.body.birthmore : req.body.birthless;
  valueObj.total = (req.body.costmore) ? req.body.costmore : req.body.costless;
  valueObj.contract = (req.body.contractmore) ? req.body.contractmore : req.body.contractless;

  sql.registerUser(valueObj)
    .then((result) => {
      student = Object.assign(result);
      const btnDescription = `Реєстраційний номер: ${result.number}`;
      log.info('module register: Start to create pdf');
      pdf.createReceipt(result.email, result.name, result.lname, result.number, result.total);
      log.info('module register: finished creating pdf');
      if(result.totalfeesumm) {
        result.btn = liqpay.prepareBtnHtml(result.totalfeesumm, result.id, result.name, result.lname, btnDescription);
        // ниже заглушка
        result.btn = '<p></p>';
      }
      // liqpay.prepareBtnEmail(result.totalfeesumm, result.id, result.name, result.lname, result.email, btnDescription);
      // email.sendEmail(result.email, result.name, { number: result.number, phone: result.phone, center: result.center });
      return student;
    })
    .then(async (result) => {
      try {
        log.info(`await sqlGetValue.getCenterByID started`);
        const value = await sqlGetValue.getCenterByID(valueObj.center);
        log.info(`sqlGetValue.getCenterByID value is ${value.name}`);
        email.sendReceiptToEmail(result.email, result.name, value);
        log.info(`email.sendReceiptToEmail was run`);
        return { student: result, center: value };
      } catch (err) {
        log.info(err);
        log.error(err);
        console.log(`Ошибка при выполнении getCenterByID ${err}`);
      }
    })
    .then((result) => {
      log.info(`sqlGetValue.getLevel started`);
      sqlGetValue.getLevel(valueObj.level).then((value) => {
        email.sendNotificationToCenterEmail(result.center.email, result.student, value);
        email.sendNotificationToIlac('ilacregistration@ukr.net', result.student, value);
        log.info(`sqlGetValue.getLevel finished`);
        // console.log(`Level is: ${value.name}`);
        return value;
      })
        .catch(err => {
          log.info(err);
          log.error(err);
          console.log(err);
        });
      res.send(result);
    })
    .catch(err => {
      log.info(err);
      log.error(err);
      console.log(err);
    });

});

router.post('/success', (req, res) => {
  res.send('<h2>Успішна сплата ...</h2>');
});

router.post('/pdf', (req, res) => {
  pdf.createReceipt('test@gmail.com', 'Test', 'Testovych', '1234567890');
  res.send('<h2>рахунок створено!</h2>');
});

router.post('/paid', (req, res) => {
  console.log(req.body);
  email.sendEmailPaid('o.perepichai@gmail.com', 'Aleksandr');
});

module.exports = router;
