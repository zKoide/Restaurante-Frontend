import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'


import UBSProvider from './contexts/UBSContexts';
import Rota from './routes'

import './App.css';

function App() {
  return (
    <UBSProvider>
      <Router>
        <Rota/>
      </Router>
    </UBSProvider>
    
  );
}
export default App;
