const express = require('express');
const router = express.Router();

const messages = [
  {
    id: 1,
    created_at: (new Date()),
    text: 'You are fired',
    author: 'Trump',
  },
];

/* GET messages listing. */
router.get('/', function(req, res, next) {
  const sortDirection = req.query.sort_direction || 'asc';
  const preparedData = messages.sort((a,b) => {
    if (sortDirection === 'desc') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });
  res.render('messages', { title: 'Messages', messages: preparedData });
});

/* POST message. */
router.post('/', function(req, res, next) {
  messages.push({
    id: messages.length + 1,
    author: req.body.author,
    text: req.body.text,
    created_at: new Date(),
  });
  res.redirect('/messages');
});

module.exports = router;
