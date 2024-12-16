import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Oficio from './features/ListOficios/Oficio';
import AddOficio from './features/AddOficios/AddOficio';
import { Button } from '@mui/material';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            style={{ margin: '10px' }}
          >
            Lista de Ofícios
          </Button>
        </nav>
        <Routes>
          <Route path="/" element={<Oficio />} />
          <Route path="/add" element={<AddOficio />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
