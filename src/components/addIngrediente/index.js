import React, { useContext, useState, useEffect } from "react";
import {api} from '../../services/api'

import { Container, Overlay } from "./styles";

import './AddIngredienteStyles.css';
import { UBSContext } from "../../contexts/UBSContexts";

function Ingrediente(data){
    
    const [NomeIngrediente, setNomeIngrediente] = useState("");
    const [UnidadeMedida, setUnidadeMedida] = useState("");
    const [IsActive, setIsActive] = useState(false);
    
    const [error, setError] = useState();
    const [allError, setAllError] = useState(false);

    useEffect(() => {
        findIngrediente()
      },[]);

    useEffect(() => {
        if(!NomeIngrediente || NomeIngrediente.length != 3){
            setError("O campo Nome do ingrediente é obrigatorio e deve ser preenchido")
        }
        else if(UnidadeMedida.length < 2){
            setError("O campo Unidade de medida é obrigatorio e deve ser preenchido")
        }
    }, [NomeIngrediente, UnidadeMedida, allError])


    const {
        closeIngredienteModal,
    } = useContext(UBSContext);

    function close() {
        closeIngredienteModal();
    }

    const checkPagamentoByLojista = () => {
        setIsActive(!IsActive)
    }

    async function findIngrediente() {
        console.log(data.id)
        if(data.id != null){
           console.log(data.id)
           const ingrediente = await api.get("/ingrediente/"+data.id)
           setNomeIngrediente(ingrediente.data.nome)
           setUnidadeMedida(ingrediente.data.unidade)
           setIsActive(ingrediente.data.ativo)
        }
    }
    async function addAgendamento(e){
        if(data.id){
           e.preventDefault();
            
            if (!NomeIngrediente || !UnidadeMedida ) {                      
                setAllError(true)
            }
            else {
                try{
                    await api.put("/ingrediente/"+data.id, {
                        nome: NomeIngrediente,
                        unidade: UnidadeMedida,
                        ativo: IsActive
                    })
                    .then(function (response) {
                        closeIngredienteModal()
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                }   
                catch (err) {
                    setAllError(true)
                    setError("Não foi possivel fazer update este Ingrediente. Tente novamente mais tarde");
                }
            }
        }
        else{
        console.log("ta no botao")
            e.preventDefault();
            
            if (!NomeIngrediente || !UnidadeMedida ) {                      
                setAllError(true)
            }
            else {
                try{
                    console.log("aprovado")
                    await api.post("/ingrediente", {
                        nome: NomeIngrediente,
                        unidade: UnidadeMedida
                    })
                    .then(function (response) {
                        closeIngredienteModal()
                        console.log(response)
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                }   
                catch (err) {
                    setAllError(true)
                    setError("Não foi possivel cadastrar este Plantão. Tente novamente mais tarde");
                }
            }
        }
    }


    return (
        <Overlay >
            <Container>
                <div className="_n3">
                    <div className="_8ien wid">
                        <img className="_8idr img" src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"  onClick={close} width="24" height="24" alt="fechar"/>
                        <div className="_52lp header wid">
                            <div className="title">Adicionar Ingrediente</div>
                            <div className="_52lr fsm fwn fcg">É rápido e fácil.</div>
                        </div>
                        <div>
                            <noscript>
                                <div id="no_js_box">
                                    <h2>O JavaScript está desativado em seu navegador.</h2>
                                    <p>Ative o Javascript no seu navegador ou atualize para um navegador compatível com Javascript para se cadastrar no Facebook.</p>
                                </div>
                            </noscript>
                            <div className="_58mf">
                                <div id="reg_box" className="registration_redesign">
                                    <div className="_8fgli _9l2p wid">
                                        <form onSubmit={addAgendamento} >
                                            <div className="large_form">
                                                <div className="sectioni">
                                                    <div style={{display:"-ms-flexbox"}}>
                                                        <div className="FuxyEf">Nome do Ingrediente:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <input className="inputtext _58mg _8esa" placeholder="Nome do Ingrediente"
                                                            defaultValue={NomeIngrediente}
                                                            value={ NomeIngrediente ? NomeIngrediente : null}
                                                            onChange={e => setNomeIngrediente(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="FuxyEf">Unidade de Medida:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <input className="inputtext _58mg _8esa" placeholder="Unidade de Medida"
                                                            defaultValue={UnidadeMedida}
                                                            onChange={e => setUnidadeMedida(e.target.value)}
                                                            />
                                                        </div>
                                                        
                                                        {
                                                        data.id ? (
                                                            <div className="hed">
                                                                <div className="FuxyEF">Ingrediente ativo: </div>
                                                                <input className="itemComp" type="checkbox" id="pagamento" display="false"/>
                                                                <label className="PNJbib" for="pagamento">
                                                                    <div className="alinhamentoseletor" onClick={checkPagamentoByLojista} aria-checked={IsActive}>
                                                                        <div className="barra corBarra"></div>
                                                                        <div>
                                                                            <div className="circulo espmsb" jsname="IT5dJd"></div>
                                                                        </div>
                                                                    </div>
                                                                </label>  
                                                            </div>
                                                        ) : (<></>)
                                                        }
                                                        
                                                        </div>
                                                </div>
                                                
                                                {
                                                    //botão para cadastrar
                                                }
                                                <div className="_1lch">
                                                    {allError ? <p>{error}</p> : null}
                                                    <button type="submit" disabled={allError ? true : false} className="_6j mvm _58mi _6o _6wl _6v" name="websubmit" id="u_6_s_PY">
                                                    {data.id ? "Editar" : "Cadastrar"}
                                                    </button>
                                                    <span className="hidden_elem _58ml" id="u_6_t_rN">
                                                        <img className="img" src="https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/GsNJNwuI-UM.gif" alt="" width="16" height="11"/>
                                                    </span>
                                                    
                                                </div>
                                            
                                            </div>
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Overlay>
    )
}

export default Ingrediente; 