import React, { useEffect, useState } from 'react';
import { Form, Container } from "./styles";
import { Link } from "react-router-dom";

import {api} from "../../services/api";
import { login, getToken } from "../../services/auth";
import Logo from "../../assets/logo.png";
import { logout } from "../../services/auth";




function Login(){

    const [Email, setEmail] = useState('');
    const [Password, setpassword] = useState('');
    const [error, seterror] = useState('');
    
    useEffect(() => {
      document.title = "Login"
      id();
    },[]);
    async function id(){
      await api.post("/userinf")
        .then(function (response) {
          document.location.href = "./home";
        })
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
          console.warn("Token expirado ou inválido. Fazendo logout...");
          logout();
        } else {
          console.error("Erro ao buscar informações do usuário:", error);
        }
      });
    }

    useEffect(() => {
      seterror('');
    }, [Email, Password]);


    async function handleSignIn(e){
      e.preventDefault();
        if (!Email || !Password) {
            seterror("Preencha usuário e senha para continuar!");
        } 
        else {
          try{
            const response = await api.post("/authenticate", { email: Email, senha: Password });
            login(response.data.token);
            console.log(response.data.token);
            document.location.href = "./home";
          }
          catch (err) {
              seterror("Houve um problema com o login, verifique suas credenciais. T.T");              
          }
        }
    }

    return (
        <Container >
            <Form onSubmit={handleSignIn}>

              <img src={Logo} alt="Malcolm Desmonte" />
              {error && <p>{error}</p>}
              <input
                type="name"
                placeholder="Usuário"
                onChange={e => setEmail(e.target.value.toLowerCase())}
              />
              <input
                type="password"
                placeholder="Senha"
                onChange={e => setpassword(e.target.value)}
              />
              <button type="submit" >Entrar</button>
              <hr />
              <Link onClick={()=>{}} to="#">Criar conta grátis</Link>
            </Form>
        </Container>
    );
}

export default Login;