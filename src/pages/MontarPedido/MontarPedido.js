import React, { useEffect, useState } from "react";
import * as Motion from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import NavBar from "../../components/Menu/index copy";
import "./teste.css";
import { api } from "../../services/api";
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
  const [mostrarBotaoCarrinho, setMostrarBotaoCarrinho] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalAcai, setModalAcai] = useState(null); // item de açaí sendo montado

  // Opções fixas do açaí
  const TAMANHOS = {
    "300ml": { preco: 18, frutas: 1, comp: 3 },
    "500ml": { preco: 29, frutas: 2, comp: 3 },
    "700ml": { preco: 38, frutas: 3, comp: 3 },
  };
  const PRECO_EXTRA_FRUTA = 2.0;
  const PRECO_EXTRA_COMP = 2.0;
  const PRECO_NUTELLA = 7.0;

  const frutasDisponiveis = [
    "Banana",
    "Morango",
    "Kiwi",
    "Abacaxi",
    "Manga",
    "Uva",
  ];
  const complementosDisponiveis = [
    "Leite Condensado",
    "Leite em Pó",
    "Granulado",
    "Granola",
    "M&M",
    "Paçoca",
  ];

  useEffect(() => {
    async function carregarCardapio() {
      try {
        const res = await api.get("/cardapio");
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
    console.log(item)
    // Se for açaí, abre modal de montagem
    if (item.setor?.nome?.toLowerCase().includes("açaí")) {
      console.log("no acai")
      setModalAcai({
        ...item,
        tamanho: null,
        frutas: [],
        complementos: [],
        nutella: false,
        precoBase: 0,
        precoFinal: 0,
      });
      return;
    }

    // Itens normais
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

  const calcularPrecoAcai = (dados) => {
    if (!dados.tamanho) return 0;
    const regras = TAMANHOS[dados.tamanho];
    const base = regras.preco;

    const extrasFruta =
      Math.max(0, dados.frutas.length - regras.frutas) * PRECO_EXTRA_FRUTA;
    const extrasComp =
      Math.max(0, dados.complementos.length - regras.comp) * PRECO_EXTRA_COMP;
    const nutella = dados.nutella ? PRECO_NUTELLA : 0;

    return base + extrasFruta + extrasComp + nutella;
  };

  const atualizarAcai = (campo, valor) => {
    setModalAcai((prev) => {
      const novo = { ...prev, [campo]: valor };
      return { ...novo, precoFinal: calcularPrecoAcai(novo) };
    });
  };

  const toggleSelecao = (tipo, item) => {
    setModalAcai((prev) => {
      const selecionados = prev[tipo].includes(item)
        ? prev[tipo].filter((i) => i !== item)
        : [...prev[tipo], item];
      const novo = { ...prev, [tipo]: selecionados };
      return { ...novo, precoFinal: calcularPrecoAcai(novo) };
    });
  };

  const confirmarAcai = () => {
    const { tamanho, frutas, complementos, nutella, precoFinal } = modalAcai;
    const novoAcai = {
      uuid: uuidv4(),
      id: modalAcai.id,
      nome: `Açaí ${tamanho}`,
      preco: precoFinal,
      quantidade: 1,
      observacao: `Frutas: ${frutas.join(", ") || "Nenhuma"} | Complementos: ${
        complementos.join(", ") || "Nenhum"
      }${nutella ? " | +Nutella" : ""}`,
    };
    setCarrinho((prev) => [...prev, novoAcai]);
    setModalAcai(null);
  };

  const removerDoCarrinho = (uuid) => {
    setCarrinho((prev) => prev.filter((i) => i.uuid !== uuid));
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
    const nomeOK =
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo);
    const setorOK =
      filtroSetor === "todos" || item.setorId == Number(filtroSetor);
    return nomeOK && setorOK;
  });

  async function addAgendamento(e) {
    e.preventDefault();
    await api
      .post("/pedido", {
        canal: "Balcão",
        itens: carrinho,
        total: total,
      })
      .then((response) => {
        console.log("Pedido criado:", response.data);
        localStorage.removeItem("carrinho");
        setCarrinho([]);
        window.open(`/pedido/${response.data.id}`, "_blank");
      })
      .catch(console.error);
  }

  return (
    <div className="montarPedido-container">
      <NavBar />
      <div className="montarPedido-content">
        <h2>Monte seu Pedido 🍽️</h2>

        {/* filtros */}
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
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </div>
        {/* Botão de rolar para o carrinho */}
        <AnimatePresence>
          {carrinho.length > 0 && mostrarBotaoCarrinho && (
            <motion.button
            className="btn-scroll-carrinho"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              const carrinhoSection = document.querySelector(".carrinho");
                if (carrinhoSection) {
                  window.scrollTo({ top: carrinhoSection.offsetTop-10, behavior: "smooth" });
                  //carrinhoSection.scrollIntoView({ top: carrinhoSection.offsetTop, behavior: "smooth" });
                }
              }}
            >
              <FaShoppingCart style={{ width: "25px", height: "25px" }} />
              </motion.button>
          )}
        </AnimatePresence>
            
        {/* lista do cardápio */}
        <div className="lista-cardapio">
          {loading ? (
            <p>Carregando...</p>
          ) : cardapioFiltrado.length > 0 ? (
            <AnimatePresence>
              {cardapioFiltrado.map((item) => (
                <motion.div
                  key={item.id}
                  className="card-item"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <div>
                    <h4>{item.nome}</h4>
                    <p>{item.descricao}</p>
                    <p className="preco">
                      R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <button onClick={() => adicionarAoCarrinho(item)}>
                    Adicionar +
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p>Nenhum item encontrado 😕</p>
          )}
        </div>

        {/* Carrinho */}
        {carrinho.length > 0 && (
          <motion.div
            className="carrinho"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                  {item.observacao && (
                    <small style={{ color: "#666" }}>{item.observacao}</small>
                  )}
                </div>
                <div>
                  <span className="precoItem">
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
            <button className="finalizar" onClick={addAgendamento}>
              Finalizar Pedido
            </button>
          </motion.div>
        )}

        {/* Modal do Açaí */}
        {modalAcai && (
          <div className="modal-acai">
            <div className="conteudo">
              <h3>🍧 Monte seu Açaí</h3>

              {/* Tamanhos */}
              <div className="grupo">
                <h4>Tamanho</h4>
                {Object.keys(TAMANHOS).map((t) => (
                  <label key={t}>
                    <input
                      type="radio"
                      name="tamanho"
                      value={t}
                      checked={modalAcai.tamanho === t}
                      onChange={() => atualizarAcai("tamanho", t)}
                    />
                    {t} — R$ {TAMANHOS[t].preco.toFixed(2).replace(".", ",")}
                  </label>
                ))}
              </div>

              {modalAcai.tamanho && (
                <>
                  <div className="grupo">
                    <h4>
                      Frutas (até {TAMANHOS[modalAcai.tamanho].frutas})
                    </h4>
                    {frutasDisponiveis.map((f) => (
                      <label key={f}>
                        <input
                          type="checkbox"
                          checked={modalAcai.frutas.includes(f)}
                          onChange={() => toggleSelecao("frutas", f)}
                        />
                        {f}
                      </label>
                    ))}
                  </div>

                  <div className="grupo">
                    <h4>
                      Complementos (até {TAMANHOS[modalAcai.tamanho].comp})
                    </h4>
                    {complementosDisponiveis.map((c) => (
                      <label key={c}>
                        <input
                          type="checkbox"
                          checked={modalAcai.complementos.includes(c)}
                          onChange={() => toggleSelecao("complementos", c)}
                        />
                        {c}
                      </label>
                    ))}
                  </div>

                  <div className="grupo">
                    <label>
                      <input
                        type="checkbox"
                        checked={modalAcai.nutella}
                        onChange={() =>
                          atualizarAcai("nutella", !modalAcai.nutella)
                        }
                      />
                      Adicionar Nutella (+R$ 7,00)
                    </label>
                  </div>

                  <p className="preco-atual">
                    💰 Total: R${" "}
                    {modalAcai.precoFinal.toFixed(2).replace(".", ",")}
                  </p>

                  <div className="acoes">
                    <button onClick={confirmarAcai} className="btn-confirmar">Adicionar ao carrinho</button>
                    <button onClick={() => setModalAcai(null)} className="btn-cancelar">Cancelar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
