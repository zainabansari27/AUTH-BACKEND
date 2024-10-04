const mongoose = require("mongoose");

const connectDB = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/authentication')
        console.log("\n MONGODB CONNECTED!!!! ");
    } catch(error) {
      console.log("MONGODB Connection error ",error);
    }
}

module.exports = {
    connectDB,
}