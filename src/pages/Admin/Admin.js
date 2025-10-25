import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./Admin.css";

export default function Admin() {
  // ===== RESTAURANTE =====
  const [restaurantes, setRestaurantes] = useState([]);
  const [nomeRestaurante, setNomeRestaurante] = useState("");
  const [documento, setDocumento] = useState("");
  const [emailRest, setEmailRest] = useState("");
  const [telefone, setTelefone] = useState("");
  const [restMsg, setRestMsg] = useState("");

  // ===== USUÁRIO =====
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [roleId, setRoleId] = useState("");
  const [restauranteId, setRestauranteId] = useState("");
  const [roles, setRoles] = useState([]);
  const [userMsg, setUserMsg] = useState("");

  // Buscar dados iniciais
  useEffect(() => {
    async function fetchData() {
      try {
        const [resRest] = await Promise.all([
          api.get("/restaurante"),
        ]);
        setRestaurantes(resRest.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchData();
  }, []);

  // Criar restaurante
  async function criarRestaurante(e) {
    e.preventDefault();
    try {
      const res = await api.post("/restaurante", {
        nome: nomeRestaurante,
        documento,
        email: emailRest,
        telefone,
      });
      setRestMsg(`Restaurante "${res.data.nome}" criado com sucesso!`);
      setNomeRestaurante("");
      setDocumento("");
      setEmailRest("");
      setTelefone("");
      setRestaurantes([...restaurantes, res.data]);
    } catch (err) {
      console.error(err);
      setRestMsg("Erro ao criar restaurante.");
    }
  }

  // Criar usuário
  async function criarUsuario(e) {
    e.preventDefault();
    try {
      const res = await api.post("/register", {
        nome: nomeUsuario,
        email: emailUsuario,
        senha,
        restauranteId: Number(restauranteId),
      });
      setUserMsg(`Usuário "${res.data.nome}" criado com sucesso!`);
      setNomeUsuario("");
      setEmailUsuario("");
      setSenha("");
      setRestauranteId("");
      setRoleId("");
    } catch (err) {
      console.error(err);
      setUserMsg("Erro ao criar usuário.");
    }
  }

  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>

      {/* ======= RESTAURANTE ======= */}
      <div className="card">
        <h3>Criar Novo Restaurante</h3>
        {restMsg && <p className="feedback">{restMsg}</p>}
        <form onSubmit={criarRestaurante}>
          <input
            type="text"
            placeholder="Nome do Restaurante"
            value={nomeRestaurante}
            onChange={(e) => setNomeRestaurante(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Documento (CNPJ ou CPF)"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={emailRest}
            onChange={(e) => setEmailRest(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <button type="submit">Criar Restaurante</button>
        </form>
      </div>

      {/* ======= USUÁRIO ======= */}
      <div className="card">
        <h3>Criar Novo Usuário</h3>
        {userMsg && <p className="feedback">{userMsg}</p>}
        <form onSubmit={criarUsuario}>
          <input
            type="text"
            placeholder="Nome do Usuário"
            value={nomeUsuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={emailUsuario}
            onChange={(e) => setEmailUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <select
            value={restauranteId}
            onChange={(e) => setRestauranteId(e.target.value)}
            required
          >
            <option value="">Selecione o Restaurante</option>
            {restaurantes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>

          <button type="submit">Criar Usuário</button>
        </form>
      </div>
    </div>
  );
}
