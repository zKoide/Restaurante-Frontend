import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../../components/Menu/index copy';
import {Table, TD, TH} from './styles'
import {mask, unMask} from 'remask'
import './Agendamentos.css'
import api from '../../services/api';
import * as IoIcons from "react-icons/io5"
import * as AiIcons from "react-icons/ai"
import * as MdIcons from "react-icons/md"
import AddAndListMenu from '../../components/idk';
import { UBSContext } from '../../contexts/UBSContexts';
import { logout } from "../../services/auth";

function Agendamentos() {
  
  
  const [Agendamentos, setAgendamentos] = useState([]);
  const [Id, setId] = useState('');
  
  const [agendamentos, setagendamentos] = useState(false); 
  
  
  useEffect(() => {
    document.title = "Listar Agendamentos - Malcolm Desmonte"
    GetAgendamentos()
  },[]);

  const opcoes = {
    voltar: '/Home', 
    lista: '#', 
    add: '#',
  };


  const {
    openWorkDayModal,
  } = useContext(UBSContext);

  async function id(){
    await api.get("/test")
    .then(function (response) {
      setId(response.data.user);
    })
    .catch(function (error) {
      logout();
      document.location.href = "./";
    });
  }

  async function GetAgendamentos(){
    await api.post("/userinf")
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });

    await api.get("/Agendamentos")
    .then(function (response) {
      console.log(response.data)
      setAgendamentos(response.data);
      setagendamentos("true")
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return(
    <div className='agendamentos'>
      <NavBar/>
      <div className='pag'>
        <AddAndListMenu opcoes={opcoes}/>
        <h1>Listar Agendamentos</h1>
        {agendamentos ? (
              <div>
                <button onClick={openWorkDayModal}>Me Clica</button>
                <Table cellPadding="4" cellSpacing="0" id="tabela">
                  <thead>
                    <tr>
                      <th>Cod.</th>
                      <th>Placa do Veiculo</th>
                      <th>Modelo do Veiculo</th>
                      <th>Empresa Solicitante</th>
                      <th>Data Solicitação</th>
                      <th>Quem vai Pagar</th>
                      <th>Status</th>
                      <th>Local Serviço</th>
                      <th>Horario</th>
                      {/*<th>Empresa</th>*/}
                      <th scope="col"></th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Agendamentos.map(agendamento => (
                      <tr>
                        <td>{agendamento.agendamentoId}</td>
                        <td>{mask(agendamento.Vehicle.Placa.toString().toUpperCase(), [ isNaN(agendamento.Vehicle.Placa.charAt(4)) ? 'AAA-9A99' : 'AAA-9999'])}</td>
                        <td>{agendamento.Vehicle.Modelo}</td>
                        <td>{agendamento.Requested.Corporation.Name}</td>
                        <td>{new Date(agendamento.Requested.at).toLocaleDateString()+" as "+ new Date(agendamento.Requested.at).toLocaleTimeString()}</td>
                        <td>{agendamento.Payment.by.Name}</td>
                        <td>{agendamento.Status == 0 ? 'Serviço Agendado' : "Serviço Concluido"}</td>
                        {/*cliente.Corporation ? <td>{cliente.Corporation ? cliente.Corporation.Name : null}</td> : null*/}
                        <td></td>
                        <td></td>
                        <td id="img">
                          <a href={'/Cliente/'+agendamento.agendamentoId}>
                            <IoIcons.IoOpenOutline />
                          </a>
                        </td>
                        <td id="img" title="Serviço Concluido">
                            <AiIcons.AiOutlineCheckCircle />
                        </td>
                        <td id="img" title="Pagamento Concluido">
                            <MdIcons.MdAttachMoney />
                        </td>
                      </tr>
                      
                    ))}               
                  </tbody>
                </Table>
              </div>
            ) : (
              <div>
                <h2>Nenhum cliente cadastrado</h2>
              </div>
            )}
        
      </div>
      
    </div>
  )
}

export default Agendamentos;