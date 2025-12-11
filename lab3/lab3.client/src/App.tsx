import { useState } from 'react';
import './App.css';

type GeometricProgressionResult = {
  terms: number[];
  sum: number;
  kthTerm: number;
  firstTerm: number;
  ratio: number;
  count: number;
  indexK: number;
};

// Заміни порт під свій (дивись dotnet run)
const API_BASE = 'http://localhost:5261/api/lab3';

function App() {
  const [firstTerm, setFirstTerm] = useState<number>(1);  // [-50, 50]
  const [ratio, setRatio] = useState<number>(2);          // [1, 25]
  const [count, setCount] = useState<number>(5);          // [5, 20]
  const [indexK, setIndexK] = useState<number>(1);        // [1, 30]

  const [result, setResult] = useState<GeometricProgressionResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    const body = {
      firstTerm,
      ratio,
      count,
      indexK,
    };

    try {
      const response = await fetch(`${API_BASE}/geometric`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Помилка запиту');
      }

      const data: GeometricProgressionResult = await response.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? 'Невідома помилка');
    }
  };

  return (
    <div className="app">
      <header className="toolbar">
        <span className="toolbar-title">Лабораторна 3 — Геометрична прогресія (варіант 10)</span>
        <button onClick={handleCalculate}>Обчислити</button>
      </header>

      <section className="card">
        <h2>Параметри прогресії</h2>

        <div className="grid">
          <label>
            Перший член a₁ (numericUpDown1: [-50, 50]):
            <input
              type="number"
              min={-50}
              max={50}
              value={firstTerm}
              onChange={e => setFirstTerm(Number(e.target.value))}
            />
          </label>

          <label>
            Знаменник q (numericUpDown2: [1, 25]):
            <input
              type="number"
              min={1}
              max={25}
              value={ratio}
              onChange={e => setRatio(Number(e.target.value))}
            />
          </label>

          <label>
            Кількість членів n (numericUpDown3: [5, 20]):
            <input
              type="number"
              min={5}
              max={20}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
            />
          </label>

          <label>
            Номер члена k (numericUpDown4: [1, 30]):
            <input
              type="number"
              min={1}
              max={30}
              value={indexK}
              onChange={e => setIndexK(Number(e.target.value))}
            />
          </label>
        </div>

        <p className="hint">
          Бекенд використовує похідний клас <b>GeometricProgression</b> від базового <b>Sequence</b>:
          рахує всі члени, суму та окремо член з номером k.
        </p>
      </section>

      {result && (
        <section className="card">
          <h2>Результати</h2>

          <div className="results-grid">
            <div>
              <label>Перші n членів геометричної прогресії:</label>
              <textarea
                readOnly
                value={result.terms.map(x => x.toFixed(2)).join(', ')}
              />
            </div>

            <div>
              <label>Сума перших n членів:</label>
              <input
                type="text"
                readOnly
                value={result.sum.toFixed(4)}
              />
            </div>

            <div>
              <label>Член з номером k = {result.indexK}:</label>
              <input
                type="text"
                readOnly
                value={result.kthTerm.toFixed(4)}
              />
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
