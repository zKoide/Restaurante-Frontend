import React, { useEffect, useState } from "react";
import * as Motion from "framer-motion";

import NavBar from "../../components/Menu/index copy";
import "./MontarPedido.css";
import api from "../../services/api";
import { v4 as uuidv4 } from "uuid";

export default function MontarPedido() {
  
  const { motion, AnimatePresence } = Motion;
  const [cardapio, setCardapio] = useState([]);
  const [setores, setSetores] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("carrinho");
    return salvo ? JSON.parse(salvo) : [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarCardapio() {
      try {
        const res = await api.get("http://localhost:3333/cardapio");
        setCardapio(res.data);

        const setoresUnicos = [
          ...new Map(res.data.map((i) => [i.setor?.id, i.setor])).values(),
        ].filter(Boolean);
        setSetores(setoresUnicos);
      } catch (err) {
        console.error("Erro ao buscar cardápio:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarCardapio();
  }, []);

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (item) => {
    const novoItem = {
      uuid: uuidv4(),
      id: item.id,
      nome: item.nome,
      setorid: item.setorId,
      preco: Number(item.preco),
      quantidade: 1,
      observacao: "",
    };
    setCarrinho((prev) => [...prev, novoItem]);
  };

  const removerDoCarrinho = (uuid) => {
    setCarrinho((prev) => prev.filter((i) => i.uuid !== uuid));
  };

  const atualizarObservacao = (uuid, novaObs) => {
    setCarrinho((prev) =>
      prev.map((i) => (i.uuid === uuid ? { ...i, observacao: novaObs } : i))
    );
  };

  const alterarQuantidade = (uuid, delta) => {
    setCarrinho((prev) =>
      prev.map((i) =>
        i.uuid === uuid
          ? { ...i, quantidade: Math.max(1, i.quantidade + delta) }
          : i
      )
    );
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  const cardapioFiltrado = cardapio.filter((item) => {
    const termo = filtroNome.toLowerCase().trim();
    const nomeOK = item.nome.toLowerCase().includes(termo) || item.descricao.toLowerCase().includes(termo);
    const setorOK = filtroSetor === "todos" || item.setorId == Number(filtroSetor);
    return nomeOK && setorOK;
  });

  async function addAgendamento(e){
    e.preventDefault();
            
    await api.post("/pedido", {
      canal: "Balcão",
      itens: carrinho,
      total: total,
    })
    .then(function (response) {
      console.log("Pedido criado com sucesso:", response.data);
      localStorage.removeItem("carrinho");
      setCarrinho([]);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="montarPedido-container">
      <NavBar />

      <div className="montarPedido-content">
        <h2>Monte seu Pedido 🍽️</h2>

        {/* Filtros */}
        <div className="filtros">
          <input
            className="input-busca"
            type="text"
            placeholder="🔍 Buscar item..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />

          <select
            value={filtroSetor}
            onChange={(e) => setFiltroSetor(e.target.value)}
            className="select-busca"
          >
            <option value="todos">Todos os Setores</option>
            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Lista do cardápio com animação */}
        <div className="lista-cardapio">
          {loading ? (
              <p>Carregando itens do cardápio...</p> // mensagem ou spinner
            ) : cardapioFiltrado.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {cardapioFiltrado.map((item) => (
              <motion.div
                key={item.id}
                className="card-item"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div>
                  <h4>{item.nome}</h4>
                  <p>{item.descricao}</p>
                  <p className="preco">
                    R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                  </p>
                  {item.ingredientes?.length > 0 && (
                    <small>
                      Ingredientes:{" "}
                      {item.ingredientes
                        .map((i) => i.ingrediente?.nome)
                        .filter(Boolean)
                        .join(", ")}
                    </small>
                  )}
                </div>
                <button onClick={() => adicionarAoCarrinho(item)}>
                  Adicionar +
                </button>
              </motion.div>
            ))}
          </AnimatePresence> 
            ) : (
              <p className="sem-resultados">Nenhum item encontrado 😕</p>
            )}
        </div>

        {/* Carrinho */}
        {carrinho.length > 0 && (
          <motion.div
            className="carrinho"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>🛒 Seu Carrinho</h3>
            {carrinho.map((item) => (
              <div key={item.uuid} className="item-carrinho">
                <div>
                  <strong>{item.nome}</strong>
                  <div className="quantidade-controle">
                    <button onClick={() => alterarQuantidade(item.uuid, -1)}>
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => alterarQuantidade(item.uuid, +1)}>
                      +
                    </button>
                  </div>

                  <div className="observacao">
                    <label>Observação:</label>
                    <textarea
                      placeholder="Ex: sem cebola, pouco sal..."
                      value={item.observacao || ""}
                      onChange={(e) =>
                        atualizarObservacao(item.uuid, e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <span>
                    R$ {(item.preco * item.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                  <button onClick={() => removerDoCarrinho(item.uuid)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}

            <h3 className="total">
              Total: R$ {total.toFixed(2).replace(".", ",")}
            </h3>

            <button
              className="finalizar"
              onClick={addAgendamento}
            >
              Finalizar Pedido
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
