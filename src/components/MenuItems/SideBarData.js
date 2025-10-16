import React from 'react'

import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as Io5Icons from 'react-icons/io5'
import * as RiIcons from 'react-icons/ri'
import * as CgIcons from "react-icons/cg"
import * as FaIcons from 'react-icons/fa'


export const SidebarData = [
    
    {
        title:'Home',
        path:'/Home',
        cName: 'nav-text'
    },
    {
        title:'Ingredientes',
        path:'#',
        icon:<Io5Icons.IoPerson/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine/>,
        iconOpened:<RiIcons.RiArrowUpSLine/>,
        subNav: [
            {
                title:'Listar Ingredientes',
                path:'/Clientes',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Ingrediente',
                path:'/Clientes_Forms',
                icon: <CgIcons.CgAdd/>
            }
        ]
    },
    {
        title:'Vendas',
        path:'#',
        icon:<RiIcons.RiMoneyDollarCircleFill/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine/>,
        iconOpened:<RiIcons.RiArrowUpSLine/>,
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
        title:'Orçamentos',
        path:'#',
        icon:<IoIcons.IoIosPaper/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine/>,
        iconOpened:<RiIcons.RiArrowUpSLine/>,
        subNav: [
            {
                title:'Listar Orçamentos',
                path:'/Orcamentos',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Orçamento',
                path:'/Orcamentos_Forms',
                icon: <CgIcons.CgAdd/>
            }
        ]
    },
    {
        title:'Etiquetas',
        path:'#',
        icon:<AiIcons.AiFillTag/>,
        cName: 'nav-text',
        iconClosed:<RiIcons.RiArrowDownSLine/>,
        iconOpened:<RiIcons.RiArrowUpSLine/>,
        subNav: [
            {
                title:'Listar Etiquetas',
                path:'/ListarEtiqueta',
                icon: <FaIcons.FaBars/>,
            },
            {
                title:'Adicionar Etiqueta',
                path:'/AddEtiqueta',
                icon: <CgIcons.CgAdd/>
            },
            {
                title:'Etiquetas P/ Foto',
                path:'/FotoEtiqueta',
                icon: <AiIcons.AiOutlineCamera/>
            },
            {
                title:'Etiquetas P/ Colar',
                path:'/ColarEtiqueta',
                icon: <CgIcons.CgAdd/>
            },
            {
                title:'Etiquetas P/ Guardar',
                path:'/GuardarEtiqueta',
                icon: <FaIcons.FaWarehouse/>
            }
        ]
    },
]