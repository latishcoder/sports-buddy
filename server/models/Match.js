const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    sportName: {
      type: String,
      required: [true, 'Sport name is required'],
      trim: true,
      maxlength: [50, 'Sport name cannot exceed 50 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    playersNeeded: {
      type: Number,
      required: [true, 'Number of players needed is required'],
      min: [2, 'At least 2 players needed'],
      max: [100, 'Cannot exceed 100 players'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Virtual for spots remaining
matchSchema.virtual('spotsRemaining').get(function () {
  return this.playersNeeded - this.participants.length;
});

matchSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Match', matchSchema);
