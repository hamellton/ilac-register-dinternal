const PDFDocument = require('pdfkit');
const PdfPrinter = require('pdfmake');
const log = require('../logger/Pino');

// Define font files
const fonts = {
  Roboto: {
    normal: 'pdf-src/fonts/Roboto-Regular.ttf',
    bold: 'pdf-src/fonts/Roboto-Bold.ttf',
    italics: 'pdf-src/fonts/Roboto-Italic.ttf',
    bolditalics: 'pdf-src/fonts/Roboto-Italic.ttf',
  },
};

const printer = new PdfPrinter(fonts);
const fs = require('fs');
const path = require('path');
// console.log(path.resolve('pdf-src/img/logo.png'));
// log.info(path.resolve('pdf-src/img/logo.png'));

// Create a document
const doc = new PDFDocument;


const createReceipt = (useremail, name, lName, number, total) => {
  const docDefinition = {
    content: [
      // every object is new line in pdg file
      {
        image: path.resolve('pdf-src/img/logo.png'),
        width: 100,
        margin: [0, 0, 0, 20],
      },
      {
        image: path.resolve('pdf-src/img/head.png'),
        width: 530,
      },
      {
        text: 'ОБОВ’ЯЗКОВО в призначенні платежу вказувати РЕЄСТРАЦІЙНИЙ НОМЕР ТА ПІБ КАНДИДАТА, ЩО СКЛАДАТИМЕ ІСПИТ',
        style: 'header',
        bold: true,
        margin: [10, 10, 0, 10],
      },
      {
        text: `ПІБ кандидата: ${name} ${lName}`,
        style: 'header',
        bold: false,
        margin: [10, 10, 0, 10],
      },
      {
        text: `Реєстраційний номер кандидата: ${number}`,
        style: 'header',
        bold: false,
        margin: [10, 10, 0, 10],
      },
      {
        text: `Сума до сплати: ${total} грн.`,
        style: 'header',
        bold: false,
        margin: [10, 10, 0, 10],
      },
      // {
      //   text: 'Квитанція',
      //   style: 'subheader',
      // },
      // {
      //   style: 'tableExample',
      //   table: {
      //     widths: [100, '*', 200, '*'],
      //     body: [
      //       ['width=100', 'star-sized', 'width=200', 'star-sized'],
      //       ['Текст першого стовбця', {
      //         text: 'Текст другого стовбця',
      //         italics: true,
      //         color: 'gray',
      //       }, {
      //         text: 'nothing interesting here',
      //         italics: true,
      //         color: 'gray',
      //       }, {
      //         text: 'nothing interesting here',
      //         italics: true,
      //         color: 'gray',
      //       }],
      //     ],
      //   },
      // },
    ],
    defaultStyle: {
      fontSize: 14,
      bold: false,
    },
  };

  const options = {
    // ...
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream(`pdfReceipts/${useremail}.pdf`));
  pdfDoc.end();
  log.info(`pdfReceipt has been created for: ${useremail}`);
  console.log(`pdfReceipt has been created for: ${useremail}`);
};

// var docDefinition = {
// 	content: [
// 		'pdfmake (since it\'s based on pdfkit) supports JPEG and PNG format',
// 		'If no width/height/fit is provided, image original size will be used',
// 		{
// 			image: 'fonts/sampleImage.jpg',
// 		},
// 		'If you specify width, image will scale proportionally',
// 		{
// 			image: 'fonts/sampleImage.jpg',
// 			width: 150
// 		},
// 		'If you specify both width and height - image will be stretched',
// 		{
// 			image: 'fonts/sampleImage.jpg',
// 			width: 150,
// 			height: 150,
// 		},
// 		'You can also fit the image inside a rectangle',
// 		{
// 			image: 'fonts/sampleImage.jpg',
// 			fit: [100, 100],
// 			pageBreak: 'after'
// 		},
// 		'Images can be also provided in dataURL format\n(the one below was taken from http://www.clipartbest.com/clipart-dT7zx5rT9)',
// 		{
// 			image: testImageDataUrl,
// 			width: 200
// 		},
// 		'or be defined in the "images" dictionary, which can be referenced by name:',
// 		{
// 			image: 'bee',
// 			width: 200
// 		},
// 		'and opacity is supported:',
// 		{
// 			image: 'fonts/sampleImage.jpg',
// 			width: 150,
// 			opacity: 0.5
// 		},
// 	],
// 	images: {
// 		bee: testImageDataUrl
// 	}
// };


module.exports = {
  createReceipt,
};
