const Event = require("../models/eventSchema");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found in the database" });
    }
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, type, date, year } = req.body;
    if (!name || !type || !date) {
      return res.status(400).json({ message: "Name, type, and date are required" });
    }
    const event = new Event({ name, type, date: new Date(date), year });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Event with this name and date already exists" });
    } else {
      console.error("Error creating event:", error.message);
      res.status(400).json({ message: "Error creating event", error: error.message });
    }
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, date, year } = req.body;
    if (!name || !type || !date) {
      return res.status(400).json({ message: "Name, type, and date are required" });
    }
    const event = await Event.findByIdAndUpdate(
      id,
      { name, type, date: new Date(date), year },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Event with this name and date already exists" });
    } else {
      console.error("Error updating event:", error.message);
      res.status(400).json({ message: "Error updating event", error: error.message });
    }
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(400).json({ message: "Error deleting event", error: error.message });
  }
};