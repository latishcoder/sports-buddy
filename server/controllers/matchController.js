const Match = require('../models/Match');

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
const getMatches = async (req, res) => {
  try {
    const { sport, page = 1, limit = 10 } = req.query;
    const query = {};

    if (sport) {
      query.sportName = { $regex: sport, $options: 'i' };
    }

    // Only show upcoming matches
    query.date = { $gte: new Date() };

    const skip = (Number(page) - 1) * Number(limit);

    const [matches, total] = await Promise.all([
      Match.find(query)
        .populate('createdBy', 'name email')
        .populate('participants', 'name email')
        .sort({ date: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Match.countDocuments(query),
    ]);

    res.json({
      matches,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(500).json({ message: 'Error fetching match' });
  }
};

// @desc    Create a match
// @route   POST /api/matches
// @access  Private
const createMatch = async (req, res) => {
  try {
    const { sportName, location, date, playersNeeded, description, skillLevel } = req.body;

    if (!sportName || !location || !date || !playersNeeded) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: 'Match date must be in the future' });
    }

    const match = await Match.create({
      sportName,
      location,
      date,
      playersNeeded,
      description,
      skillLevel,
      createdBy: req.user._id,
      participants: [req.user._id],
    });

    const populated = await Match.findById(match._id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating match' });
  }
};

// @desc    Join a match
// @route   POST /api/matches/:id/join
// @access  Private
const joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const userId = req.user._id.toString();

    if (match.participants.map((p) => p.toString()).includes(userId)) {
      return res.status(400).json({ message: 'You have already joined this match' });
    }

    if (match.participants.length >= match.playersNeeded) {
      return res.status(400).json({ message: 'This match is already full' });
    }

    if (new Date(match.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot join a past match' });
    }

    match.participants.push(req.user._id);
    await match.save();

    const populated = await Match.findById(match._id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    res.json(populated);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(500).json({ message: 'Error joining match' });
  }
};

// @desc    Leave a match
// @route   POST /api/matches/:id/leave
// @access  Private
const leaveMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const userId = req.user._id.toString();

    if (match.createdBy.toString() === userId) {
      return res.status(400).json({ message: 'Creator cannot leave. Delete the match instead.' });
    }

    if (!match.participants.map((p) => p.toString()).includes(userId)) {
      return res.status(400).json({ message: 'You are not a participant in this match' });
    }

    match.participants = match.participants.filter((p) => p.toString() !== userId);
    await match.save();

    const populated = await Match.findById(match._id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error leaving match' });
  }
};

// @desc    Delete a match
// @route   DELETE /api/matches/:id
// @access  Private (creator only)
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can delete this match' });
    }

    await match.deleteOne();
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(500).json({ message: 'Error deleting match' });
  }
};

module.exports = { getMatches, getMatch, createMatch, joinMatch, leaveMatch, deleteMatch };
