import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}},
    likedFoods:{type:Object,default:{}},
    likedRestaurants:{type:Object,default:{}},
    phone:{type:String,default:""},
    bio:{type:String,default:"Food enthusiast who loves exploring new restaurants and cuisines."},
    addresses:{type:Array,default:[]},
    profileImage:{type:String,default:""},
    isAdmin: { type: Boolean, default: false } 
},{minimize:false})

const UserModel = mongoose.models.user || mongoose.model("user",userSchema);
export default UserModel;