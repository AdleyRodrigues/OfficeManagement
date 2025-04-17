import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
// Importar a página principal
import ListagemOficios from '../features/oficios/pages/ListagemOficios';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Listagem de Ofícios como rota principal */}
            <Route path="/" element={<ListagemOficios />} />
            <Route path="/oficios" element={<ListagemOficios />} />

            {/* Redireciona rotas não encontradas para a página principal */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes; 