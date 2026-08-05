import { useState } from 'react';
import { useInputValidation } from './hooks/useInputValidation';
import { TemperatureConverter } from './components/TemperatureConverter';
import { CurrencyConverter } from './components/CurrencyConverter';
import { LengthConverter } from './components/LengthConverter';

const TABS = [
  { id: 'temperature', label: '🌡️ Temperatura' },
  { id: 'currency', label: '💱 Moneda' },
  { id: 'length', label: '📏 Longitud' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('temperature');
  const { value, error, handleChange, reset } = useInputValidation();

  // Resetear validación al cambiar de pestaña
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    reset();
  };

  const renderConverter = () => {
    switch (activeTab) {
      case 'temperature': return <TemperatureConverter value={value} onChange={handleChange} error={error} />;
      case 'currency': return <CurrencyConverter value={value} onChange={handleChange} error={error} />;
      case 'length': return <LengthConverter value={value} onChange={handleChange} error={error} />;
      default: return null;
    }
  };

  return (
    <main className="converter-card" role="main">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Conversor Elegante</h1>
      </header>

      <nav role="tablist" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text)',
              transition: 'var(--transition-base)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section role="tabpanel" aria-live="polite">
        {renderConverter()}
      </section>
    </main>
  );
}