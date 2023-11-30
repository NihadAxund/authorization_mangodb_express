import { createConnection } from "../connection.js"

const mongoose = await createConnection()


const RatingScheme = mongoose.Schema({
    commentID: {type: mongoose.Types.ObjectId, ref: "Comment"},
    userID: {type: mongoose.Types.ObjectId, ref: "User"},
    rate: {
        type: Number,
        min: 0,
        max: 10
    }
})

export const Rating = mongoose.model("Rating", RatingScheme)