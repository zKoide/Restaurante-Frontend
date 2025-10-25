import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../../components/Menu/index copy';
import {Table, TD, TH} from './styles'
import {mask, unMask} from 'remask'
import './setor.css'
import {api} from '../../services/api';
import * as IoIcons from "react-icons/io5"
import * as FaIcons from "react-icons/fa"
import AddAndListMenu from '../../components/idk';
import { UBSContext } from '../../contexts/UBSContexts';

function Setores() {
  
  const [Setores, setSetores] = useState([]);
  
  const [setores, setsetores] = useState(false); 
  
  
  useEffect(() => {
    document.title = "Listar Setores"
    GetSetores()
    mostrarcabeçario()
  },[]);

  const {
    isSetorModalOpen,
    openSetorModal,
  } = useContext(UBSContext);

  useEffect(() => {
    clean();
    mostrarcabeçario();
  }, [Setores]);

  const opcoes = {
    voltar: '/Home', 
    lista: '#', 
    add: () => openSetorModal(),
  };

  useEffect(() => {
    if (!isSetorModalOpen) {
      // O modal acabou de fechar
      GetSetores();
    }
  }, [isSetorModalOpen]);
 

  async function GetSetores(){
    await api.get("/setor/")
    .then(function (response) {
      setSetores(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  function mostrarcabeçario(){
    Setores.map(setores => {
      if(setores != 0){
        setsetores(true);
      }
    })
  }
  function clean(){
    setsetores(false);
  }

  return(
    <div className='setores'>
      <NavBar/>
      <div className='pag'>
        <AddAndListMenu opcoes={opcoes}/>
        <h1>Listar Setores</h1>
        {setores ? (
              <div>
                <Table cellPadding="4" cellSpacing="0" id="tabela">
                  <thead>
                    <tr>
                      <th>Cod.</th>
                      <th>Nome Setor</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Setores.map(setor => (
                      <tr>
                        <td>{setor.id}</td>
                        <td>{setor.nome}</td>
                        
                        <td id="img">
                          <div
                            style={{ cursor: "pointer" }} // opcional, deixa parecer clicável
                            onClick={() => openSetorModal(setor.id)} // chama o modal
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

export default Setores;