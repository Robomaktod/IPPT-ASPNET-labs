import { useState } from 'react';
import './App.css';

type MatrixPairDto = {
  size: number;
  matrixA: number[][];
  matrixB: number[][];
};

type LabOperationsResult = {
  rowDifference: number[];
  scalarProduct: number[];
  decrementedRow: number[];
  columnsEqual: boolean;
};

const API_BASE = 'http://localhost:5268/api/lab2'; // змінй порт під свій

function App() {
  const [size, setSize] = useState<number>(3);
  const [matrixA, setMatrixA] = useState<number[][] | null>(null);
  const [matrixB, setMatrixB] = useState<number[][] | null>(null);

  // для дублювання
  const [isRow, setIsRow] = useState<boolean>(true);
  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>(0);

  // індекси для операцій (0-based всередині, але показуємо 1..size)
  const [rowAIndex, setRowAIndex] = useState<number>(0);
  const [rowBIndex, setRowBIndex] = useState<number>(0);
  const [rowPIndex, setRowPIndex] = useState<number>(0);
  const [colKIndex, setColKIndex] = useState<number>(0);
  const [colMIndex, setColMIndex] = useState<number>(0);
  const [colNIndex, setColNIndex] = useState<number>(0);
  const [scalarC, setScalarC] = useState<number>(2);

  const [operationsResult, setOperationsResult] = useState<LabOperationsResult | null>(null);
  const [equalMessage, setEqualMessage] = useState<string>('');

  const [error, setError] = useState<string>('');

  const hasMatrices = matrixA !== null && matrixB !== null;

  const generateMatrices = async () => {
    try {
      setError('');
      setOperationsResult(null);
      setEqualMessage('');

      const response = await fetch(`${API_BASE}/generate?size=${size}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error while generating matrices');
      }

      const data: MatrixPairDto = await response.json();
      setMatrixA(data.matrixA);
      setMatrixB(data.matrixB);

      // reset indices
      setSourceIndex(0);
      setTargetIndex(0);
      setRowAIndex(0);
      setRowBIndex(0);
      setRowPIndex(0);
      setColKIndex(0);
      setColMIndex(0);
      setColNIndex(0);
      setScalarC(2);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    }
  };

  const duplicate = async () => {
    if (!hasMatrices) return;
    try {
      setError('');
      const body = {
        matrixA,
        matrixB,
        sourceIndex,
        targetIndex,
        isRow,
      };

      const response = await fetch(`${API_BASE}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error while duplicating');
      }

      const data: MatrixPairDto = await response.json();
      setMatrixA(data.matrixA);
      setMatrixB(data.matrixB);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    }
  };

  const runOperations = async () => {
    if (!hasMatrices) return;
    try {
      setError('');
      const body = {
        matrixA,
        matrixB,
        rowIndexA: rowAIndex,
        rowIndexB: rowBIndex,
        columnIndexK: colKIndex,
        rowIndexP: rowPIndex,
        columnIndexM: colMIndex,
        columnIndexN: colNIndex,
        scalarC,
      };

      const response = await fetch(`${API_BASE}/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error while calculating operations');
      }

      const data: LabOperationsResult = await response.json();
      setOperationsResult(data);

      const msg = data.columnsEqual
        ? 'Стовпці рівні.'
        : 'Стовпці не рівні.';
      setEqualMessage(msg);
      // "messageBox" аналог:
      alert(msg);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    }
  };

  const renderMatrix = (matrix: number[][] | null, title: string) => {
    if (!matrix) return null;
    return (
      <div className="matrix-card">
        <h3>{title}</h3>
        <table className="matrix-table">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td key={j}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const indexOptions = Array.from({ length: size }, (_, i) => i);

  return (
    <div className="app">
      <header className="toolbar">
        <span className="toolbar-title">Лабораторна — матриці, 1D масив та оператори</span>
        <button onClick={generateMatrices}>Згенерувати матриці</button>
      </header>

      <section className="card">
        <h2>Налаштування розмірності</h2>
        <label>
          Розмірність (аналог domainUpDown):
          <select
            value={size}
            onChange={e => setSize(Number(e.target.value))}
          >
            <option value={3}>3 × 3</option>
            <option value={4}>4 × 4</option>
            <option value={5}>5 × 5</option>
          </select>
        </label>
        <p className="hint">Числа генеруються випадково з інтервалу [0, 10].</p>
      </section>

      <section className="matrices">
        {renderMatrix(matrixA, 'Матриця A')}
        {renderMatrix(matrixB, 'Матриця B')}
      </section>

      {hasMatrices && (
        <>
          <section className="card">
            <h2>Дублювання рядка або стовпця з A в B</h2>
            <div className="row">
              <label>
                Тип:
                <select
                  value={isRow ? 'row' : 'col'}
                  onChange={e => setIsRow(e.target.value === 'row')}
                >
                  <option value="row">Рядок</option>
                  <option value="col">Стовпець</option>
                </select>
              </label>
              <label>
                i (джерело в A, 1..{size}):
                <input
                  type="number"
                  min={1}
                  max={size}
                  value={sourceIndex + 1}
                  onChange={e =>
                    setSourceIndex(
                      Math.min(size - 1, Math.max(0, Number(e.target.value) - 1)),
                    )
                  }
                />
              </label>
              <label>
                j (ціль в B, 1..{size}):
                <input
                  type="number"
                  min={1}
                  max={size}
                  value={targetIndex + 1}
                  onChange={e =>
                    setTargetIndex(
                      Math.min(size - 1, Math.max(0, Number(e.target.value) - 1)),
                    )
                  }
                />
              </label>
              <button onClick={duplicate}>Дублювати</button>
            </div>
          </section>

          <section className="card">
            <h2>Основні операції з 1D масивами</h2>

            <div className="grid">
              <div>
                <h3>Різниця рядків A і B</h3>
                <label>
                  Рядок матриці A (1..{size}):
                  <select
                    value={rowAIndex}
                    onChange={e => setRowAIndex(Number(e.target.value))}
                  >
                    {indexOptions.map(i => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Рядок матриці B (1..{size}):
                  <select
                    value={rowBIndex}
                    onChange={e => setRowBIndex(Number(e.target.value))}
                  >
                    {indexOptions.map(i => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <h3>Добуток C · стовпець k матриці B</h3>
                <label>
                  C (numericUpDown 2..5):
                  <input
                    type="number"
                    min={2}
                    max={5}
                    value={scalarC}
                    onChange={e =>
                      setScalarC(
                        Math.min(5, Math.max(2, Number(e.target.value))),
                      )
                    }
                  />
                </label>
                <label>
                  k (стовпець B, 1..{size}):
                  <select
                    value={colKIndex}
                    onChange={e => setColKIndex(Number(e.target.value))}
                  >
                    {indexOptions.map(i => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <h3>Декремент (-- ) рядка p матриці A</h3>
                <label>
                  p (рядок A, 1..{size}):
                  <select
                    value={rowPIndex}
                    onChange={e => setRowPIndex(Number(e.target.value))}
                  >
                    {indexOptions.map(i => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <h3>Перевірка рівності стовпців</h3>
                <label>
                  m (стовпець A, 1..{size}):
                  <select
                    value={colMIndex}
                    onChange={e => setColMIndex(Number(e.target.value))}
                  >
                    {indexOptions.map(i => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  n (стовпець B, 1..{size}):
                  <select
                    value={colNIndex}
                    onChange={e => setColNIndex(Number(e.target.value))}
                  >
                    {indexOptions.map(i => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <button onClick={runOperations}>Виконати операції</button>

            {operationsResult && (
              <div className="results">
                <div>
                  <label>Різниця рядків (A - B):</label>
                  <textarea
                    readOnly
                    value={operationsResult.rowDifference.join(', ')}
                  />
                </div>
                <div>
                  <label>C · стовпець k (B):</label>
                  <textarea
                    readOnly
                    value={operationsResult.scalarProduct.join(', ')}
                  />
                </div>
                <div>
                  <label>Декрементований рядок p (A --):</label>
                  <textarea
                    readOnly
                    value={operationsResult.decrementedRow.join(', ')}
                  />
                </div>
                <div>
                  <label>Перевірка рівності стовпців:</label>
                  <div className="equal-msg">{equalMessage}</div>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
