// User schema

const db = require("mongoose");

const User = new db.Schema({ 
    userId: { type: String, required: true },
    economy: {
        coins: { type: Number, default: 0 }
    },
    cooldowns: {
        daily: { type: Date },
        work: { type: Date },
    }
    
});

module.exports = db.model('User', User); 