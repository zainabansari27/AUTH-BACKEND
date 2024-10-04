const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieparser = require('cookie-parser');

const generateAccessAndRefreshToken = async(userID) =>{
  try{
      const user =  await userModel.findById(userID)
     const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken();
     
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})
     console.log("refresh" ,refreshToken);
     return { accessToken,refreshToken }

  }catch(error){
     throw error;
    //return error;
  }
}






const signup = async(req,res)=>{
  try{
    //console.log(req.body);
       const {name, email, password} = req.body;
       const user = await userModel.findOne({email});
       //console.log("user= ",user);
       if(user){
        return res.status(409).
                   json({msg:"User already exist, you can login ",
                    success:false
        });
       }
      const hashedpassword = await bcrypt.hash(password,10);
       const createdUser =  await userModel.create({
           username: name,
           email: email,
           password: hashedpassword,
       })
         const inforemovedUser = await userModel.findById(createdUser._id).select(
          "-paasword -refreshToken"
         )
          
      /* const jwtToken = jwt.sign(
        {email: createdUser.email, _id: createdUser._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn: '24h'}
    ) 
    res.cookie("token",jwtToken);
*/
    
       res.status(201)
       .json({
         message: "Signup successfully",
         success: true,
         //createdUser
         inforemovedUser
       })
       
      
  } 
  catch(error){
    res.status(500)
    .json({
      message: "internal server error ",
      success: false
    })
    console.log("error in creation ",error);
  }
}




const login = async(req,res)=>{
  try{
       const { email, password} = req.body;
       const user = await userModel.findOne({email});
       if(!user){
        return res.status(403).
                   json({msg:"authentication failed, Email or password is wrong ",
                   success:false
        });
       }
      const isPasswordEqual = await bcrypt.compare(password,user.password);
        if(!isPasswordEqual){ 
          return res.status(403)
          .json({message: "something went wrong" , success: false});
        }
            /*const jwtToken = jwt.sign(
            {email: user.email, _id: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: '24h'}
        ) 
      
          res.cookie('Token',jwtToken);
          */
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

        console.log(accessToken);

        const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken")

        const options = {
          httpOnly: true,
          secure: true
        }
        
       res.status(201)
          .cookie("accessToken", accessToken,options)
          .cookie("refreshToken",refreshToken,options)
          .json({
            message: "Login successfully",
            success: true,
             loggedInUser,
             accessToken,
             refreshToken, 
           // jwtToken,
           // email,
            //name: user.name
          });
        }   catch(error){
    res.status(500)
    .json({
      message: "internal server error ",
      success: false
    })
    console.log("error in login ",error);
  }
}

/*const logout = (req,res)=>{
  res.cookies("token","");
}
*/

const logoutUser = async(req,res)=>{
  const modified = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: { 
        refreshToken: null
       } 
    },
    {
      new:true
    }
  ) 
  console.log("modified " ,modified)
  
    const options = {
      httpOnly: true,
      secure: true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({msg:"Logged out successfully"})
}
 
module.exports = {
    signup,
    login,
    logoutUser
   // logout
}