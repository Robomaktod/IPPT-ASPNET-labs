import { useState } from 'react';
import './App.css';

type WordInfo = {
  word: string;
  count: number;
};

type TextWordsResult = {
  totalWords: number;
  wordsWithCounts: WordInfo[];
  invertedText: string;
};

type PrefixSearchResult = {
  prefix: string;
  words: string[];
};

type LetterStatsResult = {
  totalVowels: number;
  totalConsonants: number;
  countU: number;
  countE: number;
  countC: number;
  countK: number;
  countD: number;
};

type RegexSearchResult = {
  pattern: string;
  matchingLines: string[];
};

const API_BASE = 'http://localhost:5108/api/lab4';

type TabKey = 'words' | 'prefix' | 'letters' | 'regex';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('words');

  // Tab 1
  const [textWords, setTextWords] = useState('');
  const [wordsResult, setWordsResult] = useState<TextWordsResult | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordsError, setWordsError] = useState('');

  // Tab 2
  const [textPrefix, setTextPrefix] = useState('');
  const [prefix, setPrefix] = useState('при');
  const [prefixResult, setPrefixResult] = useState<PrefixSearchResult | null>(null);
  const [prefixError, setPrefixError] = useState('');

  // Tab 3
  const [sentence, setSentence] = useState('');
  const [lettersResult, setLettersResult] = useState<LetterStatsResult | null>(null);
  const [lettersError, setLettersError] = useState('');

  // Tab 4
  const [regexLinesText, setRegexLinesText] = useState('');
  const [regexResult, setRegexResult] = useState<RegexSearchResult | null>(null);
  const [regexError, setRegexError] = useState('');

  const handleAnalyzeWords = async (invert: boolean) => {
    if (!textWords.trim()) {
      setWordsError('Введіть текст.');
      return;
    }
    setWordsError('');

    const body = {
      text: textWords,
      selectedWords: invert ? selectedWords : [],
    };

    try {
      const res = await fetch(`${API_BASE}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка запиту');
      }

      const data: TextWordsResult = await res.json();
      setWordsResult(data);

      if (invert) {
        setTextWords(data.invertedText);
      }
    } catch (e: unknown) {
      setWordsError(e instanceof Error ? e.message : 'Невідома помилка');
    }
  };

  const handleWordSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedWords(options.map(o => o.value));
  };

  const handleSearchPrefix = async () => {
    if (!textPrefix.trim()) {
      setPrefixError('Введіть текст.');
      return;
    }
    setPrefixError('');

    const body = {
      text: textPrefix,
      prefix,
    };

    try {
      const res = await fetch(`${API_BASE}/prefix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка запиту');
      }

      const data: PrefixSearchResult = await res.json();
      setPrefixResult(data);
    } catch (e: unknown) {
      setPrefixError(e instanceof Error ? e.message : 'Невідома помилка');
    }
  };

  const handleCountLetters = async () => {
    if (!sentence.trim()) {
      setLettersError('Введіть речення.');
      return;
    }
    setLettersError('');

    const body = {
      sentence,
    };

    try {
      const res = await fetch(`${API_BASE}/letters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка запиту');
      }

      const data: LetterStatsResult = await res.json();
      setLettersResult(data);
    } catch (e: unknown) {
      setLettersError(e instanceof Error ? e.message : 'Невідома помилка');
    }
  };

  const handleRegexSearch = async () => {
    const lines = regexLinesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setRegexError('Введіть хоча б один рядок.');
      return;
    }
    setRegexError('');

    const body = { lines };

    try {
      const res = await fetch(`${API_BASE}/regex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка запиту');
      }

      const data: RegexSearchResult = await res.json();
      setRegexResult(data);
    } catch (e: unknown) {
      setRegexError(e instanceof Error ? e.message : 'Невідома помилка');
    }
  };

  const renderTabs = () => (
    <div className="tabs">
      <button
        className={activeTab === 'words' ? 'tab active' : 'tab'}
        onClick={() => setActiveTab('words')}
      >
        1. Слова та інверсія
      </button>
      <button
        className={activeTab === 'prefix' ? 'tab active' : 'tab'}
        onClick={() => setActiveTab('prefix')}
      >
        2. Слова з "при"
      </button>
      <button
        className={activeTab === 'letters' ? 'tab active' : 'tab'}
        onClick={() => setActiveTab('letters')}
      >
        3. Голосні / приголосні
      </button>
      <button
        className={activeTab === 'regex' ? 'tab active' : 'tab'}
        onClick={() => setActiveTab('regex')}
      >
        4. Regex пошук
      </button>
    </div>
  );

  const renderWordsTab = () => (
    <section className="card">
      <h2>1. Виділення слів, підрахунок та інверсія вибраних</h2>
      <label>
        Текст:
        <textarea
          value={textWords}
          onChange={e => setTextWords(e.target.value)}
          placeholder="Введіть текст для аналізу…"
        />
      </label>

      <div className="row">
        <button onClick={() => handleAnalyzeWords(false)}>Аналізувати слова</button>
        <button onClick={() => handleAnalyzeWords(true)} disabled={!wordsResult}>
          Інвертувати вибрані слова
        </button>
      </div>

      {wordsError && <div className="error">{wordsError}</div>}

      {wordsResult && (
        <div className="results-grid">
          <div>
            <label>Слова (ListBox, можна обирати кілька):</label>
            <select
              multiple
              size={8}
              value={selectedWords}
              onChange={handleWordSelectionChange}
            >
              {wordsResult.wordsWithCounts.map(w => (
                <option key={w.word} value={w.word}>
                  {w.word} ({w.count})
                </option>
              ))}
            </select>
            <div className="hint">
              Усього слів: <b>{wordsResult.totalWords}</b>
            </div>
          </div>
          <div>
            <label>Результат інверсії:</label>
            <textarea readOnly value={wordsResult.invertedText} />
          </div>
        </div>
      )}
    </section>
  );

  const renderPrefixTab = () => (
    <section className="card">
      <h2>2. Пошук слів, що починаються з "при"</h2>
      <label>
        Текст:
        <textarea
          value={textPrefix}
          onChange={e => setTextPrefix(e.target.value)}
          placeholder="Введіть текст…"
        />
      </label>

      <label>
        Префікс:
        <input
          type="text"
          value={prefix}
          onChange={e => setPrefix(e.target.value)}
        />
      </label>

      <button onClick={handleSearchPrefix}>Знайти слова</button>

      {prefixError && <div className="error">{prefixError}</div>}

      {prefixResult && (
        <div className="results">
          <label>Знайдені слова (ListBox):</label>
          <select multiple size={6}>
            {prefixResult.words.map(w => (
              <option key={w}>{w}</option>
            ))}
          </select>
          <div className="hint">
            Префікс: <b>{prefixResult.prefix}</b>, знайдено слів: {prefixResult.words.length}
          </div>
        </div>
      )}
    </section>
  );

  const renderLettersTab = () => (
    <section className="card">
      <h2>3. Підрахунок голосних (у, е) та приголосних (ц, к, д)</h2>
      <label>
        Речення:
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          placeholder="Введіть речення українською…"
        />
      </label>

      <button onClick={handleCountLetters}>Порахувати</button>

      {lettersError && <div className="error">{lettersError}</div>}

      {lettersResult && (
        <div className="results letters">
          <div>
            <h3>Голосні</h3>
            <p>у: {lettersResult.countU}</p>
            <p>е: {lettersResult.countE}</p>
            <p>
              Усього голосних: <b>{lettersResult.totalVowels}</b>
            </p>
          </div>
          <div>
            <h3>Приголосні</h3>
            <p>ц: {lettersResult.countC}</p>
            <p>к: {lettersResult.countK}</p>
            <p>д: {lettersResult.countD}</p>
            <p>
              Усього приголосних: <b>{lettersResult.totalConsonants}</b>
            </p>
          </div>
        </div>
      )}
    </section>
  );

  const renderRegexTab = () => (
    <section className="card">
      <h2>4. Пошук у рядках по шаблону (Regex)</h2>
      <p className="hint">
        Шаблон (регулярний вираз):{' '}
        <code>\bag\d&#123;1,3&#125;z.j[(t-z)|(k-n)]...\d</code>
      </p>

      <label>
        Рядки для пошуку (кожен рядок з нового рядка):
        <textarea
          value={regexLinesText}
          onChange={e => setRegexLinesText(e.target.value)}
          placeholder="Введіть кілька рядків…"
        />
      </label>

      <button onClick={handleRegexSearch}>Шукати по шаблону</button>

      {regexError && <div className="error">{regexError}</div>}

      {regexResult && (
        <div className="results">
          <div className="hint">
            Використаний шаблон: <code>{regexResult.pattern}</code>
          </div>
          <label>Рядки, що відповідають шаблону (ListBox):</label>
          {regexResult.matchingLines.length > 0 ? (
            <select multiple size={6}>
              {regexResult.matchingLines.map((line, idx) => (
                <option key={idx}>{line}</option>
              ))}
            </select>
          ) : (
            <div className="hint">Немає рядків, що відповідають шаблону.</div>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Лабораторна 4 — Робота з текстом (Варіант 10)</h1>
      </header>

      {renderTabs()}

      {activeTab === 'words' && renderWordsTab()}
      {activeTab === 'prefix' && renderPrefixTab()}
      {activeTab === 'letters' && renderLettersTab()}
      {activeTab === 'regex' && renderRegexTab()}
    </div>
  );
}

export default App;
