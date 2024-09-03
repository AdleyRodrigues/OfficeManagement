import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Oficio from './features/ListOficios/Oficio';
import AddOficio from './features/AddOficios/AddOficio';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Lista de Ofícios</Link>
            </li>
            <li>
              <Link to="/add">Adicionar Ofício</Link>
            </li>
          </ul>
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
