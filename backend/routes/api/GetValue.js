const express = require('express');
const bodyParser = require('body-parser');
const sql = require('../../sql/GetValue');

const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true,
}));
router.use(bodyParser.json());

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/levels', (req, res) => {
  // console.log('/levels');
  sql.getLevels().then((resp) => {
    res.send(resp);
  });
});

router.get('/centers', (req, res) => {
  // console.log('/levels');
  sql.getCenters().then((resp) => {
    res.send(resp);
  })
    .catch(err => {
      console.log(err);
    });
});

router.get('/cities', (req, res) => {
  // console.log('/levels');
  sql.getCities().then((resp) => {
    res.send(resp);
  })
    .catch(err => {
      console.log(err);
    });
});

router.post('/cities', (req, res) => {
  console.log('city '+req.body.name);
  sql.getCentersByCity(req.body.name).then((resp) => {
    res.send(resp);
  })
    .catch(err => {
      console.log(err);
    });
});

router.post('/levels/id', (req, res) => {
  if (!req.body.id) {
    res.send({
      price: 0,
    });
  }
  sql.getLevel(req.body.id).then((resp) => {
    res.send(resp);
  })
    .catch(err => {
      console.log(err);
    });
});

router.post('/contract/id', (req, res) => {
  if (!req.body.id) {
    res.send({
      id: 0,
    });}
  sql.getContract(req.body.id).then((resp) => {
    res.send(resp);
  })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;
