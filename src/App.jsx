import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [busqueda, setBusqueda] = useState('pikachu');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPokemon = useCallback(async (nombre) => {
    if (!nombre.trim()) return;

    setCargando(true);
    setError(null);

    try {
      const respuesta = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`
      );
      setPokemon(respuesta.data);
    } catch (err) {
      console.error('Detalle del error:', err);
      setError('Pokémon no encontrado. Intenta con otro nombre o ID.');
      setPokemon(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    
  }, [obtenerPokemon]);

  const handleSubmit = (e) => {
    e.preventDefault();
    obtenerPokemon(busqueda);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '0 16px' }}>
      <h1>BuscadorPokeAPI</h1>



      {/* Formulario de Búsqueda */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Nombre o ID (ej. charizard, 25)"
          style={{ padding: '10px', width: '70%', borderRadius: '6px', border: '1px solid #300707', fontSize: '14px' }}
        />
        <button 
          type="submit" 
          disabled={cargando}
          style={{ 
            padding: '10px 16px', 
            borderRadius: '6px', 
            border: 'none', 
            backgroundColor: cargando ? '#11a00cab' : '#3638d1', 
            color: '#17c72e', 
            fontWeight: 'bold', 
            cursor: cargando ? 'not-allowed' : 'pointer' 
          }}
        >
          {cargando ? '...' : 'Buscar'}
        </button>
      </form>

      {/* ÁREA PRINCIPAL DE RESULTADOS / ESTADOS */}
      <div style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Estado 1: Cargando (Indicador visible) */}
        {cargando && (
          <div style={{ padding: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 10px auto',
              border: '4px solid #8b2929',
              borderTop: '4px solid #0066cc',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#0066cc', fontWeight: 'bold' }}>Cargando datos de la API...</p>
            {/* Definición de la animación de giro */}
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

            

        {/* Estado 2: Error */}
        {!cargando && error && (
          <div style={{ color: '#f1e3e3', backgroundColor: '#af5a5a', border: '1px solid #d9534f', padding: '15px', borderRadius: '8px', width: '100%' }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Estado 3: Datos cargados correctamente */}
        {!cargando && !error && pokemon && (
          <div style={{ border: '1px solid #3b2020', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', backgroundColor: '#1b1a1a' }}>
            <h2 style={{ textTransform: 'capitalize', margin: '0 0 10px 0' }}>
              {pokemon.name} <span style={{ color: '#2a57d3' }}>#{pokemon.id}</span>
            </h2>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              style={{ width: '140px', height: '140px' }}
            />
            <div style={{ textAlign: 'left', marginTop: '10px', fontSize: '14px' }}>
              <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
              <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
              <p style={{ textTransform: 'capitalize' }}>
                <strong>Tipos:</strong> {pokemon.types.map((t) => t.type.name).join(', ')}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;