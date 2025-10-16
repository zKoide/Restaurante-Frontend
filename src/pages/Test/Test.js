import React, { useEffect } from 'react';
import NavBar from '../../components/Menu/index copy';

function Tests() {
  
  useEffect(() => {
    document.title = "Teste Menu"
  },[]);

  return(
      <>
        <NavBar/>
      </>
  )
}

export default Tests;