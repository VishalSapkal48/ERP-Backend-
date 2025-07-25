const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Anniversary",
        "Holiday",
        "Director Birthday",
        "Employee Birthday",
        "Festival",
        "Other",
      ],
      required: true,
    },
    date: { type: Date, required: true },
    year: { type: Number },
  },
  { timestamps: true }
);

// Prevent duplicate events for the same name and date
eventSchema.index({ name: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Event", eventSchema);