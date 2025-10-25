import React, { useEffect, useRef, useState } from "react";
import { api, baseURL } from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, 
  Pie, Cell, Legend, LineChart, Line, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./teste.css";
import { io } from "socket.io-client";
import * as MdIcons from "react-icons/md"
import { href } from "react-router-dom";
import * as Motion from "framer-motion";
import NavBar from "../../components/Menu/index copy";

export default function Dashboard() {
    
    const { motion } = Motion;
    const [pedidos, setPedidos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [periodo, setPeriodo] = useState("hoje"); // filtro por período
    const [loading, setLoading] = useState(true);
    
    const socketRef = useRef(null);

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
        
        setPedidos((prev) => {
          return prev.map(p => {
            if (p.id !== pedidoAtualizado.id) return p;
  
            return pedidoAtualizado;
          });
        });
      });

  useEffect(() => {
    async function carregarDados() {
        try{
            const pedidosRes = await api.get("/pedido");
            setPedidos(pedidosRes.data);

            const setoresRes = await api.get("/setor");
            setSetores(setoresRes.data);
        } catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
      
    }
    carregarDados();
  }, []);

  // ---------- Filtrar pedidos pelo período ----------
  const pedidosFiltrados = pedidos.filter(p => {
    const dataPedido = new Date(p.criadoEm);
    const hoje = new Date();
    switch (periodo) {
      case "ultimas_12_horas":
        const dozeHorasAtras = new Date(hoje.getTime() - 12 * 60 * 60 * 1000);
        return dataPedido >= dozeHorasAtras && dataPedido <= hoje;
      case "hoje":
        return dataPedido.toDateString() === hoje.toDateString();
      case "ontem":
        const ontem = new Date();
        ontem.setDate(hoje.getDate() - 1);
        return dataPedido.toDateString() === ontem.toDateString();
      case "7dias":
        const semana = new Date();
        semana.setDate(hoje.getDate() - 7);
        return dataPedido >= semana;
      case "mes":
        return dataPedido.getMonth() === hoje.getMonth() && dataPedido.getFullYear() === hoje.getFullYear();
      default:
        return true;
    }
  });

  // ---------- Métricas principais ----------
  const totalPedidos = pedidosFiltrados.length;

  const totalDiario = pedidosFiltrados
  .filter(p => p.status !== "cancelado") // exclui cancelados
  .reduce((acc, p) => acc + Number(p.total), 0);

  const statusCount = pedidosFiltrados.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const totalCancelados = statusCount.cancelado || 0;

  const totalVendas = pedidosFiltrados
    .filter(p => p.status !== "cancelado")
    .reduce((acc, p) => acc + Number(p.total), 0);

  const ticketMedio = totalPedidos - totalCancelados > 0 ? totalVendas / (totalPedidos - totalCancelados) : 0;

  // ---------- Vendas por hora ----------
  const vendasPorHora = Array.from({ length: 24 }, (_, h) => {
    const total = pedidosFiltrados
      .filter(p => new Date(p.criadoEm).getHours() === h && p.status !== "cancelado")
      .reduce((acc, p) => acc + Number(p.total), 0);
    return { hora: `${h}:00`, total };
  });

  // ---------- Total de vendas por setor ----------
  const totalPorSetor = pedidosFiltrados.reduce((acc, p) => {
    p.itens.forEach(item => {
      acc[item.setorId] = (acc[item.setorId] || 0) + item.quantidade;
    });
    return acc;
  }, {});

  
  const setorData = Object.entries(totalPorSetor).map(([setorId, total]) => {
    const setorInfo = setores.find(s => Number(s.id) === Number(setorId));
    return {
      name: setorInfo ? setorInfo.nome : `Setor ${setorId}`,
      total
    };
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF"];

  // ---------- Itens mais populares por setor ----------
  const topItensPorSetor = setores.map(setor => {
    const itensSetor = pedidosFiltrados.flatMap(p =>
      p.itens.filter(i => i.setorId === setor.id)
    );

    const quantidadePorItem = itensSetor.reduce((acc, i) => {
    if (i.status !== "cancelado") {
        acc[i.cardapio.nome] = (acc[i.cardapio.nome] || 0) + i.quantidade;
    }
    return acc;
    }, {});

    const top5 = Object.entries(quantidadePorItem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome, qtd]) => ({ nome, qtd }));

    return { setor: setor.nome, top5 };
  });

  // ---------- Percentual de pedidos cancelados ----------
  const percCancelados = totalPedidos > 0 ? (totalCancelados / totalPedidos) * 100 : 0;

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
                
                    {/* Filtro de período */}
                    <div className="periodo-filtro">
                        <select value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            <option value="ultimas_12_horas">Ultimas 12 Horas</option>
                            <option value="hoje">Hoje</option>
                            <option value="ontem">Ontem</option>
                            <option value="7dias">Últimos 7 dias</option>
                            <option value="mes">Mês Atual</option>
                        </select>
                    </div>
                    {/* Cards resumidos */}
                    <div className="cards">
                        <div className="card">
                        <h3>Total de Pedidos</h3>
                        <p>{totalPedidos}</p>
                        </div>
                        <div className="card">
                        <h3>Valor vendido no periodo</h3>
                        <p>R$ {Number(totalDiario).toFixed(2).replace(".", ",")}</p>
                        </div>
                        <div className="card">
                        <h3>Pedidos Pendentes</h3>
                        <p>{statusCount.recebido || 0}</p>
                        </div>
                        <div className="card">
                        <h3>Pedidos em Preparo</h3>
                        <p>{statusCount.em_preparo || 0}</p>
                        </div>
                        <div className="card">
                        <h3>Pedidos Prontos</h3>
                        <p>{statusCount.pronto || 0}</p>
                        </div>
                        <div className="card">
                        <h3>Pedidos Entregues</h3>
                        <p>{statusCount.entregue || 0}</p>
                        </div>
                        <div className="card">
                        <h3>Pedidos Cancelados</h3>
                        <p>{totalCancelados}</p>
                        </div>
                        <div className="card">
                        <h3>Ticket Médio</h3>
                        <p>R$ {ticketMedio.toFixed(2)}</p>
                        </div>
                        <div className="card">
                        <h3>% Cancelados</h3>
                        <p>{percCancelados.toFixed(1)}%</p>
                        </div>
                    </div>
                    {/* Gráficos */}
                    <div className="charts">
                        <div className="chart-container">
                            <h3>Vendas por Hora</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={vendasPorHora}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hora" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        
                        </div>

                        <div className="chart-container">
                            <h3>Total de itens por setor</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={setorData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-container">
                        <h3>Top 5 Itens por Setor</h3>
                        {topItensPorSetor.map(setor => (
                            <div key={setor.setor}>
                            <h4>{setor.setor}</h4>
                            <ul>
                                {setor.top5.map(item => (
                                <li key={item.nome}>{item.nome} - {item.qtd}</li>
                                ))}
                            </ul>
                            </div>
                        ))}
                        </div>
                    </div>
                    {/* Tabela dos últimos pedidos */}
                    <div className="ultimos-pedidos">
                        <h3>Últimos Pedidos</h3>
                        <table>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Valor</th>
                            <th>Hora</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados
                            .sort((a,b) => new Date(b.criadoEm) - new Date(a.criadoEm))
                            .slice(0, 10)
                            .map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.status === "em_preparo" ? "em preparo" : p.status}</td>
                                <td>R$ {Number(p.total).toFixed(2)}</td>
                                <td>{new Date(p.criadoEm).toLocaleTimeString()}</td>
                                <td>
                                    <div
                                        style={{ cursor: "pointer" }} // opcional, deixa parecer clicável
                                        onClick={() => window.location.href = `/pedido/${p.id}`} // chama o modal
                                    > 
                                        <MdIcons.MdArrowOutward />
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </>
            )}

        </motion.div>      
    </div>
  );
}
