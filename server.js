const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('MongoDB connected');
// }).catch(err => {
//     console.error('MongoDB connection error:', err);
// });

mongoose.connect(process.env.MONGODB_URI)
.then (()=>{
    console.log("Connection Successful")
})
.catch (()=>{
    console.log("Connection error")
})

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port");
});
