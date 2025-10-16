import React, { useState, useEffect } from "react";

import api from '../../services/api'

function SelecionarIngredientes({ item, onChange }) {
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState(
    item?.ingredientes?.map(i => i.id) || []
  );

  // Buscar ingredientes da API
  useEffect(() => {
    findIngredientes();
  }, []);

  async function findIngredientes() {
        const ingredientes = await api.get("/ingrediente");
        setIngredientesDisponiveis(ingredientes.data)
    }
  // Atualiza quando o usuário seleciona/desseleciona
  const toggleIngrediente = (id) => {
    let novosSelecionados;
    if (ingredientesSelecionados.includes(id)) {
      novosSelecionados = ingredientesSelecionados.filter(i => i !== id);
    } else {
      novosSelecionados = [...ingredientesSelecionados, id];
    }
    setIngredientesSelecionados(novosSelecionados);
    onChange?.(novosSelecionados); // avisa o componente pai
  };

  return (
    <div>
      <div className="FuxyEf">Ingredientes:</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {ingredientesDisponiveis.map(ingrediente => (
          <button
            type="button"
            key={ingrediente.id}
            onClick={() => toggleIngrediente(ingrediente.id)}
            style={{
              padding: "6px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: ingredientesSelecionados.includes(ingrediente.id) ? "#4caf50" : "#fff",
              color: ingredientesSelecionados.includes(ingrediente.id) ? "#fff" : "#000",
              cursor: "pointer"
            }}
          >
            {ingrediente.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelecionarIngredientes;
