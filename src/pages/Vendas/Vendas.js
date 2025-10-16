import React, { useEffect } from 'react';
import NavBar from '../../components/MenuItems/NavBar';
import {Table, TD, TH} from './styles'

function Vendas() {

  useEffect(() => {
    document.title = "Malcolm Desmonte"
  },[]);

  return(
      <>
        <NavBar/>
        <h1>Listar Vendas</h1>
        <div>
          <Table cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                <TH>Cliente</TH>
                <TH>Nota Fiscal</TH>
                <TH>Data Venda</TH>
                <TH>Valor Total</TH>
                <TH scope="col"></TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD>Alexandre Augusto Nunes de Oliveira</TD>
                <TD>1179</TD>
                <TD>08/03/2021</TD>
                <TD>R$128,00</TD>
                <TD></TD>
              </tr>
              <tr>
                <TD>Ana Marcia Nunes</TD>
                <TD>1180</TD>
                <TD>08/03/2021</TD>
                <TD>R$1280,00</TD>
                <TD></TD>
              </tr>
              <tr align="center">
                <TD colSpan="5">
                  <table>
                    <tbody >
                      <tr>
                        <TD>1</TD>
                        <TD>2</TD>
                        <TD>3</TD>
                        <TD>4</TD>
                        <TD>5</TD>
                      </tr>
                    </tbody>
                  </table>
                </TD>
              </tr>
            </tbody>
          </Table>
        </div>
    
      </>
  )
}

export default Vendas;