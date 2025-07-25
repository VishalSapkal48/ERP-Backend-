const mongoose = require("mongoose");
const { parse, isValid } = require("date-fns");

// Define the Event Schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Festival", "Holiday", "Anniversary", "Director Birthday", "Employee Birthday"],
    required: true,
  },
  date: { type: Date, required: true },
  year: { type: Number },
}, { timestamps: true });

eventSchema.index({ name: 1, date: 1 }, { unique: true });

const Event = mongoose.model("Event", eventSchema);

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://vishalsapkal840:1R5AjXsFaN1bRUNV@cluster0.gevbniu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch(err => {
  console.error("Connection error:", err);
  process.exit(1);
});

// Data to seed
const anniversaries = [
  { name: "YNK Anniversary", date: "11th November" },
];

const festivals = [
  { name: "Gudipadwa", date: "29th March" },
  { name: "Independence Day", date: "15th August" },
  { name: "Ganesh Chaturthi", date: "5th September" },
  { name: "Diwali", date: "20th October" },
  { name: "Vijaya Dashami (Dussehra)", date: "1st October" },
  { name: "Republic Day", date: "26th January" },
  { name: "Yogini Ekadashi", date: "25th June" },
  { name: "Maharashtra Day", date: "1st May" },
  { name: "Gandhi Jayanti", date: "2nd October" },
  { name: "Women's Day", date: "8th March" },
];

const holidays = [
  { name: "Republic Day", date: "26th January" },
  { name: "Mahashivratri", date: "26th February" },
  { name: "Dhuli Vandan (Holi)", date: "14th March" },
  { name: "Maharashtra Day", date: "1st May" },
  { name: "Independence Day", date: "15th August" },
  { name: "Anant Chaturthi", date: "12th September" },
  { name: "Dussehra (Gandhi Jayanti)", date: "2nd October" },
  { name: "Laxmi Poojan", date: "20th October" },
  { name: "Diwali Padawa", date: "21st October" },
  { name: "Bhahu Bhij", date: "22nd October" },
  { name: "Diwali", date: "20th October" },
];

const directors = [
  { name: "Navnath Sir", dob: "7th October" },
  { name: "Vishwas Sir", dob: "7th March" },
  { name: "Amar Sir", dob: "17th February" },
  { name: "Amol Sir", dob: "21st November" },
  { name: "Datta Sir", dob: "2nd June" },
];

const employees = [
  { name: "Dipak Gayakar Sir", dob: "27/05/1987" },
  { name: "Mauli Jadhav Sir", dob: "18/04/1999" },
  { name: "Sainath Kamble", dob: "07-01-1996" },
  { name: "Prashant Hanwate", dob: "08-07-1990" },
  { name: "Shubham Pund", dob: "26/11/2000" },
  { name: "Sainath Jorgewar", dob: "24/11/1999" },
  { name: "Sayali More Ma'am", dob: "23/04/2001" },
  { name: "Mukeshkumar Koli Sir", dob: "16/09/2001" },
  { name: "Rinkoo Shakya Sir", dob: "11-01-1999" },
  { name: "Santoshi Ganjare Ma'am", dob: "18/09/1988" },
  { name: "Madhuri Pangare Ma'am", dob: "28/01/1990" },
  { name: "Aboli Sawant Ma'am", dob: "20/02/1993" },
  { name: "Bhushan Devrukhkar Sir", dob: "12-05-1988" },
  { name: "Vicky Ingle Sir", dob: "15/08/1999" },
  { name: "Pooja Lamdade Ma'am", dob: "26/11/1998" },
  { name: "Nilam Bhosale Ma'am", dob: "16/03/1998" },
];

// Parse date strings into Date objects
const parseDate = (dateStr, type, name) => {
  try {
    let parsedDate;
    let year;

    if (dateStr.includes("/") || dateStr.includes("-")) {
      const parts = dateStr.includes("/") ? dateStr.split("/") : dateStr.split("-");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      year = parts[2] ? parseInt(parts[2], 10) : 2025;
      parsedDate = new Date(year, month, day);
    } else {
      const match = dateStr.match(/^(\d{1,2})(?:st|nd|rd|th)?\s(\w+)/);
      if (!match) throw new Error(`Invalid date format for ${name}: ${dateStr}`);
      const day = parseInt(match[1], 10);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      const month = monthNames.indexOf(match[2]);
      if (month === -1) throw new Error(`Invalid month for ${name}: ${match[2]}`);
      year = type.includes("Birthday") ? undefined : 2025;
      parsedDate = new Date(2025, month, day);
    }

    if (!isValid(parsedDate)) throw new Error(`Invalid date for ${name}: ${dateStr}`);

    return {
      name,
      type,
      date: parsedDate,
      year: type.includes("Birthday") && year ? year : undefined,
    };
  } catch (error) {
    console.error(`Error parsing date for ${name} (${type}):`, error.message);
    return null;
  }
};

// Combine all events
const allEvents = [
  ...anniversaries.map(a => parseDate(a.date, "Anniversary", a.name)),
  ...festivals.map(f => parseDate(f.date, "Festival", f.name)),
  ...holidays.map(h => parseDate(h.date, "Holiday", h.name)),
  ...directors.map(d => parseDate(d.dob, "Director Birthday", d.name)),
  ...employees.map(e => parseDate(e.dob, "Employee Birthday", e.name)),
].filter(Boolean);

// Seed the database
const seedDatabase = async () => {
  try {
    await mongoose.connection.dropCollection("events").catch(() => console.log("No events collection to drop"));
    console.log("Cleared existing events");
    
    const insertedEvents = await Event.insertMany(allEvents);
    console.log(`Successfully inserted ${insertedEvents.length} events`);
    
    insertedEvents.forEach(event => {
      console.log(`Inserted: ${event.name} (${event.type}) - ${event.date.toISOString()} ${event.year ? `Year: ${event.year}` : ""}`);
    });
    
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Ensure connection is open before seeding
mongoose.connection.on("open", () => {
  console.log("Starting database seeding...");
  seedDatabase();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});