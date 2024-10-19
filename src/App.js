import React, { useState, useEffect } from 'react';
import './index.css';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
];

const API_URL = 'https://api.mymemory.translated.net/get';

const App = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const translateText = async () => {
      if (sourceText.trim() === '') {
        setTranslatedText('');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`);

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const data = await response.json();
        setTranslatedText(data.responseData.translatedText);
      } catch (err) {
        setError('An error occurred during translation. Please try again.');
        console.error('Translation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(translateText, 500);
    return () => clearTimeout(debounceTimer);
  }, [sourceText, sourceLang, targetLang]);

  return (
    <div className="container mx-auto max-w-xl p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Language Translation App
      </h1>
      <div className="space-y-4">
        <div>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={translatedText}
            readOnly
            placeholder="Translation will appear here"
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        {isLoading && <p className="text-center">Translating...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
      <footer className="text-center text-sm text-gray-500 mt-4">
        Powered by MyMemory Translation API
      </footer>
    </div>
  );
};

export default App;