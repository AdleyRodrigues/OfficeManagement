import React from 'react';
import { OficiosFilterParams } from '../types';

interface BotoesAcaoProps {
    filters: OficiosFilterParams;
    onFilterClick: () => void;
    onAddClick: () => void;
}

const BotoesAcao: React.FC<BotoesAcaoProps> = ({
    filters,
    onFilterClick,
    onAddClick
}) => {
    return (
        <div className="botoes-container" style={{
            margin: '20px 0',
            padding: '10px 0',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee',
        }}>
            <h3 style={{ marginBottom: '15px' }}>Ações</h3>

            <div style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={onFilterClick}
                    style={{
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        minWidth: '120px'
                    }}
                >
                    🔍 FILTRAR
                </button>

                <button
                    onClick={onAddClick}
                    style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        minWidth: '180px'
                    }}
                >
                    ➕ ADICIONAR OFÍCIO
                </button>
            </div>

            {filters.search && (
                <div style={{ margin: '10px 0', fontSize: '14px' }}>
                    <strong>Filtro aplicado:</strong> {filters.search}
                </div>
            )}
        </div>
    );
};

export default BotoesAcao; 