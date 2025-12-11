import { useState } from 'react';
import './App.css';

type SumRequest = {
  x: number;
  z: number;
};

type SumResult = {
  x: number;
  z: number;
  sum: number;
  multiples: number[];
};

type ExpressionResult = {
  expression: string;
  resultText: string;
  resultType: string;
  finalN: number;
  finalZ: number;
};

type IntervalResult = {
  a: number;
  b: number;
  minPositive: number | null;
  maxPositive: number | null;
};

const API_BASE = 'https://localhost:7142/api/Lab';

function App() {
  // Task 1
  const [x, setX] = useState<string>('');
  const [z, setZ] = useState<string>('');
  const [sumResult, setSumResult] = useState<SumResult | null>(null);
  const [sumError, setSumError] = useState<string>('');

  // Task 2
  const [expressions, setExpressions] = useState<ExpressionResult[]>([]);
  const [exprError, setExprError] = useState<string>('');

  // Task 3
  const [intervalIndex, setIntervalIndex] = useState<number>(1);
  const [intervalResult, setIntervalResult] = useState<IntervalResult | null>(null);
  const [intervalError, setIntervalError] = useState<string>('');

  const handleCalculateSum = async () => {
    setSumError('');
    setSumResult(null);

    const parsedX = Number(x);
    const parsedZ = Number(z);

    if (Number.isNaN(parsedX) || Number.isNaN(parsedZ)) {
      setSumError('Будь ласка, введіть коректні цілі числа для X і Z.');
      return;
    }

    const body: SumRequest = {
      x: parsedX,
      z: parsedZ,
    };

    try {
      const response = await fetch(`${API_BASE}/sum-multiples-of-five`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Помилка запиту.');
      }

      const data: SumResult = await response.json();
      setSumResult(data);
    } catch (error: any) {
      setSumError(error.message || 'Сталася помилка при обчисленні.');
    }
  };

  const handleLoadExpressions = async () => {
    setExprError('');
    setExpressions([]);

    try {
      const response = await fetch(`${API_BASE}/expressions`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Помилка запиту.');
      }

      const data: ExpressionResult[] = await response.json();
      setExpressions(data);
    } catch (error: any) {
      setExprError(error.message || 'Сталася помилка при обчисленні виразів.');
    }
  };

  const handleAnalyzeInterval = async () => {
    setIntervalError('');
    setIntervalResult(null);

    try {
      const response = await fetch(`${API_BASE}/interval/${intervalIndex}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Помилка запиту.');
      }

      const data: IntervalResult = await response.json();
      setIntervalResult(data);
    } catch (error: any) {
      setIntervalError(error.message || 'Сталася помилка при аналізі інтервалу.');
    }
  };

  return (
    <div className="app">
      <h1>Лабораторна робота — Варіант 10</h1>
      <p className="hint">
        Підказка: введіть значення X і Z, оберіть інтервал — і натисніть кнопку обчислення.
      </p>

      {/* Task 1 */}
      <section className="card">
        <h2>1. Сума чисел, кратних 5, на інтервалі [X, Z]</h2>
        <div className="form-row">
          <label>
            X:
            <input
              type="number"
              value={x}
              onChange={e => setX(e.target.value)}
              placeholder="Введіть X"
            />
          </label>
          <label>
            Z:
            <input
              type="number"
              value={z}
              onChange={e => setZ(e.target.value)}
              placeholder="Введіть Z"
            />
          </label>
        </div>
        <button onClick={handleCalculateSum}>Обчислити суму</button>

        {sumError && <div className="error">{sumError}</div>}

        {sumResult && (
          <div className="result">
            <p>
              Інтервал: <strong>[{sumResult.x}, {sumResult.z}]</strong>
            </p>
            <p>
              Числа, кратні 5:{' '}
              {sumResult.multiples.length > 0
                ? sumResult.multiples.join(', ')
                : 'немає'}
            </p>
            <p>
              Сума: <strong>{sumResult.sum}</strong>
            </p>
          </div>
        )}
      </section>

      {/* Task 2 */}
      <section className="card">
        <h2>2. Обчислення виразів</h2>
        <p>Початкові значення для кожного виразу: n = 2, z = 1.</p>
        <button onClick={handleLoadExpressions}>Обчислити вирази</button>

        {exprError && <div className="error">{exprError}</div>}

        {expressions.length > 0 && (
          <table className="result-table">
            <thead>
              <tr>
                <th>Вираз</th>
                <th>Значення</th>
                <th>Тип результату</th>
                <th>Кінцеве n</th>
                <th>Кінцеве z</th>
              </tr>
            </thead>
            <tbody>
              {expressions.map((expr, index) => (
                <tr key={index}>
                  <td>{expr.expression}</td>
                  <td>{expr.resultText}</td>
                  <td>{expr.resultType}</td>
                  <td>{expr.finalN}</td>
                  <td>{expr.finalZ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Task 3 */}
      <section className="card">
        <h2>3. Інтервали та додатні числа</h2>
        <p>Оберіть один з інтервалів:</p>
        <div className="form-row">
          <select
            value={intervalIndex}
            onChange={e => setIntervalIndex(Number(e.target.value))}
          >
            <option value={1}>[ -200 , 350 ]</option>
            <option value={2}>[ -50 , 20 ]</option>
            <option value={3}>[ 10 , 150 ]</option>
          </select>
        </div>
        <button onClick={handleAnalyzeInterval}>Проаналізувати інтервал</button>

        {intervalError && <div className="error">{intervalError}</div>}

        {intervalResult && (
          <div className="result">
            <p>
              Обраний інтервал: <strong>[{intervalResult.a}, {intervalResult.b}]</strong>
            </p>
            <p>
              Мінімальне додатне число:{' '}
              {intervalResult.minPositive !== null
                ? intervalResult.minPositive
                : 'немає додатних чисел'}
            </p>
            <p>
              Максимальне додатне число:{' '}
              {intervalResult.maxPositive !== null
                ? intervalResult.maxPositive
                : 'немає додатних чисел'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
