import User from "../Models/User.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

export const addUser=async(req,res)=>{
    let user=req.body;
    user.role= req.body.role || "user"
    user.password=Math.random().toString(36).slice(-8)

    try {
        let findUser= await User.findOne({
            email:user.email
        })
        if(findUser){
            const token= jwt.sign({
                role:findUser.role, userId:findUser.id
            },process.env.SECRET_TOKEN,
            {expiresIn:"24h"}
            )

            const { name, email ,number,address, role, password, } = findUser;
            let newUser = { firstName, lastName, email, role, image };
            return res.status(200).json({ newUser, token });
        }else{
            try {
                try {
                    const hashedPass = await bcrypt.hash(user.password, 10);
                    const newOne = await userModel.create({
                      ...user,
                      password: hashedPass,
                      role: user.role,
                    });
                    const token = jwt.sign(
                      { role: newOne.role, userId: newOne.id },
                      process.env.TOKEN,
                      { expiresIn: "24h" }
                    );
                    const { lastName, firstName, role, image, email } = newOne;
                    let newUser = { firstName, lastName, email, role, image };
                    return res.status(200).json({ newUser, token });
                  } catch (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Error creating user" });
                  }
            } catch (error) {
                console.log(error);
                return res.status(400).json(error);
            }
        }
    } catch (error) {
        
    }
}
