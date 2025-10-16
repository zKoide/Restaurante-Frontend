import React, {useContext, useState} from 'react'

import { SidebarLink, SidebarLabel, DropdownLink } from './styles'
import { UBSContext } from '../../contexts/UBSContexts';

function SubMenu({item}){
    
    const {
        openIngredienteModal,
    } = useContext(UBSContext);
    const [subnav, setSubnav] = useState(false)

    const showSubnav = () => setSubnav(!subnav)

    return (
        <>
            <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
                <div>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div>
                    {item.subNav && subnav
                     ? item.iconOpened 
                     : item.subNav 
                     ? item.iconClosed 
                     : null}
                </div>
            </SidebarLink>
            {subnav && item.subNav.map((item, index) => {
                return(
                    <DropdownLink
                        /*{...item.path === "function" ? onclick={item.path} : to={item.path}}*/
                        //to={item.path}
                        key={index}>
                        {item.icon}
                        <SidebarLabel>{item.title}</SidebarLabel>
                    </DropdownLink>
                )
            })}

        </>
    )
}

export default SubMenu;

/*import React, { useContext, useState } from 'react'
import { SidebarLink, SidebarLabel, DropdownLink } from './styles'
import { UBSContext } from '../../contexts/UBSContexts';



function SubMenu({ item }) {

const {
    isIngredienteModalOpen,
    openIngredienteModal,
} = useContext(UBSContext);
  const [subnav, setSubnav] = useState(false)

  const showSubnav = () => setSubnav(!subnav)

  // Função auxiliar: decidir o que fazer ao clicar
  const handleClick = (option) => {
    if (typeof option.path === 'function') {
      openIngredienteModal() // executa a função
    } else if (typeof option.path === 'string') {
      // aqui deixamos a navegação por conta do <SidebarLink>
      return
    }

    if (option.subNav) {
      showSubnav()
    }
  }

  return (
    <>
      <SidebarLink
        to={typeof item.path === 'string' ? item.path : '#'}
        onClick={() => handleClick(item)}
      >
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>

      {subnav &&
        item.subNav?.map((subItem, index) => (
          <DropdownLink
            to={typeof subItem.path === 'string' ? subItem.path : '#'}
            onClick={() => handleClick(subItem)}
            key={index}
          >
            {subItem.icon}
            <SidebarLabel>{subItem.title}</SidebarLabel>
          </DropdownLink>
        ))}
    </>
  )
}

export default SubMenu;
*/