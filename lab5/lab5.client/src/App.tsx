import React, { useEffect, useState } from 'react';
import './App.css';

type SubscriberDto = {
  lastName: string;
  initials: string;
  address: string;
  cityCode: string;
  phoneNumber: string;
};

type SearchResultDto = {
  phoneQuery: string;
  results: SubscriberDto[];
};

// Постав свій порт з dotnet run
const API_BASE = 'http://localhost:5124/api/phonebook';

function App() {
  const [subscribers, setSubscribers] = useState<SubscriberDto[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Пошук
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResultDto | null>(null);

  // Форма додавання
  const [newSubscriber, setNewSubscriber] = useState<SubscriberDto>({
    lastName: '',
    initials: '',
    address: '',
    cityCode: '',
    phoneNumber: '',
  });

  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      setError('');
      const res = await fetch(API_BASE);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка завантаження довідника');
      }
      const data: SubscriberDto[] = await res.json();
      setSubscribers(data);
      setIsLoaded(true);
    } catch (e: any) {
      setError(e.message ?? 'Невідома помилка');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      setError('Введіть номер телефону для пошуку.');
      return;
    }
    setError('');
    try {
      const res = await fetch(`${API_BASE}/search?phone=${encodeURIComponent(searchPhone)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка пошуку');
      }
      const data: SearchResultDto = await res.json();
      setSearchResult(data);
    } catch (e: any) {
      setError(e.message ?? 'Невідома помилка');
    }
  };

  const handleExportSearch = async () => {
    if (!searchPhone.trim()) {
      setError('Спочатку введіть номер і виконайте пошук.');
      return;
    }
    setError('');

    try {
      const res = await fetch(`${API_BASE}/export?phone=${encodeURIComponent(searchPhone)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка експорту результатів пошуку');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Search_${searchPhone}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message ?? 'Невідома помилка');
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriber.lastName.trim() || !newSubscriber.phoneNumber.trim()) {
      setError('Прізвище та номер телефону обовʼязкові.');
      return;
    }
    setError('');
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubscriber),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка додавання абонента');
      }
      setNewSubscriber({
        lastName: '',
        initials: '',
        address: '',
        cityCode: '',
        phoneNumber: '',
      });
      await loadAll();
    } catch (e: any) {
      setError(e.message ?? 'Невідома помилка');
    }
  };

  // "MainMenu": Open (перечитати файл), Close (очистити), Save (експорт результатів), Print
  const handleMenuClick = (action: string) => {
    switch (action) {
      case 'open':
        loadAll();
        break;
      case 'close':
        setSubscribers([]);
        setIsLoaded(false);
        break;
      case 'save':
        handleExportSearch();
        break;
      case 'print':
        window.print(); // друк на принтер або в PDF
        break;
      default:
        break;
    }
  };

  const handleNewChange = (field: keyof SubscriberDto, value: string) => {
    setNewSubscriber(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="app">
      <header className="menu-bar">
        <div className="menu-title">Lab5 — Телефонний довідник (Варіант 10)</div>
        <nav className="menu">
          <button onClick={() => handleMenuClick('open')}>Open</button>
          <button onClick={() => handleMenuClick('close')}>Close</button>
          <button onClick={() => handleMenuClick('save')}>Save search to file</button>
          <button onClick={() => handleMenuClick('print')}>Print / PDF</button>
        </nav>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <h2>Пошук абонента за номером телефону</h2>
        <div className="row">
          <label>
            Номер телефону:
            <input
              type="text"
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
              placeholder="Наприклад: 1234567"
            />
          </label>
          <button onClick={handleSearch}>Пошук</button>
        </div>

        {searchResult && (
          <div className="search-results">
            <h3>Результати пошуку (номер: {searchResult.phoneQuery})</h3>
            {searchResult.results.length === 0 ? (
              <p>Абонентів не знайдено.</p>
            ) : (
              <table className="grid">
                <thead>
                  <tr>
                    <th>Прізвище</th>
                    <th>Ініціали</th>
                    <th>Адреса</th>
                    <th>Код міста</th>
                    <th>Номер телефону</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.results.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.lastName}</td>
                      <td>{s.initials}</td>
                      <td>{s.address}</td>
                      <td>{s.cityCode}</td>
                      <td>{s.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Додавання нового абонента</h2>
        <div className="grid-form">
          <label>
            Прізвище:
            <input
              type="text"
              value={newSubscriber.lastName}
              onChange={e => handleNewChange('lastName', e.target.value)}
            />
          </label>
          <label>
            Ініціали:
            <input
              type="text"
              value={newSubscriber.initials}
              onChange={e => handleNewChange('initials', e.target.value)}
            />
          </label>
          <label>
            Адреса:
            <input
              type="text"
              value={newSubscriber.address}
              onChange={e => handleNewChange('address', e.target.value)}
            />
          </label>
          <label>
            Код міста:
            <input
              type="text"
              value={newSubscriber.cityCode}
              onChange={e => handleNewChange('cityCode', e.target.value)}
            />
          </label>
          <label>
            Номер телефону:
            <input
              type="text"
              value={newSubscriber.phoneNumber}
              onChange={e => handleNewChange('phoneNumber', e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleAddSubscriber}>Додати абонента</button>
      </section>

      <section className="card">
        <h2>Всі абоненти (аналог DataGridView)</h2>
        {!isLoaded ? (
          <p>Дані ще не завантажено. Натисніть Open або зачекайте.</p>
        ) : subscribers.length === 0 ? (
          <p>Довідник порожній.</p>
        ) : (
          <div className="table-wrapper">
            <table className="grid">
              <thead>
                <tr>
                  <th>Прізвище</th>
                  <th>Ініціали</th>
                  <th>Адреса</th>
                  <th>Код міста</th>
                  <th>Номер телефону</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.lastName}</td>
                    <td>{s.initials}</td>
                    <td>{s.address}</td>
                    <td>{s.cityCode}</td>
                    <td>{s.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
