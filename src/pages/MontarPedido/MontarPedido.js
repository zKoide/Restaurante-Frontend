import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from '../../components/Menu/index copy';
import "./MontarPedido.css"; // arquivo CSS simples para layout
import api from "../../services/api";

export default function MontarPedido() {
  const [cardapio, setCardapio] = useState([]);
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("carrinho");
    return salvo ? JSON.parse(salvo) : [];
  });

  // Busca o cardápio
  useEffect(() => {
    async function carregarCardapio() {
      try {
        const res = await api.get("http://localhost:3333/cardapio"); // ajuste conforme sua rota
        setCardapio(res.data);
      } catch (err) {
        console.error("Erro ao buscar cardápio:", err);
      }
    }
    carregarCardapio();
  }, []);

  // Salva o carrinho no navegador
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prev) => {
      const existente = prev.find((i) => i.id === item.id);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) => prev.filter((i) => i.id !== id));
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div className="montarPedido-container">
      <NavBar/>

      <div className="montarPedido-content">
        <h2>Monte seu Pedido 🍽️</h2>

        {/* Lista do cardápio */}
        <div className="lista-cardapio">
          {cardapio.map((item) => (
            <div key={item.id} className="card-item">
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
              <button
                onClick={() =>
                  adicionarAoCarrinho({
                    id: item.id,
                    nome: item.nome,
                    preco: Number(item.preco),
                  })
                }
              >
                Adicionar +
              </button>
            </div>
          ))}
        </div>

        {/* Carrinho */}
        {carrinho.length > 0 && (
          <div className="carrinho">
            <h3>🛒 Seu Carrinho</h3>
            {carrinho.map((item) => (
              <div key={item.id} className="item-carrinho">
                <div>
                  <strong>{item.nome}</strong> x{item.quantidade}
                </div>
                <div>
                  <span>
                    R$ {(item.preco * item.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                  <button onClick={() => removerDoCarrinho(item.id)}>
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
              onClick={() =>
                alert("Página de finalização do pedido em breve 🍕")
              }
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
