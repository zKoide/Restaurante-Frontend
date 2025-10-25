import React from 'react'

import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as Io5Icons from 'react-icons/io5'
import * as RiIcons from 'react-icons/ri'
import * as CgIcons from "react-icons/cg"
import * as FaIcons from 'react-icons/fa'
import * as GrIcons from 'react-icons/gr'
import * as TbIcons from "react-icons/tb";

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
        title:'Montar Pedido',
        path:'/MontarPedido',
        icon: <FaIcons.FaShoppingCart style={iconMenuStyles}/>,
        cName: 'nav-text'
    },
    {
        title:'Ingredientes',
        path:'/Ingredientes',
        icon: <FaIcons.FaCarrot style={iconMenuStyles}/>,
        cName: 'nav-text'
    },
    {
        title:'Cardapio',
        path:'/Cardapio',
        icon: <FaIcons.FaBookOpen style={iconMenuStyles}/>,
        cName: 'nav-text'
    },
    {
        title:'Setor',
        path:'/Setores',
        icon: <FaIcons.FaThLarge style={iconMenuStyles}/>,
        cName: 'nav-text'
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