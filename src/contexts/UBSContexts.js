import React, {createContext, useContext, useState} from 'react';

import Ingrediente from '../components/addIngrediente'

import Setor from '../components/addSetor'

import Cardapio from '../components/addCardapio'

import { logout } from "../services/auth";

export const UBSContext = createContext();


export default function UBSProvider({ children }){
    
    const [data, setdata] = useState('');

    const [isIngredienteModalOpen, setIsIngredienteModalOpen] = useState(false);

    function openIngredienteModal(id) {
        setdata(id)
        setIsIngredienteModalOpen(true);
    }

    function closeIngredienteModal(){
        setIsIngredienteModalOpen(false);
    }

    const [isSetorModalOpen, setIsSetorModalOpen] = useState(false);

    function openSetorModal(id) {
        setdata(id)
        setIsSetorModalOpen(true);
    }

    function closeSetorModal(){
        setIsSetorModalOpen(false);
    }

    const [isCardapioModalOpen, setIsCardapioModalOpen] = useState(false);

    function openCardapioModal(id) {
        setdata(id)
        setIsCardapioModalOpen(true);
    }

    function closeCardapioModal(){
        setIsCardapioModalOpen(false);
    }
    
    function eraseToken(){
        logout();
    }

    return(
        
        <UBSContext.Provider value={{
            isIngredienteModalOpen,
            openIngredienteModal,
            closeIngredienteModal,
            isSetorModalOpen,
            openSetorModal,
            closeSetorModal,
            isCardapioModalOpen,
            openCardapioModal,
            closeCardapioModal,
            setdata,
            eraseToken,
        }}>
            {children}  

            {isIngredienteModalOpen && <Ingrediente id={data}/>}
            {isSetorModalOpen && <Setor id={data}/>}
            {isCardapioModalOpen && <Cardapio id={data}/>}
        </UBSContext.Provider>
    );
}
export function useUBS(){
    const context = useContext(UBSContext);
    const {
        eraseToken
    } = context;
    return { eraseToken };
}