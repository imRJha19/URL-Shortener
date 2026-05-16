const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        redirectURL: {
            type: String,
            required: true,
            unique:true,
        },
        visitHistory: [
            {
                timestamp: {
                    type: Number,
                },
            },
        ],
        createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    },
    
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("URL", urlSchema);
