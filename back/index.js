import { Configuration, OpenAIApi } from "openai";
import express from "express"
import dotenv from 'dotenv'
import jwt from "jsonwebtoken"
import cors from "cors"

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());

const openai = new OpenAIApi(new Configuration({apiKey: process.env.OPENAI_KEY,}))

function middleVerify(req, res, next) {
    const token = req.header('Authorization');
    if (!token) { return res.status(403).json({err: "invalid token"}) }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({err: "bad token"})
        }
        req.user = user;
        next();
    });
}

let messages = []
let temperature = 0.7

app.post("/getAnsw", middleVerify, async (req, res) => {
    messages.push({role: "user", content: req.body.userMsg})

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: temperature,
    })

    messages.push(completion.data.choices[0].message)
    res.json({answer: messages})
})

app.post("/changeTemperature", middleVerify, (req, res) => {
    temperature = req.body.temperature
    if(temperature > 0 && temperature <= 2){
        res.json("Zmieniono temperaturę na " + temperature)
    }else{
        temperature = 0.7
        res.json({err: "Wartość musi być w przedziale 0.1-2"})
    }
    
})

app.get("/getTemp", middleVerify, (req, res) => {
    res.json({temp: temperature})
})

app.post("/clearMessages", middleVerify, (req, res) => {  // usuwanie wiadomości
    messages = []
    res.json({res: "usunieto"})
})

app.post("/", (req, res) => {  // login
    const password = req.body.password
    if(password == process.env.USER_PASSWORD){
        const token = jwt.sign({ username: "największySrakuniarz" }, process.env.JWT_SECRET, { expiresIn: "4h" })
        res.json({token: token})
    }else{
        res.json({err: "Złe, lub brak hasła"})
    }
})

app.get("/getMsg", middleVerify, (req, res) => {  // pobieranie wiadomości
    res.json(messages)
})

app.listen(3000, () => {console.log("http://localhost:3000/")})