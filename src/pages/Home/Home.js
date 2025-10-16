import React, { useEffect } from 'react';
import Lg from "../../assets/logo.png";


import { Container, Logo } from "./styles";

import NavBar from '../../components/Menu/index copy';

function Home() {
  
  
  useEffect(() => {
    escolha()
    document.title = "Home - Vistoria Vision Car"
  },[]);

  function escolha(data){
    
  }


  return(
    <>
      <NavBar />
      <Container>
        <Logo style={{maxHeight:"500px"}} src={Lg} alt="Logo VisionCar" />
      </Container>
    </>
  )
}

export default Home;