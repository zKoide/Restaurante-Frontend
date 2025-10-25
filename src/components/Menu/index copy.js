import React, {useState, useEffect, useContext} from 'react'

import * as GiIcons from 'react-icons/gi'
import * as FaIcons from 'react-icons/fa'
import * as BiIcons from 'react-icons/bi'
import * as AiIcons from 'react-icons/ai'
import {api} from '../../services/api';
import { logout } from "../../services/auth";


import userImg from "../../assets/user-png.png";




import {SidebarData} from './SideBarData'

import './styles.css';
import SubMenu from './SubMenu'
import { CgOverflow } from 'react-icons/cg'



function NavBar(){

    const [User, setUser] = useState("");

    useEffect(() => {
        id()
      },[]);

    const [closed, setClosed] = useState(true)
    
    const showClosed = () => setClosed(!closed)   

    async function id(){
        await api.post("/userinf")
        .then(function (response) {
            setUser(response.data)
        })
        .catch(function (error) {
            if (error.response && error.response.status === 401) {
            console.warn("Token expirado ou inválido. Fazendo logout...");
            logout();
            window.location.href = "/"; // volta para tela de login
            } else {
            console.error("Erro ao buscar informações do usuário:", error);
            }
        });
      }
    
    let iconMenuStyles = {
        height: "30px",
        minWidth: "78px",
        textAlign: "center",
        lineHeight:"50px"
    };

    return (
        <>  
        
            <div className={closed ? ' sidebar close' : 'sidebar'}>
                <div className="logo-details">
                    <i>
                        {   closed ? 
                            <FaIcons.FaBars style={iconMenuStyles}  onClick={showClosed}/> :
                            <AiIcons.AiOutlineClose style={iconMenuStyles} onClick={showClosed}/> 
                        }
                        {/*<GiIcons.GiArrowCluster style={iconMenuStyles}/>*/}
                    </i>
                    {/*/<span className="logo-name">Minimizar</span>*/}
                </div>
                <ul className="nav-links">
                    {SidebarData.map((item, index) => {
                        return<SubMenu item={item} key={index} closed={closed}/>
                    })}
                    <li>
                        <div className="profile-details">
                            <div className="profile-content">
                                <img src={userImg} alt="profile"/>
                            </div>
                            <div className="name-job">
                                <div className="profile-name">{User.nome}</div>
                            </div>
                            <i className="bx bx-log-out" >
                                <BiIcons.BiLogOut style={iconMenuStyles} 
                                    onClick={()=>{
                                        logout();
                                        document.location.href = "./";
                                    }}
                                />
                            </i>
                            <ul className="sub-menu">
                                <li><a className="link-name">Perfil</a></li>
                                <li>
                                    <a key={158}>
                                        Configuração
                                    </a>
                                </li>
                                <li>
                                    <a key={159} 
                                    onClick={()=>{
                                        logout();
                                        document.location.href = "./";
                                    }}>
                                        Sair
                                    </a>
                                </li>
                        </ul> 
                        </div>
                          
                    </li>
                </ul> 
            </div>
        </>
    )
}


export default NavBar;