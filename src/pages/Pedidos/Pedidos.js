import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {api, baseURL} from "../../services/api";
import "./Pedidos.css";
import styles from "./Pedidos.module.css";
import NavBar from "../../components/Menu/index copy";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("em_andamento"); // todos | pendentes | prontos
  const [busca, setBusca] = useState("");
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const [itensEmAtualizacao, setItensEmAtualizacao] = useState(new Set());


  const somNovoPedido = useRef(new Audio("/sons/newPedido.mp3"));

  // busca inicial
  useEffect(() => {
    carregarPedidos();

    // conectar socket
    socketRef.current = io(baseURL);

    socketRef.current.on("connect", () => {
      console.log("Socket conectado:", socketRef.current.id);
    });
    const desbloquearSom = () => {
      somNovoPedido.current.play().then(() => {
        somNovoPedido.current.pause();
        somNovoPedido.current.currentTime = 0;
        console.log("🔓 Áudio desbloqueado");
        window.removeEventListener("click", desbloquearSom);
      }).catch(() => {});
    };
    window.addEventListener("click", desbloquearSom);
    // quando um novo pedido é criado
    socketRef.current.on("novoPedido", (pedido) => {
      // insere no topo se ainda não existir
      setPedidos((prev) => {
        const existe = prev.some((p) => p.id === pedido.id);
        if (!existe) {
          // 🚨 Toca o som apenas se for um pedido novo
          const audio = somNovoPedido.current.cloneNode();
          audio.volume = 0.4;
          audio.play().catch((err) => console.warn("Som bloqueado:", err));
        }
        if (prev.some((p) => String(p.id) === String(pedido.id))) return prev;
        return [...prev, pedido];
      });
    });

    // quando um pedido (ou itens) for atualizado
    socketRef.current.on("pedidoAtualizado", (pedidoAtualizado) => {
      
      setPedidos((prev) => {
        return prev.map(p => {
          if (p.id !== pedidoAtualizado.id) return p;

          // Ignorar atualizações "antigas"
          const dataLocal = new Date(p.atualizadoEm || p.criadoEm);
          const dataNova = new Date(pedidoAtualizado.atualizadoEm || pedidoAtualizado.criadoEm);
          if (dataNova < dataLocal) {
            return p;
          }
          // Evita "rebaixar" status (ex: de pronto para em_preparo)
          const ordemStatus = ["recebido", "em_preparo", "pronto", "entregue", "cancelado"];
          const nivelLocal = ordemStatus.indexOf(p.status);
          const nivelNovo = ordemStatus.indexOf(pedidoAtualizado.status);
          if (nivelNovo < nivelLocal) {
            return p;
          }
          return pedidoAtualizado;
        });
        /*const mapa = new Map(prev.map((p) => [String(p.id), p]));
        mapa.set(String(pedidoAtualizado.id), pedidoAtualizado);
        // manter ordem (mais antigo no topo)
        return Array.from(mapa.values()).sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));*/
      });
    });

    // atualiza o tempo a cada segundo (força re-render leve)
    intervalRef.current = setInterval(() => {
      setPedidos((prev) => [...prev]);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  async function carregarPedidos() {
    setLoading(true);
    try {
      const res = await api.get("/pedido");
      setPedidos(res.data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
    setLoading(false);
  }

  // calcula tempo desde criadoEm (ex: 3m 12s)
  function tempoDecorridoISO(dataISO) {
    const agora = Date.now();
    const inicio = new Date(dataISO).getTime();
    const dif = Math.max(0, Math.floor((agora - inicio) / 1000)); // segundos
    const minutos = Math.floor(dif / 60);
    const segundos = dif % 60;
    return `${minutos}m ${segundos.toString().padStart(2, "0")}s`;
  }
  //marcarItemComoEntregue
  async function marcarItemComoEntregue(itemId, pedidoId) {
    if (itensEmAtualizacao.has(itemId)) return; // impede clique duplo
    setItensEmAtualizacao(prev => new Set(prev).add(itemId));
    try {
      // otimistic update local
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedidoId)
            ? {
                ...p,
                itens: p.itens.map((it) =>
                  String(it.id) === String(itemId) ? { ...it, status: "entregue" } : it
                ),
                atualizadoEm: new Date().toISOString(),
              }
            : p
        )
      );

      // chamada real
      await api.patch(`/itempedido/${itemId}`, { status: "entregue" });

      // opcional: buscar pedido atualizado (o servidor idealmente emite pedidoAtualizado)
      // const res = await api.get(`/pedido/${pedidoId}`);
      // setPedidos(prev => prev.map(p => p.id === pedidoId ? res.data : p));
    } catch (err) {
      console.error("Erro ao marcar item como entregue:", err);
      // rollback simplório: recarrega todos (pode melhorar)
      carregarPedidos();
    }  finally {
      setItensEmAtualizacao(prev => {
        const novo = new Set(prev);
        novo.delete(itemId);
        return novo;
      });
    }
  }
  // marcar item como pronto
  async function marcarItemComoPronto(itemId, pedidoId) {
    if (itensEmAtualizacao.has(itemId)) return; // impede clique duplo
    setItensEmAtualizacao(prev => new Set(prev).add(itemId));
    try {
      // otimistic update local
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedidoId) 
            ? {
                ...p,
                status: "em_preparo",
                itens: p.itens.map((it) =>
                  String(it.id) === String(itemId) ? { ...it, status: "pronto" } : it
                ),
                atualizadoEm: new Date().toISOString(),
              }
            : p
        )
      );

      // chamada real
      await api.patch(`/itempedido/${itemId}`, { status: "pronto" });

      // opcional: buscar pedido atualizado (o servidor idealmente emite pedidoAtualizado)
      // const res = await api.get(`/pedido/${pedidoId}`);
      // setPedidos(prev => prev.map(p => p.id === pedidoId ? res.data : p));
    } catch (err) {
      console.error("Erro ao marcar item pronto:", err);
      // rollback simplório: recarrega todos (pode melhorar)
      carregarPedidos();
    } finally {
      setItensEmAtualizacao(prev => {
        const novo = new Set(prev);
        novo.delete(itemId);
        return novo;
      });
    }
  }

  // marcar pedido inteiro como entregue (exemplo de ação global)
  async function marcarPedidoEntregue(pedidoId) {
    
    try {
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedidoId)
            ? {
                ...p,
                status: "entregue",
                itens: p.itens.map((item) => ({
                  ...item,
                  status: "entregue",
                })),
                atualizadoEm: new Date().toISOString(),
              }
            : p
        )
      );
      await api.patch(`/pedido/${pedidoId}`, { status: "entregue" });
      // servidor deve emitir pedidoAtualizado; atualizamos por precaução:
      setPedidos((prev) => prev.map(p => (String(p.id) === String(pedidoId) ? { ...p, status: "entregue" } : p)));
    } catch (err) {
      console.error("Erro ao marcar pedido entregue:", err);
    }
  }
  async function marcarPedidoCancelado(pedidoId) {
    try {
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedidoId)
            ? {
                ...p,
                status: "cancelado",
                itens: p.itens.map((item) => ({
                  ...item,
                  status: "cancelado",
                })),
                atualizadoEm: new Date().toISOString(),
              }
            : p
        )
      );
      console.log("marcar pedido como cancelado "+pedidoId)
      await api.patch(`/pedido/${pedidoId}`, { status: "cancelado" });
      // servidor deve emitir pedidoAtualizado; atualizamos por precaução:
      setPedidos((prev) => prev.map(p => (String(p.id) === String(pedidoId) ? { ...p, status: "cancelado" } : p)));
    } catch (err) {
      console.error("Erro ao marcar pedido como cancelado:", err);
    }
  }

  // filtragem e pesquisa
  const pedidosFiltrados = pedidos.filter((p) => {
    // filtro status
    if (filtroStatus === "em_andamento") {
      if (p.itens.every((i) => i.status === "entregue" || i.status === "cancelado")) return false;
    } else if (filtroStatus === "pendentes") {
      if (!p.itens.some((i) => i.status !== "pronto" && i.status !=="cancelado" && i.status !=="entregue")) return false;
    }/* else if (filtroStatus === "prontos") {
      if (!p.itens.every((i) => i.status === "pronto" || i.status === "entregue" )) return false;
    } */else if (filtroStatus === "prontos") {
      // todos os itens estão prontos ou entregues, mas pelo menos um ainda deve estar "pronto" (não entregue)
      const todosProntosOuEntregues = p.itens.every(i => i.status === "pronto" || i.status === "entregue");
      const algumPronto = p.itens.some(i => i.status === "pronto"); // pelo menos um ainda não entregue
      if (!(todosProntosOuEntregues && algumPronto)) return false;
    } else if (filtroStatus === "entregues") {
      if (!p.itens.every((i) => i.status === "entregue")) return false;
    } else if (filtroStatus === "cancelado") {
      if (!p.itens.every((i) => i.status === "cancelado")) return false;
    } else if (filtroStatus === "todos") {
      return true;
    } 

    // busca por codigo ou cliente
    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      if (!(String(p.codigo).toLowerCase().includes(q) || (p.clienteNome && p.clienteNome.toLowerCase().includes(q)))) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    
  }, [pedidosFiltrados]);

  useEffect(() => {
    pedidos.forEach((pedido) => {
      const todosProntos = pedido.itens.every((i) => i.status === "pronto" || i.status === "entregue");

      const todosEntregues = pedido.itens.every((i) => i.status === "entregue");
      // Exemplo: rodar função apenas quando o pedido está pronto
      if (todosProntos && pedido.status === "em_preparo") {
        AtualizarStatusPedidoComTodosItensPronto(pedido.id);
      }
      if (todosEntregues && pedido.status === "pronto") {
        AtualizarStatusPedidoComTodosItensEntregues(pedido.id);
      }
    });
  }, [pedidos])

  const AtualizarStatusPedidoComTodosItensPronto = async (pedido) =>  {

    //console.log(`Pedido #${pedido} está pronto!`);
    
    try {
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedido)
            ? {
                ...p,
                status: "pronto",
                atualizadoEm: new Date().toISOString(),
              }
            : p
        )
      );
      await api.patch(`/pedido/${pedido}`, { status: "pronto" });
      // servidor deve emitir pedidoAtualizado; atualizamos por precaução:
      //setPedidos((prev) => prev.map(p => (String(p.id) === String(pedido) ? { ...p, status: "pronto" } : p)));
      
    } catch (err) {
      console.error("Erro ao marcar pedido como pronto:", err);
    }
    
  };
  const AtualizarStatusPedidoComTodosItensEntregues = async (pedido) =>  {

    //console.log(`Pedido #${pedido} está pronto!`);
    try {
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedido)
            ? {
                ...p,
                status: "entregue",
                atualizadoEm: new Date().toISOString(),
              }
            : p
        )
      );
      await api.patch(`/pedido/${pedido}`, { status: "entregue" });
      // servidor deve emitir pedidoAtualizado; atualizamos por precaução:
      //setPedidos((prev) => prev.map(p => (String(p.id) === String(pedido) ? { ...p, status: "entregue" } : p)));
      
    } catch (err) {
      console.error("Erro ao marcar pedido como entregue:", err);
    }
    
  };
  return (
    
    <div className={styles.PedidoContainer}>
      <NavBar />
      <div className="PedidoContent">
        <header className={styles.topo}>
          <h2>📋 Pedidos</h2>

          <div className={styles.filtros}>
            <input
              type="text"
              placeholder="Buscar por código ou cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.inputBusca}
            />

            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className={styles.selectStatus}>
              <option value="em_andamento">⏳ Em andamento</option>
              <option value="pendentes">⌛ Pendentes</option>
              <option value="prontos">✅ Prontos</option>
              <option value="entregues">📦 Entregues</option>
              <option value="cancelado">❌ Cancelados</option>
              <option value="todos">📋 Todos</option>
            </select>

            <button onClick={carregarPedidos} className={styles.btnRefresh}>Atualizar</button>
          </div>
        </header>

        {loading ? (
          <div className={styles.carregando}>Carregando pedidos...</div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className={styles.vazio}>Nenhum pedido encontrado.</div>
        ) : (
          <div className={styles.listaPedidos}>
            {pedidosFiltrados.map((pedido) => {
              const todosProntos = pedido.itens.every((i) => i.status === "pronto" || i.status === "entregue");
              return (
                <div key={pedido.id} 
                className={`${styles.cardPedido} ${todosProntos ? styles.pedidoPronto : ""}`}>
                  <div className={styles.cardTopo}>
                    <div>
                      <div className={styles.codigo}>#{pedido.codigo}</div>
                      <div className={styles.cliente}>{pedido.clienteNome || "Cliente não informado"}</div>
                    </div>
                    <div className={styles.cardTopoRight}>
                      <div className={styles.tempo}>{tempoDecorridoISO(pedido.criadoEm)}</div>
                      <div 
                        className={`${styles.statusGeral} ${
                          pedido.status === "cancelado"
                            ? styles.red
                            : todosProntos
                              ? styles.green
                              : styles.orange
                        }`}>
                        {(pedido.status == "em_preparo" ? "EM PREPARO" : "" || pedido.status ).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className={styles.itensContainer}>
                    <ul className={styles.itensLista}>
                      {pedido.itens.map((item) => (
                        <li key={item.id} 
                        className={`${styles.itemRow} ${
                          item.status === "entregue" || pedido.status === "cancelado"
                            ? styles.itemPronto
                            : ""
                        }`}>
                          <div className={styles.itemLeft}>
                            <div className={styles.nomeItem}>{item.cardapio?.nome || item.cardapioNome || "—"}</div>
                            {item.observacao ? <div className={styles.obsItem}>Obs: {item.observacao}</div> : null}
                          </div>

                          <div className={styles.itemRight}>
                            <div className={styles.quantidade}>x{item.quantidade}</div>
                             
                            {pedido.status === "cancelado" ? (
                              <span className={styles.marcadoPronto}>❌</span>
                            ) : item.status === "pronto" ? (
                              <button className={styles.btnPronto} onClick={() => marcarItemComoEntregue(item.id, pedido.id)}>
                                📦 Entregar
                              </button>
                            ) : item.status !== "pronto" && item.status !== "entregue" ? (
                              <button className={styles.btnPronto} onClick={() => marcarItemComoPronto(item.id, pedido.id)}>
                                ✅ Pronto
                              </button>
                            ) : (
                              <span className={styles.marcadoPronto}>✅</span>
                            )}                       
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.cardRodape}>
                    <div className={styles.total}>Total: R$ {Number(pedido.total || 0).toFixed(2)}</div>
                    <div className={styles.acoesRodape}>
                      {pedido.status === "pronto" ? (
                        <button className={styles.btnEntregar} onClick={() => marcarPedidoEntregue(pedido.id)}>Marcar Entregue</button>
                      ) : ""}
                      {pedido.status === "recebido" ? (
                        <button className={styles.btnEntregar} onClick={() => marcarPedidoCancelado(pedido.id)}>Cancelar Pedido</button>
                      ) : ""}
                      <button className={styles.btnDetalhes} onClick={() => window.location.href = `/pedido/${pedido.id}`}>Ver Pedido</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    
  );
}
