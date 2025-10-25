import React, { useContext, useState, useEffect } from "react";
import api from '../../services/api'

import { Container, Overlay } from "./styles";

import './AddCardapioStyles.css';
import { UBSContext } from "../../contexts/UBSContexts";
import SelecionarIngredientesComQuantidade from "./SelecionarIngredientesComQuantidade";

function Cardapio(data){
    
    const [NomeCardapio, setNomeCardapio] = useState("");
    const [DescricaoCardapio, setDescricaoCardapio] = useState("");
    const [PrecoCardapio, setPrecoCardapio] = useState("");
    const [setorSelecionado, setSetorSelecionado] = useState("");
    const [setoresDisponiveis, setsetoresDisponiveis] = useState([]);
    const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
    const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
    
    const [error, setError] = useState();
    const [allError, setAllError] = useState(false);

    useEffect(() => {
        findCardapio()
      },[]);

    useEffect(() => {
        if(!NomeCardapio || NomeCardapio.length != 3){
            setError("O campo Nome do Cardapio é obrigatorio e deve ser preenchido")
        }
    }, [NomeCardapio, allError])


    const {
        closeCardapioModal,
    } = useContext(UBSContext);

    function close() {
        closeCardapioModal();
    }

    async function findCardapio() {
        const setores = await api.get("/setor");
        const ingredientes = await api.get("/ingrediente");
        if(data.id != null){
            const cardapio = await api.get("/cardapio/"+data.id)
            
            setNomeCardapio(cardapio.data.nome)
            setDescricaoCardapio(cardapio.data.descricao)
            setPrecoCardapio(cardapio.data.preco)
            setSetorSelecionado(cardapio.data.setor.id)
        }
        setsetoresDisponiveis(setores.data)
        setIngredientesDisponiveis(ingredientes.data)
    }
    async function buttonAction(e){
        if(data.id){
           e.preventDefault();
            EditCardapio()
        }
        else{
            e.preventDefault();
            AddCardapio()
        }
    }

    async function AddCardapio(){
        if (!NomeCardapio ) {                      
                setAllError(true)
            }
            else {
                try{
                    console.log("aprovado")
                    await api.post("/cardapio", {
                        nome: NomeCardapio,
                    })
                    .then(function (response) {
                        closeCardapioModal()
                        console.log(response)
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                }   
                catch (err) {
                    setAllError(true)
                    setError("Não foi possivel cadastrar este Cardapio. Tente novamente mais tarde");
                }
            }
    }
    async function EditCardapio(){
        if (!NomeCardapio ) {                      
            setAllError(true)
        }
        else {
            try{
                await api.put("/cardapio/"+data.id, {
                    nome: NomeCardapio
                })
                .then(function (response) {
                    closeCardapioModal()
                })
                .catch(function (error) {
                console.log(error);
                });
            }   
            catch (err) {
                setAllError(true)
                setError("Não foi possivel fazer update neste Cardapio. Tente novamente mais tarde");
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
                            <div className="title">Adicionar item no Cardapio</div>
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
                                                        <div className="FuxyEf">Nome do item:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <input className="inputtext _58mg _8esa" placeholder="Nome do Cardapio"
                                                            defaultValue={NomeCardapio}
                                                            value={ NomeCardapio ? NomeCardapio : null}
                                                            onChange={e => setNomeCardapio(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{display:"-ms-flexbox"}}>
                                                        <div className="FuxyEf">Descrição do item:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <input className="inputtext _58mg _8esa" placeholder="Descrição do Cardapio"
                                                            defaultValue={DescricaoCardapio}
                                                            value={ DescricaoCardapio ? DescricaoCardapio : null}
                                                            onChange={e => setDescricaoCardapio(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{display:"-ms-flexbox"}}>
                                                        <div className="FuxyEf">Preço do item:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <input className="inputtext _58mg _8esa" placeholder="Preço do Cardapio"
                                                            defaultValue={PrecoCardapio}
                                                            value={ PrecoCardapio ? PrecoCardapio : null}
                                                            onChange={e => setPrecoCardapio(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{display:"-ms-flexbox"}}>
                                                        <div className="FuxyEf">Setor do item:</div>
                                                        <div className=" _1iy_ _a4y _ohe mbm mtp">
                                                            <select
                                                                value={String(setorSelecionado)}
                                                                onChange={(e) => setSetorSelecionado(e.target.value)}
                                                                className="inputtext _58mg _8esa"
                                                            >
                                                                <option value="">Selecione um setor</option>
                                                                {setoresDisponiveis.map((setor) => (
                                                                <option key={setor.id} value={String(setor.id)}>
                                                                    {setor.nome}
                                                                </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <SelecionarIngredientesComQuantidade
                                                    item={ingredientesDisponiveis}
                                                    onChange={(ingredientes) => setIngredientesSelecionados(ingredientes)}
                                                    />
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

export default Cardapio; 