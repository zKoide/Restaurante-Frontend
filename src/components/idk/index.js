import React from 'react';
import './Style.css'

import * as IoIcons from 'react-icons/io'
import * as BsIcons from "react-icons/bs"
import * as Io5Icons from "react-icons/io5"
import { Row, Linha } from "./styles";
import { UBSContext } from '../../contexts/UBSContexts';


function AddAndListMenu(props) {

    return(
        <div class="container">
            <tbody>
                <tr>
                    <td>
                        <Row onClick={()=>{document.location.href = props.opcoes? props.opcoes.voltar : "#"}}>
                        <Io5Icons.IoArrowBackCircleOutline id="svg"/>
                        <h1 style={{alignSelf:"center"}}>Voltar</h1>
                        </Row>
                    </td>
                    <td>
                        <Row onClick={()=>{
                            document.location.href = props.opcoes ? props.opcoes.lista : "#"}}>
                        <BsIcons.BsList id="svg"/>
                        <h1 style={{alignSelf:"center"}}>Listagem</h1>
                        </Row>
                    </td>
                    
                    <td>
                        <Row onClick={()=>{
                            if (typeof props.opcoes?.add === "function") {
                                props.opcoes.add();
                            }else if (typeof props.opcoes?.add === "string") {
                                document.location.href = props.opcoes ? props.opcoes.lista : "#"
                            }
                        }}>
                        <IoIcons.IoIosAddCircleOutline id="svg"/>
                        <h1 style={{alignSelf:"center"}}>Novo</h1 >
                        </Row>
                    </td>
                </tr>
            </tbody>
        </div>
    );
}

export default AddAndListMenu;