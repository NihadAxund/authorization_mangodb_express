import { createConnection } from "../connection.js"
import { Payment } from "./payment.entity.js"

const mongoose = await createConnection()

const UserScheme = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    surname: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        unique: true,
        maxLength: [16, "Too long"],
        minLength: 3,
        trim: true,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        unique: true,
        minLength: 3,
        validate: {
            validator: function(e){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e)

            },
            message: props => `Can not validate ${props.value}`
        },
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Password is required"]
    },
    // hash: {
    //     type: String,
    //     minLength: 6,
    //     required: [true, "Hash is required"]
    // }
}, {
    timestamps: true,
    toJSON: {virtuals: true}
})

UserScheme.virtual('fullname').get(function(){
    let fullname = ''
    if(this.name){
        fullname += `${this.name} `
    }
    if(this.surname){
        fullname += this.surname
    }

    return fullname
})


UserScheme.pre("save", async function(next){
    let payment = await Payment.findOne({userID: this._id})
    if(payment){
        next()
    }else{
        await Payment.create({userID: this._id, plan: "Basic"})
        next()
    }
})






export const User = mongoose.model("User", UserScheme)
