import { useState, useEffect } from 'react'
import { KeyRound, Eye, EyeOff, X, Loader2, Settings, Key, Plus } from 'lucide-react'

const PROVIDERS = ['Groq']

export default function ApiKeyCard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [provider, setProvider] = useState('Groq')
  const [hasApiKey, setHasApiKey] = useState(false)
  const [keyVal, setKeyVal] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // helper for loading the key from the server
  async function fetchApiKey() {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/users/api-key`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setProvider(result.provider || 'Groq');
        setHasApiKey(Boolean(result.hasApiKey));
        setKeyVal(''); // do not show the actual key on UI from server
      } else {
        console.error("Failed to fetch API key:", result);
        setHasApiKey(false);
        setKeyVal('');
      }
    }
    catch (err) {
      console.error("Error fetching API key:", err);
      setHasApiKey(false);
      setKeyVal('');
    }
  }

  useEffect(() => {
    // initial load only
    fetchApiKey();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const response = await fetch(`${import.meta.env.VITE_URL}/users/api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        provider,
        apiKey: keyVal
      })
    });

    if (response.ok) {
      // refresh stored key from server so UI updates accordingly
      await fetchApiKey();
      setModalOpen(false);
    } else {
      const result = await response.json();
      setError(result.error || 'Unable to save API key');
    }
    setLoading(false);
  }



  function maskKey() {
    return hasApiKey ? '****************' : 'Not set'
  }

  return (
    <>
        {hasApiKey && (
          <div className="bg-[#161822] border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
        
          <h3 className="text-base font-semibold text-white">API Key</h3>
        
        
          <div className="flex items-center gap-2.5 bg-[#1c1f2e] rounded-xl px-3.5 py-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-white">{provider}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono tracking-widest">{maskKey()}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setError('')
              setKeyVal('')
              setModalOpen(true)
            }}
            className="self-end flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            Manage
          </button>
        </div>
        )}

        {!hasApiKey && <div className="bg-[#161822] border border-white/8 rounded-2xl p-5 flex flex-col gap-4">

          <h3 className="text-base font-semibold text-white">API Key</h3>
        
        <div className="flex flex-col items-center gap-3 py-8">
          <button className=' flex items-center gap-2 px-2 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-md font-medium transition-all' onClick={()=>{setError(''); setKeyVal(''); setModalOpen(true)}}>
            <Plus className='w-5 h-5' />
            <span className='py-1 px-1'>Add API key</span>
          </button>
        </div>
        </div>
        }
      


      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#161822] border border-white/10 rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">Manage API Key</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your key is stored securely and never shared.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Provider */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                >
                  {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Key input */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">API Key</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyVal}
                    onChange={(e) => setKeyVal(e.target.value)}
                    placeholder="Paste your API key here"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save API Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}