import React, { useEffect } from 'react';
import NavBar from '../../components/MenuItems/NavBar';

function OrcamentosForms() {
  
  useEffect(() => {
    document.title = "Malcolm Desmonte"
  },[]);

  return(
      <>
        <NavBar/>
        <h1>Orçamentos Forms</h1>
      </>
  )
}

export default OrcamentosForms;