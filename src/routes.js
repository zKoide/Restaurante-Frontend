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

import Vendas from "./pages/Vendas/Vendas"
import Login from "./pages/Login/Login"
import VendasForms from "./pages/VendasForms/VendasForms"
import Orcamentos from "./pages/Orcamentos/Orcamentos"
import OrcamentosForms from "./pages/OrcamentosForms/OrcamentosForms"
import Test from './pages/Test/Test';
import Agendamentos from './pages/Agendamentos/Agendamentos';

const Rota = () => (
        <Routes> 
            <Route path="/test" element={<Test/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Ingredientes" element={<Ingredientes/>}/>
            <Route path="/Setores" element={<Setores/>}/>
            <Route path="/Cardapio" element={<Cardapio/>}/>
            <Route path="/MontarPedido" element={<MontarPedidos/>}/>
            <Route path="/Produção/:setorId" element={<Producao/>}/>
            <Route path="/Pedidos" element={<Pedidos/>}/>

            <Route path="/Agendamentos" element={<Agendamentos/>}/>
            <Route path="/Vendas" element={ <Vendas/> }/>
            <Route path="/Vendas_Forms" element={ <VendasForms/> }/>
            <Route path="/Orcamentos" element={ <Orcamentos/> }/>
            <Route path="/Orcamentos_Forms" element={ <OrcamentosForms/> }/>
        </Routes>
);

export default Rota; 