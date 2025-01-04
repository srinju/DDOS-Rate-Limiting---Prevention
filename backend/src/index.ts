import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

//this is the backend we will be exploiting ..
//and all the routes should be protected with ddos and rate limiting 
//more specifically routes which are related to otp verification , reset password like that
//for example > routes like otp verification can be easily hijacked by running a list of 6 digit numbers and in a for loop we can just hit the backend route and one of the 6 digits will be matching it ... and we can easily hijack someone else's session
//that's why for this routes we should rate limit it , as this kind of hijacking attempts take many requests in a second

//to protect the end points we can use a external library called express-rate-limit

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

//pass these middleware of rate limiters and pass it into the routes as middlewares

const otpRateLimiter = rateLimit({ 
    windowMs : 5*60*100, //5 minutes
    max : 3, //max each IP to 3 OTP requests per windowMS
    message : "too many requests , please try again after 5 minutes",
    standardHeaders : true, //return rate limit info in the ratelimit headers
    legacyHeaders : false, //disable the x-ratelimit headers
});

const passwordRateLimiter = rateLimit({
    windowMs : 15*60*100, //15 minutes
    max : 5, //max each IP to 3 OTP requests per windowMS
    message : "too many password reset attempts , please try again after 15 minutes",
    standardHeaders : true, //return rate limit info in the ratelimit headers
    legacyHeaders : false, //disable the x-ratelimit headers
});

//store OTPS in a simple memry object > 
const otpStore : Record<string, string> = {};

//endpoint to generate and log the OTP>
//@ts-ignore
app.post('/generate-otp', otpRateLimiter, (req,res) => {
    const email = req.body.email;
    if(!email){
        return res.status(400).json({
            message : "email is required"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); //generate a 6 digit otp
    otpStore[email] = otp; //store the otp in the otp record (ideally it should be stored in a database)
    //an on real world scenario , you send an email using node-mailer to thaat email id for their otp so that they can enter it
    console.log(`OTP for ${email}  : ${otp}`); //log the otp in the console
    res.status(200).json({
        msessage : "OTP generated and logged successfully!!"
    });
});

//end point to reset the password >
app.post('/reset-password' , passwordRateLimiter , async (req,res) => {
    const {email,otp,newPassword,token} = req.body; //we will also ask the cloudflare token from the user , for checking that whetther the token is actually legit or not
    console.log("cloudflare token is : " , token);

    //now verrifiy with cloudflare whether this token is legit or not with the cloudflare secret key
    let formData = new FormData();
    formData.append('secret' ,"0x4AAAAAAA4lZKZTDhpnx7fyZPQRydk41mc" ); //secret key from cloudflare
    formData.append('response' ,token ); //token with which the user is sending request

    //now send the request to the cloudflare api to verify the token is legit or not >
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url , {
        body : formData,
        method : 'POST'
    });
    console.log("the result from the cloudflare api after sending request to the cloudflare api is : ", await result.json());

    if(!email || !otp || !newPassword){
        res.status(400).json({
            message : "otp , email and new password is requried here!"
        });
    }
    if(otpStore[email] == otp){ //if the entered otp is same as the otp for the email stored 
        console.log(`Password for ${email} has been reset to ${newPassword}`);
        delete otpStore[email]; //clear the otp set in the db for that email
        res.status(200).json({
            message : "Password has been reset successfully!"
        });
    } else {
        res.status(401).json({
            message : "Invalid OTP"
        });
    }
});

app.listen(PORT);
