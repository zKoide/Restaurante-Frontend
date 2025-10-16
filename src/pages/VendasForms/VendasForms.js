import React, { useEffect } from 'react';
import NavBar from '../../components/MenuItems/NavBar';

function VendasForm() {

  useEffect(() => {
    document.title = "Malcolm Desmonte"
  },[]);

  return(
      <>
        <NavBar/>
        <h1>Vendas Form</h1>
      </>
  )
}

export default VendasForm;