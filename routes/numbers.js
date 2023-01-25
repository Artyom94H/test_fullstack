const express = require('express');
const router = express.Router();

const AverageCalculatorService = require('../services/average-calculator');
const { emitTimeout } = require('../utils');

const list = [
  // {
  //   id: 1,
  //   completed: true,
  //   previous: 2,
  //   current: 6,
  // },
];

/* GET numbers page. */
router.get('/', function(req, res, next) {
  const preparedData = [...list];
  res.render('numbers', { title: 'Numbers', list: preparedData });
});

/* GET numbers lists. */
router.get('/data', async function(req, res, next) {
  const preparedData = AverageCalculatorService.prepareData(list);
  const { emitLoader } = req.query;
  console.log('emitLoader', emitLoader);
  if (emitLoader) {
    await emitTimeout(3000);
  }
  res.send({
    data: preparedData,
  });
});

/* POST number. */
router.post('/', async function(req, res, next) {
  AverageCalculatorService.addNumber(+req.body.number, list);
  const preparedData = AverageCalculatorService.prepareData(list);
  await emitTimeout();
  res.send({
    data: preparedData,
  });
});

module.exports = router;
