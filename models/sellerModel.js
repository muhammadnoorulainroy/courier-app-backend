const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    phone: { 
        type: String, 
        required: [true, 'Phone number is required'], 
        unique: true,
        match: [/^[+][1-9][0-9]{9,14}$/, 'Phone number must start with + and contain 10-15 digits.']
    },
    firstName: { 
        type: String, 
        required: [true, 'First name is required'], 
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        match: [/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces']
    },
    lastName: { 
        type: String, 
        required: [true, 'Last name is required'], 
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        match: [/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces']
    },
    businessName: { 
        type: String, 
        required: [true, 'Business name is required'], 
        minlength: [2, 'Business name must be at least 2 characters long'],
        maxlength: [100, 'Business name cannot exceed 100 characters'],
        match: [/^[A-Za-z0-9\s'-.]+$/, 'Business name can only contain letters, numbers, spaces, and limited special characters (\' - .)']
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);
