import React, {useState} from 'react'

import * as GiIcons from 'react-icons/gi'
import * as AiIcons from 'react-icons/ai'
import * as RiIcons from 'react-icons/ri'
import * as BiIcons from 'react-icons/bi'

import './styles.css';

function NavBar(){
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar);    
    
    let iconStyles = { 
        color: "white", 
        fontSize: "30px",
        height: "50px",
        minWidth: "60px",
        textAlign: "center",
        lineHeight:"50px"
    };

    let iconMenuStyles = {
        height: "20px",
        minWidth: "78px",
    };
    let arrow = document.querySelectorAll(".arrow");
    console.log(arrow);
    for(var i = 0; i < arrow.leght;i++){
        arrow[i].addEventListener("click", (e)=>{
            let arrowParent = e.target.parentElement.parentElement;
            console.log(arrowParent);
            arrowParent.classList.toggle("showMenu");
        });
    }
    function onclick(){
        
    }
    return (
        <>  
            <div className="sidebar close">
                <div className="logo-details">
                    <GiIcons.GiArrowCluster style={iconStyles}/>
                    <span className="logo-name">Malcolm Desmonte</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <a href="#">
                            <i>
                                <AiIcons.AiFillHome style={iconMenuStyles}/>
                            </i>
                            <span className="link-name">Home</span>
                        </a>
                        <ul className="sub-menu blank">
                            <li><a className="link-name" href="#">Home</a></li>
                        </ul>
                    </li>
                    <li>
                        <div className="icon-link">
                            <a href="#">
                                <i>
                                    <AiIcons.AiFillHome style={iconMenuStyles}/>
                                </i>
                                <span className="link-name">Teste 2</span>
                            </a>
                            <i className="arrow">
                                <RiIcons.RiArrowDownSLine  style={iconMenuStyles}/>
                            </i>
                        </div>
                        <ul className="sub-menu">
                            <li><a className="link-name" href="#">Teste 2</a></li>
                            <li><a href="#">Teste 1</a></li>
                            <li><a href="#">Teste 2</a></li>
                            <li><a href="#">Teste 3</a></li>
                        </ul>
                    </li>
                    <li>
                        <div className="icon-link">
                            <a href="#">
                                <i>
                                    <AiIcons.AiFillHome style={iconMenuStyles}/>
                                </i>
                                <span className="link-name">Teste 2</span>
                            </a>
                            <i className="arrow">
                                <RiIcons.RiArrowDownSLine  style={iconMenuStyles}/>
                            </i>
                        </div>
                        <ul className="sub-menu">
                            <li><a className="link-name" href="#">Teste 2</a></li>
                            <li><a href="#">Teste 1</a></li>
                            <li><a href="#">Teste 2</a></li>
                            <li><a href="#">Teste 3</a></li>
                        </ul>
                    </li>
                    <li>
                        <div className="profile-details">
                            <div className="profile-content">
                                <img src="profile.jpg" alt="profile"/>
                            </div>
                            <div className="name-job">
                                <div className="profile-name">Alexandre Nunes</div>
                            </div>
                            <i>
                                <BiIcons.BiLogOut style={iconMenuStyles}/>
                            </i>
                        </div>
                    </li>
                </ul> 
            </div>

        </>
    )
}


export default NavBar;