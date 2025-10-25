import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Home from "./pages/Home/Home"
import Ingredientes from "./pages/Ingredientes/Ingredientes"
import Setores from './pages/Setor/setor';
import Cardapio from './pages/Cardapio/cardapio'
import MontarPedidos from './pages/MontarPedido/teste'
import Producao from './pages/Produção/index'
import Pedidos from './pages/Pedidos/Pedidos'

import Login from "./pages/Login/Login"
import DetalhesPedido from './pages/DetalhesPedido/DetalhesPedido';
import Dashboard from './pages/Dashboard/teste';
import Admin from './pages/Admin/Admin';

const Rota = () => (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/Home" element={<Dashboard />}/>
            <Route path="/Ingredientes" element={<Ingredientes/>}/>
            <Route path="/Setores" element={<Setores/>}/>
            <Route path="/Cardapio" element={<Cardapio/>}/>
            <Route path="/MontarPedido" element={<MontarPedidos/>}/>
            <Route path="/Produção/:setorId" element={<Producao/>}/>
            <Route path="/Pedidos" element={<Pedidos/>}/>
            <Route path="/pedido/:id" element={<DetalhesPedido/>} />
            <Route path="/add" element={<Admin/>} />
        </Routes>
);

export default Rota; 