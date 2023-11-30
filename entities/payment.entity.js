import { createConnection } from "../connection.js"

const mongoose = await createConnection()


const PaymentScheme = mongoose.Schema({
    userID: {type: mongoose.Types.ObjectId, ref: "User"},
    plan: {
        type: String,
        enum: ["Basic", "Free", "Enterprise"],
        required: [true, "Plan is required"]
    }
})

export const Payment = mongoose.model("Payment", PaymentScheme)


// Blog
//  -- userID
//  -- title
//  -- text
//  -- timestamps

// Comment-
//  -- BlogId
//  --userID
//  -- text
//  -- timestamps