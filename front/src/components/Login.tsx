import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

function Login() {
    const styles: object = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        gap: "20px",
        fontFamily: "Roboto",
        fontSize: "xx-large"
    }

    const [userPwd, setUserPwd] = useState("")

    useEffect(()=>{
        localStorage.clear()
    },[])

    function login(){
        fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: userPwd
            })
        }).then(data => data.json())
        .then(response => {
            if(response.err){
                alert("Złe hasło, lub jego brak")
            }else if(response.token){
                localStorage.setItem("token", response.token)
                window.location.href = "/home";
            }
        })
    }

    return (
      <div style={styles}>
        <h1>Witaj w chacie PDW</h1>
        <TextField label="Hasło" variant="filled" type='password' onChange={(e) => {setUserPwd(e.target.value)}}/>
        <Button variant="contained" onClick={() => {login()}}>Zaloguj Siebie</Button>
      </div>
    )
  }
  
  export default Login