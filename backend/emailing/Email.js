const email = require('./config');

const sendEmail = (useremail, name, details) => {
  email.send({
    template: 'hello',
    message: {
      from: 'ILAC <ilacregistration@ukr.net>',
      to: useremail,
      // cc: 'ilacregistration@ukr.net',
    },
    locals: {
      fname: name,
      details,
    },
  }).then(() => console.log(`email has been send to ${useremail}!`));
};

const sendEmailPaid = (useremail, name) => {
  email.send({
    template: 'successPaid',
    message: {
      from: 'ILAC <ilacregistration@ukr.net>',
      to: useremail,
      // cc: 'ilacregistration@ukr.net',
      attachments: [{
        filename: 'ticket.pdf',
        path: `pdfReceipts/${useremail}.pdf`,
      }],
    },
    locals: {
      fname: name,
    },
  }).then(() => console.log('emailPaid has been send!'));
};

const sendReceiptToEmail = (useremail, name, center) => {
  email.send({
    template: 'receipt',
    message: {
      from: 'ILAC <ilacregistration@ukr.net>',
      to: useremail,
      // cc: 'ilac.kyiv@gmail.com',
      attachments: [{
        filename: 'receipt.pdf',
        path: `pdfReceipts/${useremail}.pdf`,
      }],
    },
    locals: {
      fname: name,
      center,
    },
  }).then(() => console.log(`Receipt has been send to candidate ${useremail}`));
};


const sendNotificationToCenterEmail = (useremail, student, level) => {
  email.send({
    template: 'centerNotification',
    message: {
      from: 'ILAC <ilacregistration@ukr.net>',
      to: useremail,
      // to: 'o.perepichai@gmail.com',
      attachments: [{
        filename: 'receipt.pdf',
        path: `pdfReceipts/${student.email}.pdf`,
      }],
      // cc: 'ilac.kyiv@gmail.com',
    },
    locals: {
      student,
      level,
    },
  }).then(() => console.log(`email has been send to center ${useremail}!`));
};

const sendNotificationToIlac = (useremail, student, level) => {
  email.send({
    template: 'notificationIlac',
    message: {
      from: 'ILAC <ilacregistration@ukr.net>',
      to: useremail,
    },
    locals: {
      student,
      level,
    },
  }).then(() => console.log(`email has been send to ILAC ${useremail}!`));
};


module.exports = {
  sendEmail,
  sendEmailPaid,
  sendReceiptToEmail,
  sendNotificationToCenterEmail,
  sendNotificationToIlac,
}