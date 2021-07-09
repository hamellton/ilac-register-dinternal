const nodemailer = require('nodemailer');
const Email = require('email-templates');

// const transporter = nodemailer.createTransport({
//   host: 'localhost',
//   port: 25,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: 'pay',
//     pass: 'Jb9L1DavWzA3',
//   },
//   tls: {
//     // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
// });

// gmail.com
// const transporter = nodemailer.createTransport({
//   host: 'aspmx.l.google.com',
//   port: 25,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: 'o.perepichai@gmail.com',
//     pass: 'F!ktrcfylhG',
//   },
//   tls: {
//   // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
// });

//ukr.net
// pXOCBRHiqescKsoX
// smtp.ukr.net
// 2525
// ilacregistration@ukr.net

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 2525,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: 'ilacregistration@ukr.net',
    pass: 'pXOCBRHiqescKsoX',
  },
  tls: {
  // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
});

module.exports = email;
