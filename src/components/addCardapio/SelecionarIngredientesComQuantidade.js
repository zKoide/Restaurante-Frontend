import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import "./SelecionarIngredientesComQuantidade.css";

function SelecionarIngredientesComQuantidade({ item, onChange }) {
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState(
    item?.ingredientes?.map(i => ({ id: i.id, nome: i.nome, quantidade: i.quantidade || 1 })) || []
  );
  const [busca, setBusca] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);
  const formatados = ""
  const inicializado = useRef(false);

  const formatarParaSelecionados = (itens) => {
        console.log(itens)
        return itens
        .filter(i => i && (i.ingrediente || i.nome))
        .map(i => ({
          id: i.ingredienteId,
          quantidade: Number(i.quantidade),
          nome:  i.nome || i.ingrediente.nome 
        }));
      };
  useEffect(() => {
    console.log("teste")
    if (!inicializado.current && item && item.length > 0) {
    const formatados = item
      .filter(i => i && (i.ingrediente || i.nome))
      .map(i => ({
        id: i.ingredienteId || i.id || i.ingrediente?.id,
        quantidade: Number(i.quantidade) || 1,
        nome: i.ingrediente?.nome || i.nome || ""
      }));

    setIngredientesSelecionados(formatados);
    inicializado.current = true; // marca que já inicializou
  }
    /*const formatados = item
      .filter(i => i && (i.ingrediente || i.nome)) // só itens válidos
      .map(i => ({
        id: i.ingredienteId || i.id || i.ingrediente?.id,
        quantidade: Number(i.quantidade) || 1,
        nome: i.ingrediente?.nome || i.nome || ""
      }));
    
    setIngredientesSelecionados(formatados);
    /*if (item && item.length > 0) {
      setIngredientesSelecionados(formatarParaSelecionados(item));
    }
    /*if (item && JSON.stringify(item) !== JSON.stringify(ingredientesSelecionados)) {
      console.log(ingredientesSelecionados)
      if(formatados == ""){
        console.log("esta no if")
        const formatados = formatarParaSelecionados(item)
        setIngredientesSelecionados(formatados);
      }
      item = ingredientesSelecionados
      
    }*/
  }, [item]);
    // Buscar ingredientes da API
  useEffect(() => {
    async function fetchIngredientes() {
      try {
        const response = await api.get("/ingrediente");
        setIngredientesDisponiveis(response.data);
      } catch (error) {
        console.error("Erro ao buscar ingredientes:", error);
      }
    }
    fetchIngredientes();
  }, []);

  // Atualiza o pai
  useEffect(() => {
    onChange?.(ingredientesSelecionados);
  }, [ingredientesSelecionados]);

  const filtrarIngredientes = ingredientesDisponiveis.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const adicionarIngrediente = (ingrediente) => {
    if (!ingredientesSelecionados.find(i => i.id === ingrediente.id)) {
      setIngredientesSelecionados([...ingredientesSelecionados, { ...ingrediente, quantidade: 1 }]);
      setBusca("");
      setMostrarLista(false);
    }
  };

  const alterarQuantidade = (id, quantidade) => {
    setIngredientesSelecionados(prev =>
      prev.map(i => (i.id === id ? { ...i, quantidade: quantidade > 0 ? quantidade : 1 } : i))
    );
  };

  const removerIngrediente = (id) => {
    setIngredientesSelecionados(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="ingrediente-wrapper">
      <label className="ingrediente-label">Ingredientes:</label>

      <div className="busca-container">
        <input
          type="text"
          value={busca}
          placeholder="Buscar ingrediente..."
          onFocus={() => setMostrarLista(true)}
          onChange={(e) => setBusca(e.target.value)}
          className="busca-input"
        />

        {mostrarLista && busca && (
          <ul className="ingrediente-lista">
            {filtrarIngredientes.length > 0 ? (
              filtrarIngredientes.map(ingrediente => (
                <li
                  key={ingrediente.id}
                  onClick={() => adicionarIngrediente(ingrediente)}
                  className="ingrediente-item"
                >
                  {ingrediente.nome}
                </li>
              ))
            ) : (
              <li className="ingrediente-vazio">Nenhum encontrado</li>
            )}
          </ul>
        )}
      </div>

      <div className="ingredientes-selecionados">
        {ingredientesSelecionados.map(i => (
          <div key={i.id} className="ingrediente-selecionado">
            <span className="ingrediente-nome">{i.nome}</span>
            <input
              type="number"
              min="1"
              value={i.quantidade}
              onChange={(e) => alterarQuantidade(i.id, parseInt(e.target.value))}
              className="ingrediente-qtd"
            />
            <button
              type="button"
              onClick={() => removerIngrediente(i.id)}
              className="ingrediente-remover"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelecionarIngredientesComQuantidade;
