

import React, {useState, useEffect} from 'react';

function DevForm({ OnSubmit }){
  const [CarPlate, setCarPlate] = useState('');
  const [CarBrand, setCarBrand] = useState('');
  const [CarModel, setCarModel] = useState('');
  const [CarEngine, setCarEngine] = useState('');
  const [AddressCity, setAddressCity] = useState('');
  const [CarMileage, setCarMileage] = useState('');

  useEffect(() => {
    
}, []);

async function handleSubmit(e){
    e.preventDefault();
        
    await OnSubmit({
        CarPlate,
        CarBrand,
        CarModel,
        CarEngine,
        CarMileage,
    });

        setCarPlate(''); 
        setCarBrand('');
    }

    return(
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="CarPlate">Placa</label>
            <input
             name="CarPlate" 
             id="CarPlate" 
             required
             value={CarPlate}
                onChange={e => setCarPlate(e.target.value)}
             />
          </div>

          <div className="input-block">
            <label htmlFor="CarBrand">Marca</label>
            <input
              name="CarBrand" 
              id="CarBrand" 
              required
              value={CarBrand}
              onChange={e => setCarBrand(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="CarModel">Modelo</label>
            <input
             name="CarModel" 
             id="CarModel" 
             required
             value={CarModel}
                onChange={e => setCarModel(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="CarEngine">Motor</label>
              <input 
                name="CarEngine" 
                id="CarEngine" 
                required 
                value={CarEngine}
                onChange={e => setCarEngine(e.target.value)}
                />
            </div>

            <div className="input-block">
              <label htmlFor="CarMileage">Quilometragem</label>
              <input
               name="CarMileage"
               id="CarMileage" 
               required 
               value={CarMileage}
               onChange={e => setCarMileage(e.target.value)}
               />
            </div>

          </div>
          
          <div className="input-block">
              <label htmlFor="AddressCity">Dono</label>
              <input
                name="AddressCity" 
                id="AddressCity" 
                required
                value={AddressCity}
                onChange={e => setAddressCity(e.target.value)}
              />
            </div>
          <button type="submit">Salvar</button>
        </form>
    );
}

export default DevForm;