const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get("/", (_req, res) => {
    res.send("Contact Keeper API is UP!");
});

// Define our routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))