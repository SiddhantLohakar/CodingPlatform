const mongoose = require('mongoose');
const {Schema} = mongoose;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true
    },
    inputCode: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "accepted", "wrong", "error"],
        required: true
    },
    runtime:{
        type: Number,
        required: true,
        default :  0
    },
    memory:{
        type: Number,
        required: true,
        default: 0
    },
    language:{
        type: String,
        required: true
    },
    error: {
        type: String,
        required: true
    },
    passedCases: {
        type: Number,
        required: true,
        default: 0
    }
})

const Submission = mongoose.model("submission", submissionSchema)
module.exports = Submission