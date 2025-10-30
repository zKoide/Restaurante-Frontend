import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import "./ModalAcai.css";
import { v4 as uuidv4 } from "uuid";

export default function ModalAcai({ aberto, onClose, onAdd, item }) {
  const [acaiData, setAcaiData] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [frutasSelecionadas, setFrutasSelecionadas] = useState([]);
  const [complementosSelecionados, setComplementosSelecionados] = useState([]);
  const [extrasSelecionados, setExtrasSelecionados] = useState([]);
  const [precoFinal, setPrecoFinal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Busca dados do açaí do backend
  useEffect(() => {
    console.log(item)
    setAcaiData(item)
    async function carregarDadosAcai() {
      try {
        setLoading(true);
        const res = await api.get(`/acai/${item.id}`);
        setAcaiData(res.data);
      } catch (err) {
        console.error("Erro ao carregar dados do açaí:", err);
      } finally {
        setLoading(false);
      }
    }
    //if (aberto) carregarDadosAcai();
  }, [aberto, item.id]);

  // 🔹 Atualiza o preço conforme escolhas
  useEffect(() => {
    if (!tamanhoSelecionado) return;

    let total = Number(tamanhoSelecionado.preco);

    const extrasFrutas =
      frutasSelecionadas.length > tamanhoSelecionado.frutasMax
        ? frutasSelecionadas.length - tamanhoSelecionado.frutasMax
        : 0;

    const extrasAcomp =
      complementosSelecionados.length > tamanhoSelecionado.acompMax
        ? complementosSelecionados.length - tamanhoSelecionado.acompMax
        : 0;

    const precoExtrasFrutas = extrasFrutas * 2; // pode vir do backend se preferir
    const precoExtrasAcomp = extrasAcomp * 2;

    const nutellaExtra = extrasSelecionados?.some(
      (c) => c.ingrediente.nome.toLowerCase() === "nutella"
    )
      ? 7
      : 0;

    console.log(nutellaExtra)
    total += Number(precoExtrasFrutas) + Number(precoExtrasAcomp) + Number(nutellaExtra);
    
    setPrecoFinal(total);
  }, [tamanhoSelecionado, frutasSelecionadas, complementosSelecionados, extrasSelecionados]);

  if (!aberto) return null;

  const toggleSelecionado = (lista, setLista, item) => {
    console.log(item)
    setLista((prev) =>
      prev.some((i) => i.ingrediente.id === item.ingrediente.id)
        ? prev.filter((i) => i.ingrediente.id !== item.ingrediente.id)
        : [...prev, item]
    );
    console.log(lista)
  };

  const handleConfirmar = () => {
    console.log(frutasSelecionadas)
    if (!tamanhoSelecionado) return alert("Selecione um tamanho!");
    const novoItem = {
      uuid: uuidv4(),
      id: item.id,
      nome: `${item.nome} ${tamanhoSelecionado.nome}`,
      setorid: item.setorId,
      preco: precoFinal,
      quantidade: 1,
      observacao: `Frutas: ${frutasSelecionadas.map(frutas => frutas.ingrediente.nome).join(", ") || "Nenhuma"} | Complementos: ${
        complementosSelecionados.map(comp => comp.ingrediente.nome).join(", ") || "Nenhum"
      }${" "+extrasSelecionados.map( extra => "| Extra: "+extra.ingrediente.nome).join(", ") || "" }`,
    };
    onAdd(novoItem);
    Limpar();
  };
  function Limpar(){
    setComplementosSelecionados([])
    setExtrasSelecionados([])
    setFrutasSelecionadas([])
    setTamanhoSelecionado(null)
    
    
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <p>Carregando informações...</p>
          ) : (
            <>
              <h2>{acaiData?.nome}</h2>

              {/* TAMANHOS */}
              <div className="secao">
                <h4>Tamanho</h4>
                <div className="opcoes">
                  {acaiData?.prodVariacao?.map((v) => (
                    <button
                      key={v.id}
                      className={
                        tamanhoSelecionado?.id === v.id ? "ativo" : ""
                      }
                      onClick={() => setTamanhoSelecionado(v)}
                    >
                      {v.nome} — R${Number(v.preco).toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* FRUTAS */}
              {tamanhoSelecionado && (
                <div className="secao">
                  <h4>
                    Frutas{" "}
                    <span>
                      (até {tamanhoSelecionado.frutasMax} incluídas — +R$ 2,00
                      extras)
                    </span>
                  </h4>
                  <div className="opcoes">
                    {acaiData?.ingredientes?.map((ingrediente) => (
                      
                      ingrediente.ingrediente?.tipo == "Fruta" && (
                        <button
                          key={ingrediente.ingrediente.id}
                          className={
                            frutasSelecionadas.some((i) => i.ingrediente.id === ingrediente.ingrediente.id)
                              ? "ativo"
                              : ""
                          }
                          onClick={() =>
                            toggleSelecionado(
                              frutasSelecionadas,
                              setFrutasSelecionadas,
                              ingrediente
                            )
                          }
                        >
                          {ingrediente.ingrediente.nome}
                        </button>
                      )          
                    
                    ))}
          
                  </div>
                </div>
              )}

              {/* COMPLEMENTOS */}
              {tamanhoSelecionado && (
                <div className="secao">
                  <h4>
                    Complementos{" "}
                    <span>
                      (até {tamanhoSelecionado.acompMax} incluídos — +R$ 2,00
                      extras)
                    </span>
                  </h4>
                  <div className="opcoes">
                    {acaiData?.ingredientes?.map((ingrediente) => (
                      ingrediente.ingrediente?.tipo == "Complemento" && (
                        <button
                          key={ingrediente.ingrediente.id}
                          className={
                            complementosSelecionados.some((i) => i.ingrediente.id === ingrediente.ingrediente.id)
                              ? "ativo"
                              : ""
                          }
                          onClick={() =>
                            toggleSelecionado(
                              complementosSelecionados,
                              setComplementosSelecionados,
                              ingrediente
                            )
                          }
                        >
                          {ingrediente.ingrediente.nome}
                        </button>
                      )
                      
                    ))}
                  </div>
                </div>
              )}

              {/* EXTRAS */}
              {tamanhoSelecionado && (
                <div className="secao">
                  <h4>
                    Extras
                  </h4>
                  <div className="opcoes">
                    {acaiData?.ingredientes?.map((ingrediente) => (
                      ingrediente.ingrediente?.tipo == "Extra" && (
                        <button
                          key={ingrediente.ingrediente.id}
                          className={
                            extrasSelecionados.some((i) => i.ingrediente.id === ingrediente.ingrediente.id)
                              ? "ativo"
                              : ""
                          }
                          onClick={() =>
                            toggleSelecionado(
                              extrasSelecionados,
                              setExtrasSelecionados,
                              ingrediente
                            )
                          }
                        >
                          {ingrediente.ingrediente.nome}
                        </button>
                      )
                      
                    ))}
                  </div>
                </div>
              )}

              {/* PREÇO FINAL */}
              {tamanhoSelecionado && (
                
                console.log(precoFinal),
                <div className="preco-final">
                  <h3>Total: R$ {Number(precoFinal).toFixed(2)}</h3>
                </div>
              )}

              <div className="botoes-modal">
                <button onClick={() => Limpar()}>Cancelar</button>
                <button
                  onClick={handleConfirmar}
                  disabled={!tamanhoSelecionado}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
