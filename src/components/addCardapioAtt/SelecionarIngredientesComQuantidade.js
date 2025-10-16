import React, { useState, useEffect } from "react";
import api from '../../services/api'

function SelecionarIngredientesComQuantidade({ item, onChange }) {
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState(
    item?.ingredientes?.map(i => ({ id: i.id, quantidade: i.quantidade || 1 })) || []
  );

  // Buscar ingredientes da API
  useEffect(() => {
    findIngredientes();
  }, []);

  async function findIngredientes() {
        const ingredientes = await api.get("/ingrediente");
        setIngredientesDisponiveis(ingredientes.data)
    }
  // Função para selecionar/desselecionar ingrediente
  const toggleIngrediente = (id) => {
    const existe = ingredientesSelecionados.find(i => i.id === id);
    let novosSelecionados;

    if (existe) {
      // Remove
      novosSelecionados = ingredientesSelecionados.filter(i => i.id !== id);
    } else {
      // Adiciona com quantidade padrão 1
      novosSelecionados = [...ingredientesSelecionados, { id, quantidade: 1 }];
    }

    setIngredientesSelecionados(novosSelecionados);
    onChange?.(novosSelecionados);
  };

  // Função para atualizar quantidade
  const alterarQuantidade = (id, quantidade) => {
    const novosSelecionados = ingredientesSelecionados.map(i =>
      i.id === id ? { ...i, quantidade: quantidade > 0 ? quantidade : 1 } : i
    );
    setIngredientesSelecionados(novosSelecionados);
    onChange?.(novosSelecionados);
  };

  return (
    <div>
      <label>Ingredientes</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {ingredientesDisponiveis.map(ingrediente => {
          const selecionado = ingredientesSelecionados.find(i => i.id === ingrediente.id);
          return (
            <div key={ingrediente.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={!!selecionado}
                onChange={() => toggleIngrediente(ingrediente.id)}
              />
              <span>{ingrediente.nome}</span>
              {selecionado && (
                <input
                  type="number"
                  min="1"
                  value={selecionado.quantidade}
                  onChange={(e) => alterarQuantidade(ingrediente.id, parseInt(e.target.value, 10))}
                  style={{ width: "60px" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SelecionarIngredientesComQuantidade;
