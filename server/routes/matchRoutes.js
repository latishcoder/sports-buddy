const express = require('express');
const router = express.Router();
const {
  getMatches,
  getMatch,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getMatches);
router.post('/', protect, createMatch);
router.get('/:id', getMatch);
router.post('/:id/join', protect, joinMatch);
router.post('/:id/leave', protect, leaveMatch);
router.delete('/:id', protect, deleteMatch);

module.exports = router;
