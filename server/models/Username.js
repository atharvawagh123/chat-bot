const mongoose = require('mongoose');

// Define the schema for your Username collection
const usernameSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Export the model
module.exports = mongoose.model('Username', usernameSchema, 'Username'); // Third parameter 'Username' specifies the collection name
