import React, {useState} from 'react'

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'

import SubMenu from './SubMenu'
import {SidebarData} from './SideBarData'

import {IconContext} from 'react-icons'
import { Nav, NavIcon, SidebarNav, SidebarWrap } from './styles'

function NavBar(){
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)
    
    return (
        <>
            <IconContext.Provider value={{color: '#fff'}}>
                <Nav>
                    <NavIcon to="#">
                        <FaIcons.FaBars onClick={showSidebar}/>
                    </NavIcon>
                </Nav>
                <SidebarNav sidebar={sidebar}>
                    <SidebarWrap>
                        <NavIcon to="#">
                            <AiIcons.AiOutlineClose onClick={showSidebar}/>
                        </NavIcon>
                        {SidebarData.map((item, index) => {
                            return<SubMenu item={item} key={index}/>;
                        })}
                    </SidebarWrap>
                </SidebarNav>
            </IconContext.Provider>
        </>
    )
}

export default NavBar;