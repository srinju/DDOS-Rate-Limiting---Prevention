

//so this frontend is for the captcha that prevents ddos attacks .. or more over it prevents bots to enter 
//a critical section in ur application , suppose a movie ticket website or a nft mining website ..etc ..etc
//for typical ddos prevention we can like proxy our ip of the website .. what it does is it whenever a request comes it comes to the proxy first
//and the proxy server that is run by the cloudflare workers they identify , that if it is from a reported ip or not or something like a bot request
//so that helps to prevent DDOS attacks
//what happens is whenever the user solves the captcha and if they pass it then the cloudflare token gets attached with every request of the user so that there is confirmation that , yes it is a legitimate user
//we can use it not for all requests also ,  and we can also use it for features which are critical that is send the token along with 
//the request where the feature is quite demanding and important and cant allow any bot user
//fot the token thing either we can see the cloudflare documentation or the react turnstile library
//so you have to generate a siteKey from the cloudflare website of turnstle and put it in the siteKey
//so the user sents a reauest to the backend with the token and on the server side we check if the token is legit with the secret key
//that cloudflare provides 

import { Turnstile } from "@marsidev/react-turnstile";
import axios from "axios"
import { useState } from "react"

function App() {
  const[newPassword , setNewPassword] = useState("");
  const [token,setToken] = useState("");
  return (
    <div>
      <input onChange={(e) => {
        setNewPassword(e.target.value);
      }} placeholder="OTP"></input>

      <input placeholder="Enter the new password"></input>

      <Turnstile onSuccess={(token) => { setToken(token)}} siteKey="0x4AAAAAAA4lZM8GBJr20BuE" />

      <button
          onClick={() => {
            axios.post('http://localhost:3000/reset-password' , {
              email : "dassrinjoy333@gmail.com", //get the session email from the user
              otp : "123123", //get the otp of the current user
              newPassword : newPassword, //enrter the new password of the user
              token : token //pass the onsucess solving of captcha token
            });
          }}
        >UpdatePassword
      </button>

    </div>
  )
}

export default App
