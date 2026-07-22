import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [hours, setHours] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    // Validar se a URL tem http/https
    let validUrl = url;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'http://' + validUrl;
    }

    setIsLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const response = await fetch('http://localhost:8000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: validUrl,
          expiration_hours: hours,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao encurtar a URL. Verifique se o backend está rodando.');
      }

      const data = await response.json();
      setShortUrl(`http://localhost:8000/${data.short_url}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>

      <div className="w-full max-w-xl z-10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            danny devito url
          </h1>
          <p className="text-slate-400 text-lg">
            Encurte suas URLs de forma segura com expiração automática.
          </p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
                URL Original
              </label>
              <input
                type="text"
                id="url"
                placeholder="Ex: https://github.com/seuperfil"
                className="input-field"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-slate-300 mb-2">
                Tempo de Expiração
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 12, 24, 72].map((h) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setHours(h)}
                    className={`py-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                      hours === h
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !url}
              className={`w-full btn-primary flex justify-center items-center gap-2 ${
                (isLoading || !url) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Encurtando...
                </>
              ) : (
                'Encurtar Link'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center animate-slide-up">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-8 pt-8 border-t border-slate-700/50 animate-slide-up">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Sua URL Encurtada</h3>
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-indigo-300 font-mono truncate select-all flex items-center">
                  {shortUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors duration-200 flex-shrink-0"
                  title="Copiar"
                >
                  {copied ? (
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Esta URL expirará em {hours} {hours === 1 ? 'hora' : 'horas'}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
