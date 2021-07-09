const express = require('express');
const bodyParser = require('body-parser');
const email = require('../../emailing/Email');
// const sql = require('../../sql/Register');
// const liqpayBtnHtml = require('../../payment/liqpay/PayButton');

const router = express.Router();


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.post('/', (req, res) => {
  console.log(req);
});


// router.post('/paid', (req, res) => {
//   console.log(req.body);
//   email.sendEmailPaid('o.perepichai@gmail.com', 'Aleksandr');
// });

module.exports = router;
