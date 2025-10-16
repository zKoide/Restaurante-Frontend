import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../../services/api";
import "./Pedidos.css";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos"); // todos | pendentes | prontos
  const [busca, setBusca] = useState("");
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  // busca inicial
  useEffect(() => {
    carregarPedidos();

    // conectar socket
    socketRef.current = io("http://localhost:3333");

    socketRef.current.on("connect", () => {
      console.log("Socket conectado:", socketRef.current.id);
    });

    // quando um novo pedido é criado
    socketRef.current.on("novoPedido", (pedido) => {
      console.log("novoPedido socket:", pedido);
      // insere no topo se ainda não existir
      setPedidos((prev) => {
        if (prev.some((p) => String(p.id) === String(pedido.id))) return prev;
        return [...prev, pedido];
      });
    });

    // quando um pedido (ou itens) for atualizado
    socketRef.current.on("pedidoAtualizado", (pedidoAtualizado) => {
      setPedidos((prev) => {
        const mapa = new Map(prev.map((p) => [String(p.id), p]));
        mapa.set(String(pedidoAtualizado.id), pedidoAtualizado);
        // manter ordem (mais antigo no topo)
        return Array.from(mapa.values()).sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));
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

  // marcar item como pronto
  async function marcarItemComoPronto(itemId, pedidoId) {
    try {
      // otimistic update local
      setPedidos((prev) =>
        prev.map((p) =>
          String(p.id) === String(pedidoId)
            ? {
                ...p,
                itens: p.itens.map((it) =>
                  String(it.id) === String(itemId) ? { ...it, status: "pronto" } : it
                ),
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
    }
  }

  // marcar pedido inteiro como entregue (exemplo de ação global)
  async function marcarPedidoEntregue(pedidoId) {
    try {
      await api.patch(`/pedido/${pedidoId}`, { status: "entregue" });
      // servidor deve emitir pedidoAtualizado; atualizamos por precaução:
      setPedidos((prev) => prev.map(p => (String(p.id) === String(pedidoId) ? { ...p, status: "entregue" } : p)));
    } catch (err) {
      console.error("Erro ao marcar pedido entregue:", err);
    }
  }

  // filtragem e pesquisa
  const pedidosFiltrados = pedidos.filter((p) => {
    // filtro status
    if (filtroStatus === "pendentes") {
      if (!p.itens.some((i) => i.status !== "pronto")) return false;
    } else if (filtroStatus === "prontos") {
      if (!p.itens.every((i) => i.status === "pronto")) return false;
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
    pedidosFiltrados.forEach((pedido) => {
      const todosProntos = pedido.itens.every((i) => i.status === "pronto");

      // Exemplo: rodar função apenas quando o pedido está pronto
      if (todosProntos) {
        notificarPedidoPronto(pedido.id);
      }
    });
  }, [pedidosFiltrados]);

  const notificarPedidoPronto = (pedido) => {
    console.log(`Pedido #${pedido} está pronto!`);
  };
  
  return (
    <div className="pedidos-page">
      <header className="topo">
        <h2>📋 Pedidos</h2>

        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por código ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca"
          />

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="select-status">
            <option value="todos">Todos</option>
            <option value="pendentes">Pendentes (algum item não pronto)</option>
            <option value="prontos">Prontos (todos itens prontos)</option>
          </select>

          <button onClick={carregarPedidos} className="btn-refresh">Atualizar</button>
        </div>
      </header>

      {loading ? (
        <div className="carregando">Carregando pedidos...</div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="vazio">Nenhum pedido encontrado.</div>
      ) : (
        <div className="lista-pedidos">
          {pedidosFiltrados.map((pedido) => {
            const todosProntos = pedido.itens.every((i) => i.status === "pronto");
            return (
              <div key={pedido.id} className={`card-pedido ${todosProntos ? "pedido-pronto" : ""}`}>
                <div className="card-topo">
                  <div>
                    <div className="codigo">#{pedido.codigo}</div>
                    <div className="cliente">{pedido.clienteNome || "Cliente não informado"}</div>
                  </div>
                  <div className="card-topo-right">
                    <div className={`status-geral ${todosProntos ? "green" : "orange"}`}>
                      {todosProntos ? "PRONTO" : (pedido.status || "EM PREPARO").toUpperCase()}
                    </div>
                    <div className="tempo">{tempoDecorridoISO(pedido.criadoEm)}</div>
                  </div>
                </div>

                <div className="itens-container">
                  <ul className="itens-lista">
                    {pedido.itens.map((item) => (
                      <li key={item.id} className={`item-row ${item.status === "pronto" ? "item-pronto" : ""}`}>
                        <div className="item-left">
                          <div className="nome-item">{item.cardapio?.nome || item.cardapioNome || "—"}</div>
                          {item.observacao ? <div className="obs-item">Obs: {item.observacao}</div> : null}
                        </div>

                        <div className="item-right">
                          <div className="quantidade">x{item.quantidade}</div>
                          {item.status !== "pronto" ? (
                            <button className="btn-pronto" onClick={() => marcarItemComoPronto(item.id, pedido.id)}>
                              ✅ Pronto
                            </button>
                          ) : (
                            <span className="marcado-pronto">✅</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-rodape">
                  <div className="total">Total: R$ {Number(pedido.total || 0).toFixed(2)}</div>
                  <div className="acoes-rodape">
                    <button className="btn-entregar" onClick={() => marcarPedidoEntregue(pedido.id)}>Marcar Entregue</button>
                    <button className="btn-detalhes" onClick={() => window.location.href = `/pedido/${pedido.id}`}>Ver Pedido</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
