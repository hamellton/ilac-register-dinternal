const LiqPay = require('./liqpaySDK');
const config = require('./config');

const liqpay = new LiqPay(config.public_key, config.private_key);

const prepareBtnHtml = (amount, id, fname, sname, description) => {
  const html = liqpay.cnb_form({
    action: 'pay',
    amount,
    currency: 'UAH',
    description,
    order_id: id,
    version: '2',
    language: 'en',
    sender_first_name: fname,
    sender_last_name: sname,
    // result_url: 'localhost:8080/api/register/success',
    // server_url: 'localhost:8000/api/register/paid',
    result_url: 'http://register.ilac.com.ua',
    server_url: '194.183.174.227:8000/api/register/paid',
  });
  return html;
};

const prepareBtnEmail = (amount, id, fname, sname, email, description) => {
  liqpay.api('request', {
    action: 'invoice_send',
    action_payment: 'pay',
    email,
    amount,
    description,
    currency: 'UAH',
    // goods    : [{
    //   amount : 10000,
    //   count  : 1,
    //   unit   : "шт.",
    //   "name"   : "іспит"
    //   }],
    order_id: id,
    version: '3',
    language: 'uk',
    sender_first_name: fname,
    sender_last_name: sname,
    result_url: 'http://register.ilac.com.ua',
    server_url: '194.183.174.227:8000/api/register/paid',
  }, (json) => {
    console.log(`Email status: ${json.status}`);
  });
};

module.exports = {
  prepareBtnHtml,
  prepareBtnEmail,
};
