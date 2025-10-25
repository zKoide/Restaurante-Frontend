import React, { useContext, useState, useEffect } from "react";
import {api} from '../../services/api'

import { Container, Overlay } from "./styles";

import './AddSetorStyles.css';
import { UBSContext } from "../../contexts/UBSContexts";

function Setor(data){
    
    const [NomeSetor, setNomeSetor] = useState("");
    
    const [error, setError] = useState();
    const [allError, setAllError] = useState(false);

    useEffect(() => {
        findSetor()
      },[]);

    useEffect(() => {
        if(!NomeSetor || NomeSetor.length != 3){
            setError("O campo Nome do setor é obrigatorio e deve ser preenchido")
        }
    }, [NomeSetor, allError])


    const {
        closeSetorModal,
    } = useContext(UBSContext);

    function close() {
        closeSetorModal();
    }

    async function findSetor() {
        if(data.id != null){
            const setor = await api.get("/setor/"+data.id)
            setNomeSetor(setor.data.nome)
        }
    }
    async function buttonAction(e){
        if(data.id){
           e.preventDefault();
            EditSetor()
        }
        else{
            e.preventDefault();
            AddSetor()
        }
    }

    async function AddSetor(){
        if (!NomeSetor ) {                      
                setAllError(true)
            }
            else {
                try{
                    console.log("aprovado")
                    await api.post("/setor", {
                        nome: NomeSetor,
                    })
                    .then(function (response) {
                        closeSetorModal()
                        console.log(response)
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                }   
                catch (err) {
                    setAllError(true)
                    setError("Não foi possivel cadastrar este Setor. Tente novamente mais tarde");
                }
            }
    }
    async function EditSetor(){
        if (!NomeSetor ) {                      
            setAllError(true)
        }
        else {
            try{
                await api.put("/setor/"+data.id, {
                    nome: NomeSetor
                })
                .then(function (response) {
                    closeSetorModal()
                })
                .catch(function (error) {
                console.log(error);
                });
            }   
            catch (err) {
                setAllError(true)
                setError("Não foi possivel fazer update neste Setor. Tente novamente mais tarde");
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
                            <div className="title">Adicionar Setor</div>
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
                                        <form onSubmit={buttonAction} >
                                            <div className="large_form">
                                                <div className="sectioni">
                                                    <div style={{display:"-ms-flexbox"}}>
                                                        <div className="FuxyEf">Nome do Setor:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <input className="inputtext _58mg _8esa" placeholder="Nome do Setor"
                                                            defaultValue={NomeSetor}
                                                            value={ NomeSetor ? NomeSetor : null}
                                                            onChange={e => setNomeSetor(e.target.value)}
                                                            />
                                                        </div>
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

export default Setor; 