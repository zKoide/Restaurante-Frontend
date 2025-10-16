import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../../components/Menu/index copy';
import {Table, TD, TH} from './styles'
import {mask, unMask} from 'remask'
import './cardapio.css'
import api from '../../services/api';
import * as IoIcons from "react-icons/io5"
import * as FaIcons from "react-icons/fa"
import AddAndListMenu from '../../components/idk';
import { UBSContext } from '../../contexts/UBSContexts';

function Cardapio() {
  
  const [ccardapio, setccardapio] = useState(false); 
  const [Cardapio, setCardapio] = useState([]);
  
  
  
  useEffect(() => {
    document.title = "Listar Cardapio"
    GetCardapio()
    mostrarcabeçario()
  },[]);

  const {
    isCardapioModalOpen,
    openCardapioModal,
  } = useContext(UBSContext);

  useEffect(() => {
    clean();
    mostrarcabeçario();
  }, [Cardapio]);

  const opcoes = {
    voltar: '/Home', 
    lista: '#', 
    add: () => openCardapioModal(),
  };

  useEffect(() => {
    if (!isCardapioModalOpen) {
      // O modal acabou de fechar
      GetCardapio();
    }
  }, [isCardapioModalOpen]);
 

  async function GetCardapio(){
    await api.get("/cardapio")
    .then(function (response) {
      console.log(response.data);
      setCardapio(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  function mostrarcabeçario(){
    Cardapio.map(cardapio => {
      if(cardapio != 0){
        setccardapio(true);
      }
    })
  }
  function clean(){
    setccardapio(false);
  }

  return(
    <div className='cardapio'>
      <NavBar/>
      <div className='pag'>
        <AddAndListMenu opcoes={opcoes}/>
        <h1>Listar Cardapio</h1>
        {ccardapio ? (
              <div>
                <Table cellPadding="4" cellSpacing="0" id="tabela">
                  <thead>
                    <tr>
                      <th>Cod.</th>
                      <th>Produto</th>
                      <th>Setor</th>
                      <th>Preço</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Cardapio.map(cardapio => (
                      <tr key={cardapio.id}>
                        <td>{cardapio.id}</td>
                        <td>{cardapio.nome}</td>
                        <td>{cardapio.setor.nome}</td>
                        <td>{cardapio.preco}</td>
                        
                        <td id="img">
                          <div
                            style={{ cursor: "pointer" }} // opcional, deixa parecer clicável
                            onClick={() => openCardapioModal(cardapio.id)} // chama o modal
                          > 
                            <FaIcons.FaRegEdit/>
                          </div>
                        </td>
                      </tr>
                      
                    ))}               
                  </tbody>
                </Table>
              </div>
            ) : (
              <div>
                <h2>Nenhum setor cadastrado</h2>
              </div>
            )}
        
      </div>
      
    </div>
  )
}

export default Cardapio;