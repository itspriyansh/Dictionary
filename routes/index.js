var express = require('express');
var router = express.Router();
const Word = require('../models/word');

const wordsFieldsList = ['_id', 'word', 'createdAt', 'updatedAt'];

const filterFields = function(object, fieldsList) {
  const wrapper = {};
  fieldsList.forEach(field => {
    wrapper[field] = object[field];
  });
  return wrapper;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  Word.find({}, wordsFieldsList, {sort: { createdAt: -1 }})
  .then(wordsList => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(wordsList);
  }).catch(error => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({});
  });
});

router.post('/', function(req, res, next) {
  Word.create(req.body)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(filterFields(response, wordsFieldsList));
  }).catch(error => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({});
  });
});

router.put('/:wordId', function(req, res, next) {
  Word.findByIdAndUpdate(req.params.wordId, req.body, {new: true})
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(filterFields(response, wordsFieldsList));
  }).catch(error => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({});
  });
});

router.delete('/:wordId', function(req, res, next) {
  Word.findByIdAndDelete(req.params.wordId)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true});
  }).catch(error => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({});
  });
});

module.exports = router;
