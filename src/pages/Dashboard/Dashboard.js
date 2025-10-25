import React, { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import * as Motion from "framer-motion";
import NavBar from "../../components/Menu/index copy";
import { api, baseURL } from "../../services/api";
import "./Dashboard.css";
import { io } from "socket.io-client";

export default function Dashboard() {
  const { motion } = Motion;
  const [pedidos, setPedidos] = useState([]);
  const [setores, setSetor] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await api.get("/pedido");
        setPedidos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchSetor() {
      try {
        const res = await api.get("/setor");
        setSetor(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPedidos();
    fetchSetor();
  }, []);
  useEffect(() => {
    
  }, []);

  
    socketRef.current = io(baseURL);
    socketRef.current.on("novoPedido", (pedido) => {
      // insere no topo se ainda não existir
      setPedidos((prev) => {
        const existe = prev.some((p) => p.id === pedido.id);
        if (!existe) {
        }
        if (prev.some((p) => String(p.id) === String(pedido.id))) return prev;
        return [...prev, pedido];
      });
    });
    socketRef.current.on("pedidoAtualizado", (pedidoAtualizado) => {
      console.log(pedidoAtualizado)
      setPedidos((prev) => {
        return prev.map(p => {
          if (p.id !== pedidoAtualizado.id) return p;

          return pedidoAtualizado;
        });
      });
    });

  // Processamento de dados
  const totalDiario = pedidos
  .filter(p => p.status !== "cancelado") // exclui cancelados
  .reduce((acc, p) => acc + Number(p.total), 0);
  //const totalDiario = pedidos.reduce((acc, p) => acc + Number(p.total), 0);
  const pedidosPendentes = pedidos.filter(p => p.status === "recebido" || p.status === "em_preparo").length;

  const totalPedidos = pedidos.filter(p => p.status !== "cancelado")

  const totalPorSetor = pedidos.reduce((acc, p) => {
    p.itens.forEach(item => {
      acc[item.setorId] = (acc[item.setorId] || 0) + item.quantidade;
    });
    return acc;
  }, {});

  
  const setorData = Object.entries(totalPorSetor).map(([setorId, total]) => {
    const setorInfo = setores.find(s => s.id === setorId);
    return {
      name: setorInfo ? setorInfo.nome : `Setor ${setorId}`,
      total
    }
  });

  const coresPie = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard-container">
      <NavBar />

      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>📊 Dashboard de Pedidos</h2>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            <div className="dashboard-indicadores">
              <div className="indicador">
                <h3>Total Diário</h3>
                <p>R$ {Number(totalDiario).toFixed(2).replace(".", ",")}</p>
              </div>
              <div className="indicador">
                <h3>Pedidos Pendentes</h3>
                <p>{pedidosPendentes}</p>
              </div>
              <div className="indicador">
                <h3>Total de Pedidos</h3>
                <p>{totalPedidos.length}</p>
              </div>
            </div>

            <div className="dashboard-graficos">
              <div className="grafico-bar">
                <h4>Itens por Setor</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={setorData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grafico-pie">
                <h4>Distribuição por Setor</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={setorData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {setorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={coresPie[index % coresPie.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
