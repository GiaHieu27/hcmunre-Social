const express = require('express');
const router = express.Router();

const { authUser } = require('../middleware/auth');
const {
  search,
  addToSearchHistory,
  getSearchHistory,
  removeHistorySearch,
} = require('.././controllers/user/Search');

router.post('/search/:searchTerm', authUser, search);
router.put('/addToSearchHistory', authUser, addToSearchHistory);
router.put('/removeHistorySearch', authUser, removeHistorySearch);
router.get('/getSearchHistory', authUser, getSearchHistory);

module.exports = router;
