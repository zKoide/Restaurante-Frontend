import React, {useState, useEffect} from 'react';

import { Form, Container } from "./styles";

function DevForm({ OnSubmit }){
  const [name, setname] = useState('');
  const [Phone, setPhone] = useState('');
  const [Cpf, setCpf] = useState('');
  const [AddressStreet, setAddressStreet] = useState('');
  const [AddressNumber, setAddressNumber] = useState('');
  const [AddressCity, setAddressCity] = useState('');
  const [AddressDistrict, setAddressDistrict] = useState('');

  useEffect(() => {
    
}, []);

async function handleSubmit(e){
    e.preventDefault();
        
    await OnSubmit({
        name,
        Phone,
        AddressStreet,
        AddressNumber,
        AddressDistrict,
    });

        setname(''); 
        setPhone('');
    }

    return(
      <Container>
        <Form onSubmit={handleSubmit}>
        
        <div className="input-group">
          <div className="input-block">
            <label htmlFor="name">Nome</label>
            <input
             name="name" 
             id="name" 
             required
             value={name}
                onChange={e => setname(e.target.value)}
             />
          </div>

          <div className="input-block">
            <label htmlFor="CPF">CPF</label>
            <input
              type="number"
              name="CPF" 
              id="CPF" 
              required
              value={Cpf}
              onChange={e => setCpf(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="Phone">Telefone</label>
            <input
              type="number"
              name="Phone" 
              id="Phone" 
              required
              value={Phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="Street">Logradouro</label>
            <input
             name="AddressStreet" 
             id="AddressStreet" 
             required
             value={AddressStreet}
                onChange={e => setAddressStreet(e.target.value)}
            />
          </div>
            <div className="input-block">
              <label htmlFor="AddressNumber">Numero</label>
              <input 
                type="number"
                name="AddressNumber" 
                id="AddressNumber" 
                required 
                value={AddressNumber}
                onChange={e => setAddressNumber(e.target.value)}
                />
            </div>

            <div className="input-block">
              <label htmlFor="AddressDistrict">Bairro</label>
              <input
               name="AddressDistrict"
               id="AddressDistrict" 
               required 
               value={AddressDistrict}
               onChange={e => setAddressDistrict(e.target.value)}
               />
            </div>
            <div className="input-block">
              <label htmlFor="AddressCity">Cidade</label>
              <input
                name="AddressCity" 
                id="AddressCity" 
                required
                value={AddressCity}
                onChange={e => setAddressCity(e.target.value)}
              />
            </div>
          </div>
          
          
          <button type="submit">Salvar</button>
        </Form>
      </Container>
    );
}

export default DevForm;