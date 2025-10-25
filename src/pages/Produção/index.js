import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {api, baseURL} from "../../services/api";
import "./style.css";

export default function Producao() {
  const { setorId } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("pendentes");

  useEffect(() => {
    buscarPedidos();

    // 🔌 Conecta ao WebSocket
    const socket = io(baseURL); // troque para seu backend

    // Recebe novos pedidos em tempo real
    socket.on("novoPedido", (novoPedido) => {
      // Exibe só os pedidos do setor atual
      const contemSetor = novoPedido.itens.some(
        (i) => i.setorId === setorId
      );
      if (contemSetor) {
        setPedidos((prev) => [...prev, novoPedido]);
      }
    });
    socket.on("pedidoAtualizado", (pedidoAtualizado) => {
      setPedidos((prev) => {
        const mapa = new Map(prev.map((p) => [String(p.id), p]));
        mapa.set(String(pedidoAtualizado.id), pedidoAtualizado);
        // manter ordem (novo no topo)
        return Array.from(mapa.values()).sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));
      });
    });

    return () => socket.disconnect();
  }, [setorId]);

  async function buscarPedidos() {
    setLoading(true);
    try {
      const response = await api.get(`/pedido/setor/${setorId}`);
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
    setLoading(false);
  }

  async function marcarItemComoPronto(itemId) {
    try {
      await api.patch(`/itempedido/${itemId}`, { status: "pronto" });
      setPedidos((prev) =>
        prev.map((p) => ({
          ...p,
          itens: p.itens.map((i) =>
            i.id === itemId ? { ...i, status: "pronto" } : i
          ),
        }))
      );
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  }

  // Função para calcular o tempo desde a criação
  function tempoDesde(data) {
    const diff = Math.floor((Date.now() - new Date(data)) / 60000);
    return diff < 1 ? "agora" : `${diff} min atrás`;
  }

  if (loading) return <div className="carregando">Carregando...</div>;

  const pedidosPendentes = pedidos.filter(
    (p) => p.itens.some((i) => i.status !== "pronto")
  );
  const pedidosConcluidos = pedidos.filter(
    (p) => p.itens.every((i) => i.status === "pronto")
  );

  const pedidosExibidos = abaAtiva === "pendentes" ? pedidosPendentes : pedidosConcluidos;

  return (
    <div className="dashboard">
      <h1 className="titulo">📦 Pedidos - {setorId.toUpperCase()}</h1>

      <div className="abas">
        <button
          className={abaAtiva === "pendentes" ? "ativa" : ""}
          onClick={() => setAbaAtiva("pendentes")}
        > Em produção ({pedidosPendentes.length})</button>
        <button
          className={abaAtiva === "concluidos" ? "ativa" : ""}
          onClick={() => setAbaAtiva("concluidos")}
        >Concluídos ({pedidosConcluidos.length})</button>
      </div>

      {pedidosExibidos.length === 0 ? (
        <p className="vazio">
          {abaAtiva === "pendentes"
            ? "Nenhum pedido pendente."
            : "Nenhum pedido concluído."}
        </p>
      ) : (
      <div className="lista-pedidos">
        {pedidosExibidos.map((pedido) => (
          <div key={pedido.id} className="card-pedido">
            <div className="cabecalho-pedido">
              <span className="codigo">{pedido.codigo}</span>
              <span className="tempo">{tempoDesde(pedido.criadoEm)}</span>
            </div>

            <ul className="lista-itens">
              {pedido.itens.map((item) => (
                <li key={item.id} className={`item ${item.status}`}>
                  <div className="info-item">
                    <span className="nome-item">{item.cardapio.nome}</span>
                    <span className="observacao">{item.observacao}</span>
                  </div>
                  <div className="acoes-item">
                    <span className="quantidade">x{item.quantidade}</span>
                    {item.status !== "pronto" && (
                      <button
                        className="btn-item-pronto"
                        onClick={() => marcarItemComoPronto(item.id)}
                      >
                        ✅ Pronto
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

/*import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./style.css";

export default function Producao() {
  const { setorId } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarPedidos();
  }, [setorId]);

  async function buscarPedidos() {
    setLoading(true);
    try {
      const response = await api.get(`/pedido/setor/${setorId}`);
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
    setLoading(false);
  }

  async function marcarComoPronto(pedidoId) {
    try {
      await api.patch(`/pedido/${pedidoId}`, { status: "pronto" });
      buscarPedidos(); // atualiza lista
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
    }
  }

  if (loading) return <div className="carregando">Carregando...</div>;

  return (
    <div className="dashboard">
      <h1 className="titulo">📦 Pedidos - {setorId.toUpperCase()}</h1>

      {pedidos.length === 0 ? (
        <p className="vazio">Nenhum pedido pendente.</p>
      ) : (
        <div className="lista-pedidos">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="card-pedido">
              <div className="cabecalho-pedido">
                <span className="codigo">{pedido.codigo}</span>
                <span className={`status ${pedido.status}`}>
                  {pedido.status.toUpperCase()}
                </span>
              </div>

              <ul className="lista-itens">
                {pedido.itens.map((item) => (
                  <li key={item.id}>
                    <span className="nome-item">{item.cardapio.nome}</span>
                    <span className="observacao">{item.observacao}</span>
                    <span className="quantidade">x{item.quantidade}</span>
                  </li>
                ))}
              </ul>

              <div className="rodape-pedido">
                <span className="total">Total: R$ {Number(pedido.total).toFixed(2)}</span>
                {pedido.status !== "pronto" && (
                  <button
                    className="btn-pronto"
                    onClick={() => marcarComoPronto(pedido.id)}
                  >
                    Marcar como pronto
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/