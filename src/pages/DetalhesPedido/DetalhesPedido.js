import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./DetalhesPedido.css";

export default function DetalhesPedido() {
  const { id } = useParams(); // id do pedido na URL
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPedido() {
      try {
        const res = await api.get(`/pedido/${id}`);
        console.log(res.data)
        setPedido(res.data);
      } catch (err) {
        console.error("Erro ao carregar pedido:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarPedido();
  }, [id]);

  if (loading) return <p>Carregando pedido...</p>;
  if (!pedido) return <p>Pedido não encontrado 😕</p>;

  const total = pedido.itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  // Função para imprimir
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="detalhes-pedido-container">
      <div className="topo-detalhes">
        <button className="voltar" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Voltar
        </button>

        <button className="imprimir" onClick={handlePrint}>
          <FaPrint /> Imprimir
        </button>
      </div>

      <h2>Pedido #{pedido.id}</h2>
      <p>Status: <strong className={`status ${pedido.status}`}>{pedido.status === "em_preparo" ? "Em preparo" : pedido.status}</strong></p>
      <p>Canal: {pedido.canal}</p>

      <div className="itens-pedido">
        <AnimatePresence>
            {pedido.itens.map((item) => (
            <motion.div 
                key={item.uuid} 
                className="item-pedido"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="item-info">
                <strong>{item.cardapio.nome}</strong>
                {item.observacao && <p className="observacao">Obs: {item.observacao}</p>}
                </div>
                <div className="item-quantidade">
                <span>{item.quantidade} x R$ {Number(item.precoUnitario).toFixed(2).replace(".", ",")}</span>
                <span className="subtotal">
                    Total: R$ {(Number(item.precoUnitario) * Number(item.quantidade)).toFixed(2).replace(".", ",")}
                </span>
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <h3 className="total-geral">Total Geral: R$ {total.toFixed(2).replace(".", ",")}</h3>
    </div>
  );
}
