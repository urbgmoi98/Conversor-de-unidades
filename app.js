const { useState, useEffect, useCallback } = React;

// ===== COMPONENTE REUTILIZABLE: InputValidado =====
const InputValidado = ({ label, value, onChange, error, placeholder }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type="text"
        className={`converter-input ${error ? 'error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className={`error-msg ${error ? 'show' : ''}`}>
        Ingresa un número válido
      </div>
    </div>
  );
};
const { useState, useEffect, useCallback } = React;

// ===== COMPONENTE REUTILIZABLE: InputValidado =====
const InputValidado = ({ label, value, onChange, error, placeholder }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type="text"
        className={`converter-input ${error ? 'error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className={`error-msg ${error ? 'show' : ''}`}>
        Ingresa un número válido
      </div>
    </div>
  );
};
// ===== COMPONENTE REUTILIZABLE: SelectorUnidad =====
const SelectorUnidad = ({ label, value, onChange, options }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="select-wrapper">
        <select className="converter-select" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// ===== COMPONENTE REUTILIZABLE: BotonSwap =====
const BotonSwap = ({ onClick }) => (
  <button className="swap-btn" onClick={onClick}>⇅</button>
);

// ===== COMPONENTE REUTILIZABLE: CajaResultado =====
const CajaResultado = ({ value, formula }) => (
  <div className="result-box">
    <div className="result-label">Resultado</div>
    <div className="result-value">{value}</div>
    <div className="result-formula">{formula}</div>
  </div>
);

// ===== HOOK PERSONALIZADO: useConversion =====
const useConversion = (calcFn, initialFrom = '', initialTo = '') => {
  const [input, setInput] = useState('');
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [error, setError] = useState(false);
  const [result, setResult] = useState({ value: '', formula: '' });

  const convert = useCallback(() => {
    const val = parseFloat(input);
    if (input.trim() === '' || isNaN(val) || !from || !to) {
      setError(input.trim() !== '' && !isNaN(val) && from && to ? false : true);
      setResult({ value: '', formula: '' });
      return;
    }
    setError(false);
    setResult(calcFn(val, from, to));
  }, [input, from, to, calcFn]);

  useEffect(() => { convert(); }, [input, from, to, convert]);

  const swap = () => { setFrom(to); setTo(from); };

  return { input, setInput, from, setFrom, to, setTo, error, result, swap };
};

// ===== BITS: DATOS =====
const TEMP_OPTIONS = [
  { value: 'celsius', label: 'Celsius (°C)' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
  { value: 'kelvin', label: 'Kelvin (K)' },
];

const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD - Dólar estadounidense' },
  { value: 'eur', label: 'EUR - Euro' },
  { value: 'mxn', label: 'MXN - Peso mexicano' },
  { value: 'gbp', label: 'GBP - Libra esterlina' },
  { value: 'jpy', label: 'JPY - Yen japonés' },
  { value: 'cop', label: 'COP - Peso colombiano' },
  { value: 'ars', label: 'ARS - Peso argentino' },
  { value: 'brl', label: 'BRL - Real brasileño' },
];

const LENGTH_OPTIONS = [
  { value: 'm', label: 'Metros (m)' },
  { value: 'km', label: 'Kilómetros (km)' },
  { value: 'cm', label: 'Centímetros (cm)' },
  { value: 'mm', label: 'Milímetros (mm)' },
  { value: 'ft', label: 'Pies (ft)' },
  { value: 'in', label: 'Pulgadas (in)' },
  { value: 'yd', label: 'Yardas (yd)' },
  { value: 'mi', label: 'Millas (mi)' },
];

// ===== BITS: FUNCIONES DE CÁLCULO =====
const calcTemp = (val, from, to) => {
  let c = from === 'celsius' ? val : from === 'fahrenheit' ? (val - 32) * 5/9 : val - 273.15;
  let r = to === 'celsius' ? c : to === 'fahrenheit' ? c * 9/5 + 32 : c + 273.15;
  const u = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
  return {
    value: `${r.toFixed(2)} ${u[to]}`,
    formula: from === to ? `${val} ${u[from]} = ${r.toFixed(2)} ${u[to]}` :
      to === 'fahrenheit' ? `(${val} × 9/5) + 32 = ${r.toFixed(2)}` :
      to === 'kelvin' ? `${val} + 273.15 = ${r.toFixed(2)}` :
      to === 'celsius' && from === 'fahrenheit' ? `(${val} - 32) × 5/9 = ${r.toFixed(2)}` :
      `${val} - 273.15 = ${r.toFixed(2)}`
  };
};

const RATES = { usd: 1, eur: 0.92, mxn: 17.0, gbp: 0.79, jpy: 150.0, cop: 3900, ars: 350, brl: 4.95 };
const SYM = { usd: '$', eur: '€', mxn: '$', gbp: '£', jpy: '¥', cop: '$', ars: '$', brl: 'R$' };

const calcCurrency = (val, from, to) => {
  const rate = RATES[to] / RATES[from];
  const res = val * rate;
  return {
    value: `${SYM[to]} ${res.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to.toUpperCase()}`,
    formula: `1 ${from.toUpperCase()} ≈ ${rate.toFixed(4)} ${to.toUpperCase()}`
  };
};

const LFACTORS = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344 };
const LLABELS = { m: 'm', km: 'km', cm: 'cm', mm: 'mm', ft: 'ft', in: 'in', yd: 'yd', mi: 'mi' };

const calcLength = (val, from, to) => {
  const meters = val * LFACTORS[from];
  const res = meters / LFACTORS[to];
  const factor = LFACTORS[from] / LFACTORS[to];
  return {
    value: `${res.toFixed(4)} ${LLABELS[to]}`,
    formula: `${val} ${LLABELS[from]} × ${factor.toFixed(6)} = ${res.toFixed(4)} ${LLABELS[to]}`
  };
};

// ===== COMPONENTE: ConversorTemperatura =====
const ConversorTemperatura = () => {
  const { input, setInput, from, setFrom, to, setTo, error, result, swap } = useConversion(calcTemp, 'celsius', 'fahrenheit');
  return (
    <>
      <InputValidado label="Cantidad" value={input} onChange={setInput} error={error} placeholder="Ej: 25" />
      <SelectorUnidad label="De" value={from} onChange={setFrom} options={TEMP_OPTIONS} />
      <BotonSwap onClick={swap} />
      <SelectorUnidad label="A" value={to} onChange={setTo} options={TEMP_OPTIONS} />
      <CajaResultado value={result.value} formula={result.formula} />
    </>
  );
};

// ===== COMPONENTE: ConversorMoneda =====
const ConversorMoneda = () => {
  const { input, setInput, from, setFrom, to, setTo, error, result, swap } = useConversion(calcCurrency, 'usd', 'mxn');
  return (
    <>
      <InputValidado label="Cantidad" value={input} onChange={setInput} error={error} placeholder="Ej: 100" />
      <SelectorUnidad label="De" value={from} onChange={setFrom} options={CURRENCY_OPTIONS} />
      <BotonSwap onClick={swap} />
      <SelectorUnidad label="A" value={to} onChange={setTo} options={CURRENCY_OPTIONS} />
      <CajaResultado value={result.value} formula={result.formula} />
      <p className="currency-note">* Tasas aproximadas. Para fines informativos.</p>
    </>
  );
};

// ===== COMPONENTE: ConversorLongitud =====
const ConversorLongitud = () => {
  const { input, setInput, from, setFrom, to, setTo, error, result, swap } = useConversion(calcLength, 'm', 'km');
  return (
    <>
      <InputValidado label="Cantidad" value={input} onChange={setInput} error={error} placeholder="Ej: 5" />
      <SelectorUnidad label="De" value={from} onChange={setFrom} options={LENGTH_OPTIONS} />
      <BotonSwap onClick={swap} />
      <SelectorUnidad label="A" value={to} onChange={setTo} options={LENGTH_OPTIONS} />
      <CajaResultado value={result.value} formula={result.formula} />
    </>
  );
};

// ===== COMPONENTE PRINCIPAL: App =====
const App = () => {
  const [activeTab, setActiveTab] = useState('temp');
  const tabs = [
    { id: 'temp', label: '🌡️ Temperatura', component: <ConversorTemperatura /> },
    { id: 'currency', label: '💰 Moneda', component: <ConversorMoneda /> },
    { id: 'length', label: '📏 Longitud', component: <ConversorLongitud /> },
  ];

  return (
    <div className="converter-card">
      <h1 className="converter-title">⚡ Conversor Universal</h1>
      <p className="converter-subtitle">Convierte entre diferentes unidades al instante</p>
      
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      {tabs.map((t) => (
        <div key={t.id} className={`converter-section ${activeTab === t.id ? 'active' : ''}`}>
          {activeTab === t.id ? t.component : null}
        </div>
      ))}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);