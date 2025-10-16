import React from 'react'

import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as Io5Icons from 'react-icons/io5'
import * as RiIcons from 'react-icons/ri'
import * as CgIcons from "react-icons/cg"
import * as FaIcons from 'react-icons/fa'
import * as GrIcons from 'react-icons/gr'

let iconMenuStyles = {
    height: "20px",
    minWidth: "78px",
};

export const SidebarData = [
    {
        title:'Home',
        path:'/Home',
        icon: <AiIcons.AiFillHome style={iconMenuStyles}/>,
        cName: 'nav-text'
    },
    {
        title:'Ingredientes',
        path:'#',
        icon:<Io5Icons.IoPerson style={iconMenuStyles}/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine style={iconMenuStyles}/>,
        iconOpened:<RiIcons.RiArrowUpSLine style={iconMenuStyles}/>,
        subNav: [
            {
                title:'Listar Ingredientes',
                path:'/Ingredientes',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Ingrediente',
                path: '#',
                action: 'openIngredienteModal',
                icon: <CgIcons.CgAdd/>
            }
        ]
    },
    {
        title:'Setor',
        path:'#',
        icon:<Io5Icons.IoPerson style={iconMenuStyles}/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine style={iconMenuStyles}/>,
        iconOpened:<RiIcons.RiArrowUpSLine style={iconMenuStyles}/>,
        subNav: [
            {
                title:'Listar Setores',
                path:'/Setores',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Setor',
                path: '#',
                action: 'openSetorModal',
                icon: <CgIcons.CgAdd/>
            }
        ]
    },
    {
        title:'Cardapio',
        path:'#',
        icon:<Io5Icons.IoPerson style={iconMenuStyles}/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine style={iconMenuStyles}/>,
        iconOpened:<RiIcons.RiArrowUpSLine style={iconMenuStyles}/>,
        subNav: [
            {
                title:'Listar Cardapio',
                path:'/Cardapio',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Cardapio',
                path: '#',
                action: 'openSetorModal',
                icon: <CgIcons.CgAdd/>
            }
        ]
    },
    {
        title:'Agendamentos',
        path:'/Agendamentos',
        icon: <AiIcons.AiFillSchedule style={iconMenuStyles}/>,
        cName: 'nav-text'
    },
    {
        title:'Vendas',
        path:'#',
        icon:<RiIcons.RiMoneyDollarCircleFill style={iconMenuStyles}/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine style={iconMenuStyles}/>,
        iconOpened:<RiIcons.RiArrowUpSLine style={iconMenuStyles}/>,
        subNav: [
            {
                title:'Listar Vendas',
                path:'/Vendas',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Vendas',
                path:'/Vendas_Forms',
                icon: <CgIcons.CgAdd/>
            }
        ]
    },
    {
        title:'Configuração',
        path:'#',
        icon:<IoIcons.IoMdSettings style={iconMenuStyles}/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine style={iconMenuStyles}/>,
        iconOpened:<RiIcons.RiArrowUpSLine style={iconMenuStyles}/>,
        subNav: [
            {
                title:'Usuários',
                path:'#',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Relatórios',
                path:'#',
                icon: <AiIcons.AiFillFileWord/>,
            },
        ]
    }
    
]