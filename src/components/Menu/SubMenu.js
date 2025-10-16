import React, {useContext, useState} from 'react'
import { UBSContext } from '../../contexts/UBSContexts';


function SubMenu({item, closed}){
    
    const [subnav, setSubnav] = useState(false)

    const {
        isIngredienteModalOpen,
        openIngredienteModal,
        openSetorModal,
      } = useContext(UBSContext);

    const showSubnav = () => setSubnav(!subnav)

    const handleClick = (item) => {
    if(item.action === 'openIngredienteModal') {
      openIngredienteModal();
    }
    if(item.action === 'openSetorModal'){
        openSetorModal()
    }
    else if(item.path) {
      document.location.href = item.path;
    }
  }


    return (
        <>
            <li className={subnav? "showMenu" : ""}>
                <div  className="icon-link" onClick={item.subNav && showSubnav} >
                    <a href={item.path}>
                        <i>
                            {item.icon}
                        </i>
                        <span className="link-name">{item.title}</span>
                    </a>
                    <i className="arrow">
                        {item.subNav && subnav
                        ? item.iconOpened 
                        : item.subNav 
                        ? item.iconClosed 
                        : null}
                    </i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link-name" href={item.path}>{item.title}</a></li>
                    {item.subNav && item.subNav.map((item, index) => {
                        return(
                            <li>
                                <a 
                                href={item.path || '#'} // fallback
                                onClick={(e) => {
                                e.preventDefault(); // evita navegação padrão
                                handleClick(item);
                                }} key={index}>
                                    {item.title}
                                </a>
                            </li>
                        )
                    })}
                </ul>             
            </li>
            
            
        </>
    )
}

export default SubMenu;