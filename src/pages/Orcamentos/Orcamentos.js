import React, { useEffect } from 'react';
import NavBar from '../../components/MenuItems/NavBar';

function Orcamentos() {
  useEffect(() => {
    document.title = "Malcolm Desmonte"
  },[]);

  return(
      <>
        <NavBar/>
        <h1>Listar Orçamentos</h1>
      </>
  )
}

export default Orcamentos;