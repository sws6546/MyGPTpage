import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import "./Home.css"
import Slider from '@mui/material/Slider';

interface Msg{
    role: string;
    content: string;
}

function Home(){
    const [messages, setMessages] = useState<Msg[]>([])
    const [content, setContent] = useState("")
    const [defTemp, setDefTemp] = useState(0)
    const [temp, setTemp] = useState(0.7)

    useEffect(() => {
        const token: string | null = localStorage.getItem('token')
        if(token === null){
            localStorage.clear()
            location.href = "/"
        }else{
            fetch("http://localhost:3000/getMsg", {
                method: "GET",
                headers: {
                    'Authorization': token
                }
            }).then(res => res.json())
            .then(data => {
                setMessages(data);
            })
        }

        fetch("http://localhost:3000/getTemp", {
            headers: {
                Authorization: token!
            }
        })
        .then(res => res.json()).then(res => {
            setDefTemp(res.temp)
            setTemp(res.temp)
            console.log(res.temp)
        })
    }, [])

    function sendMsg(){
        fetch("http://localhost:3000/getAnsw", {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem('token')!,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userMsg: content
            })
        }).then(data => data.json())
        .then(res => {
            if(!res.err){
                setMessages(res.answer)
            }
            else{
                alert("brzytki token")
                localStorage.clear()
                location.href = "/"
            }
        })
    }

    function clearMsg(){
        fetch("http://localhost:3000/clearMessages", {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem('token')!
            }
        })
    }

    function changeTemp(temp: number){
        fetch("http://localhost:3000/changeTemperature", {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem('token')!,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "temperature": temp
            })
        })

        setTemp(temp)
    }

    return (
        <div id="container">
            <h1 style={{position: "fixed", top: 0, left: 0, color: 'white'}}>
                {temp}
            </h1>
            <div id="chat">
                {messages.map((msg) => (
                    <div className="message">
                        <h3>{msg.role}</h3>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div id="form">
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", width: "60vw"}}>
                    <Button variant="contained" onClick={() => {clearMsg()}} >Clear 🗑🗑🗑</Button>
                    <TextField variant='filled' label="Napisz Wiadomość" onChange={(e) => {setContent(e.target.value)}}/>
                    <Button variant="contained" onClick={() => {sendMsg()}} >Wyślij</Button>
                </div>
                <Slider onChangeCommitted={(e, v) => { changeTemp(Number(v)) }} min={0.1} max={2} defaultValue={defTemp} key={defTemp} step={0.1}/>
            </div>
        </div>
    )
}

export default Home;