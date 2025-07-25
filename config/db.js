const mongoose = require('mongoose');

     const connectDB = async () => {
       try {
         await mongoose.connect('mongodb+srv://vishalsapkal840:1R5AjXsFaN1bRUNV@cluster0.gevbniu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
         console.log('MongoDB connected successfully');
       } catch (error) {
         console.error('MongoDB connection error:', error);
         process.exit(1);
       }
     };

     module.exports = connectDB;