import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../../components/Menu/index copy';
import {Table, TD, TH} from './styles'
import {mask, unMask} from 'remask'
import './Ingredientes.css'
import api from '../../services/api';
import * as IoIcons from "react-icons/io5"
import * as FaIcons from "react-icons/fa"
import AddAndListMenu from '../../components/idk';
import { UBSContext } from '../../contexts/UBSContexts';

function Ingredientes() {
  
  const [Ingredientes, setIngredientes] = useState([]);
  
  const [ingredientes, setingredientes] = useState(false); 
  
  
  useEffect(() => {
    document.title = "Listar Ingredientes"
    GetIngredientes()
    mostrarcabeçario()
  },[]);

  const {
    isIngredienteModalOpen,
    openIngredienteModal,
  } = useContext(UBSContext);

  useEffect(() => {
    clean();
    mostrarcabeçario();
  }, [Ingredientes]);

  const opcoes = {
    voltar: '/Home', 
    lista: '#', 
    add: () => openIngredienteModal(),
  };

  useEffect(() => {
    if (!isIngredienteModalOpen) {
      // O modal acabou de fechar
      console.log("esta desativado")
      GetIngredientes();
    }
  }, [isIngredienteModalOpen]);
 

  async function GetIngredientes(){
    await api.get("/ingrediente")
    .then(function (response) {
      setIngredientes(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  function mostrarcabeçario(){
    Ingredientes.map(ingrediente => {
      if(ingrediente != 0){
        setingredientes(true);
      }
    })
  }
  function clean(){
    setingredientes(false);
  }

  return(
    <div className='ingredientes'>
      <NavBar/>
      <div className='pag'>
        <AddAndListMenu opcoes={opcoes}/>
        <h1>Listar Ingredientes</h1>
        {ingredientes ? (
              <div>
                <Table cellPadding="4" cellSpacing="0" id="tabela">
                  <thead>
                    <tr>
                      <th>Cod.</th>
                      <th>Ingrediente</th>
                      <th>Unidade de Medida</th>
                      <th>Status</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Ingredientes.map(ingrediente => (
                      <tr>
                        <td>{ingrediente.id}</td>
                        <td>{ingrediente.nome}</td>
                        <td>{ingrediente.unidade}</td>
                        <td>{ingrediente.ativo == true ? "Ativado" : "Desativado"}</td>
                        
                        <td id="img">
                          <div
                            style={{ cursor: "pointer" }} // opcional, deixa parecer clicável
                            onClick={() => openIngredienteModal(ingrediente.id)} // chama o modal
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
                <h2>Nenhum ingrediente cadastrado</h2>
              </div>
            )}
        
      </div>
      
    </div>
  )
}

export default Ingredientes;