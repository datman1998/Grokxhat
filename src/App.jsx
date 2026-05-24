import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import MiniPrompt from "./MiniPrompt";

// ─── Inline SVG icons ──────────────────────────────────────────────
const SvgIcon = ({ children, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const SendIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="M21.854 2.147l-10.94 10.939" /></SvgIcon>;
const UserIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></SvgIcon>;
const SparklesIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></SvgIcon>;
const KeyIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r="1" fill="currentColor" /></SvgIcon>;
const AlertCircleIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></SvgIcon>;
const LoaderIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></SvgIcon>;
const ServerIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></SvgIcon>;
const SettingsIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></SvgIcon>;
const ChevronDownIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="m6 9 6 6 6-6" /></SvgIcon>;
const TrashIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></SvgIcon>;
const RotateCcwIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></SvgIcon>;
const WandIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h.01" /><path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" /></SvgIcon>;
const XIcon = ({ size = 16, className = "" }) => <SvgIcon size={size} className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></SvgIcon>;

// ─── Constants ───────────────────────────────────────────────
const DEFAULT_SYSTEM_PROMPT = "Du er en hjelpsom, skarp og direkte AI-assistent.";

const MODEL_OPTIONS = [
  { id: "grok-4.20-multi-agent-beta-0309", label: "Grok 4.20 Multi-Agent", meta: "Mest kraftfull" },
  { id: "grok-4.20-beta-0309-reasoning", label: "Grok 4.20 Reasoning", meta: "Dyp tenking" },
  { id: "grok-4.20-beta-0309-non-reasoning", label: "Grok 4.20", meta: "Rask & sterk" },
  { id: "grok-4-1-fast-reasoning", label: "Grok 4.1 Fast Reasoning", meta: "Ny & smart" },
  { id: "grok-4-1-fast-non-reasoning", label: "Grok 4.1 Fast", meta: "Svært rask" },
  { id: "grok-4-fast-reasoning", label: "Grok 4 Fast Reasoning", meta: "Rask analyse" },
  { id: "grok-4-fast-non-reasoning", label: "Grok 4 Fast", meta: "Lynrask" },
  { id: "grok-4-0709", label: "Grok 4 (0709)", meta: "Klassisk flagship" },
  { id: "grok-code-fast-1", label: "Grok Code Fast 1", meta: "Best til koding" },
  { id: "grok-3", label: "Grok 3", meta: "Balansert" },
  { id: "grok-3-mini", label: "Grok 3 Mini", meta: "Billig & rask" },
];

const MAX_HISTORY_MESSAGES = 40;

// ─── Components ──────────────────────────────────────────────
function MessageBubble({ msg, isUser }) {
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
          isUser ? "bg-neutral-800 border border-neutral-700" : "bg-emerald-600"
        }`}
      >
        {isUser ? (
          <UserIcon size={13} className="text-neutral-400" />
        ) : (
          <SparklesIcon size={13} className="text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-neutral-800 text-neutral-100 rounded-2xl rounded-tr-md border border-neutral-700/50"
            : "text-neutral-300"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
      </div>
    </div>
  );
}

const MemoizedMessage = React.memo(MessageBubble);

function LoadingDots() {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
        <SparklesIcon size={13} className="text-white" />
      </div>
      <div className="px-4 py-3 flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function SetupScreen({ onConfigure, initialWorkerUrl, onOpenMiniPrompt }) {
  const [apiKey, setApiKey] = useState("");
  const [workerUrl, setWorkerUrl] = useState(initialWorkerUrl || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim().startsWith("xai-")) {
      return setError('API-nøkkelen må starte med "xai-".');
    }
    if (!workerUrl.trim().startsWith("http")) {
      return setError("Worker-URL må starte med http:// eller https://");
    }
    setError("");
    onConfigure(apiKey.trim(), workerUrl.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(145deg, #0d0d0d 0%, #111 50%, #0a0f0d 100%)" }}>
      <div className="max-w-md w-full bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400 border border-emerald-500/20">
            <SparklesIcon size={28} />
          </div>
        </div>

        <h1 className="text-2xl text-center mb-1 tracking-tight text-neutral-100 font-bold">
          grok<span className="text-emerald-400">_pro</span>
        </h1>
        <p className="text-neutral-500 text-center mb-8 text-xs">Koble til din private proxy</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs text-neutral-500 ml-0.5">xAI API-Nøkkel</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                <KeyIcon size={14} />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="xai-..."
                className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs text-neutral-500 ml-0.5">Cloudflare Worker URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                <ServerIcon size={14} />
              </div>
              <input
                type="text"
                value={workerUrl}
                onChange={(e) => setWorkerUrl(e.target.value)}
                placeholder="https://grok-proxy.ditt.workers.dev"
                className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <AlertCircleIcon size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors text-sm mt-2"
          >
            Koble til
          </button>
        </form>

        {onOpenMiniPrompt && (
          <button
            type="button"
            onClick={onOpenMiniPrompt}
            className="w-full mt-4 text-xs text-neutral-500 hover:text-amber-300 transition-colors"
          >
            Eller åpne Mini-Prompt generator →
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsModal({ apiKey, workerUrl, systemPrompt, defaultSystemPrompt, onSave, onClose, onLogout }) {
  const [key, setKey] = useState(apiKey);
  const [url, setUrl] = useState(workerUrl);
  const [prompt, setPrompt] = useState(systemPrompt);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key.trim().startsWith("xai-")) return setError('API-nøkkelen må starte med "xai-".');
    if (!url.trim().startsWith("http")) return setError("Worker-URL må starte med http:// eller https://");
    setError("");
    onSave(key.trim(), url.trim(), prompt.trim());
  };

  const handleLogout = () => {
    if (window.confirm("Logg ut og fjerne API-nøkkel, worker-URL og instrukser fra denne enheten?")) {
      onLogout();
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Innstillinger"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 border border-emerald-500/20">
              <SettingsIcon size={16} />
            </div>
            <h2 className="text-base font-semibold text-neutral-100">Innstillinger</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Lukk"
            title="Lukk"
          >
            <XIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs text-neutral-500 ml-0.5">xAI API-Nøkkel</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                <KeyIcon size={14} />
              </div>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="xai-..."
                className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs text-neutral-500 ml-0.5">Cloudflare Worker URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                <ServerIcon size={14} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://grok-proxy.ditt.workers.dev"
                className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-0.5">
              <label className="block text-xs text-neutral-500">Egendefinert systeminstruks</label>
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  className="text-[10px] text-neutral-500 hover:text-amber-300 transition-colors"
                >
                  Tilbakestill til standard
                </button>
              )}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 4000))}
              placeholder={defaultSystemPrompt}
              rows={6}
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 transition-colors resize-y leading-relaxed"
              style={{ minHeight: "120px" }}
            />
            <div className="flex items-center justify-between ml-0.5">
              <p className="text-[10px] text-neutral-600">La stå tom for standardpersonaen. Tar effekt på neste melding.</p>
              <p className="text-[10px] text-neutral-600 tabular-nums">{prompt.length} / 4000</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <AlertCircleIcon size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Lagre
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            className="text-[11px] text-neutral-600 hover:text-red-400 transition-colors"
          >
            Logg ut og nullstill
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────
const getViewFromHash = () =>
  typeof window !== "undefined" && window.location.hash === "#mini-prompt" ? "mini" : "chat";

export default function App() {
  const [view, setView] = useState(getViewFromHash);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("xai_key") || "");
  const [workerUrl, setWorkerUrl] = useState(() => localStorage.getItem("worker_url") || "");
  const [isConfigured, setIsConfigured] = useState(!!localStorage.getItem("xai_key") && !!localStorage.getItem("worker_url"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem("selected_model") || "grok-4.20-beta-0309-non-reasoning");
  const [systemPrompt, setSystemPrompt] = useState(() => localStorage.getItem("system_prompt") || "");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const onHash = () => setView(getViewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goMini = useCallback(() => { window.location.hash = "mini-prompt"; }, []);
  const goChat = useCallback(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      setView("chat");
    }
  }, []);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Sync to localStorage
  useEffect(() => {
    if (apiKey && workerUrl) {
      localStorage.setItem("xai_key", apiKey);
      localStorage.setItem("worker_url", workerUrl);
      setIsConfigured(true);
    }
    localStorage.setItem("selected_model", selectedModel);
    if (systemPrompt) localStorage.setItem("system_prompt", systemPrompt);
    else localStorage.removeItem("system_prompt");
  }, [apiKey, workerUrl, selectedModel, systemPrompt]);

  const currentModel = useMemo(
    () => MODEL_OPTIONS.find((m) => m.id === selectedModel) || MODEL_OPTIONS[0],
    [selectedModel]
  );

  const handleConfigure = useCallback((key, url) => {
    setApiKey(key);
    setWorkerUrl(url);
  }, []);

  const resetSetup = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    localStorage.removeItem("xai_key");
    localStorage.removeItem("worker_url");
    localStorage.removeItem("system_prompt");
    setApiKey("");
    setWorkerUrl("");
    setSystemPrompt("");
    setIsConfigured(false);
    setMessages([]);
    setInput("");
    setError("");
    setIsLoading(false);
    setShowSettings(false);
  }, []);

  const handleSaveSettings = useCallback((nextKey, nextUrl, nextPrompt) => {
    setApiKey(nextKey);
    setWorkerUrl(nextUrl);
    setSystemPrompt(nextPrompt);
    setShowSettings(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError("");
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const activePrompt = systemPrompt.trim() || DEFAULT_SYSTEM_PROMPT;
      const payloadMessages = [
        { role: "system", content: activePrompt },
        ...updatedMessages.slice(-MAX_HISTORY_MESSAGES),
      ];
      const cleanUrl = workerUrl.replace(/\/$/, "");

      const response = await fetch(cleanUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: payloadMessages,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Feilkode: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data?.choices?.[0]?.message?.content;
      if (!botReply) throw new Error("Ugyldig svar fra API-et.");

      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
      setInput(trimmed);
      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, messages, workerUrl, apiKey, selectedModel, systemPrompt]);

  if (view === "mini") {
    return <MiniPrompt onBack={goChat} />;
  }

  if (!isConfigured) {
    return <SetupScreen onConfigure={handleConfigure} initialWorkerUrl={workerUrl} onOpenMiniPrompt={goMini} />;
  }

  return (
    <div className="h-screen flex flex-col text-neutral-100" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <header
        className="border-b border-neutral-800/80 px-4 py-3 flex justify-between items-center fixed top-0 w-full z-20"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
            <SparklesIcon size={16} />
          </div>
          <div className="flex flex-col">
            <div className="relative flex items-center">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-white text-sm outline-none cursor-pointer pr-5 hover:text-emerald-300 transition-colors"
                style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id} style={{ background: "#171717", color: "white" }}>
                    {m.label} · {m.meta}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                size={12}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
              />
            </div>
            <div
              className="flex items-center gap-1.5 text-emerald-500 tracking-widest uppercase mt-0.5"
              style={{ fontSize: "9px" }}
            >
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={goMini}
            className="text-neutral-500 hover:text-amber-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Mini-Prompt generator"
          >
            <WandIcon size={16} />
          </button>
          <button
            onClick={clearChat}
            className="text-neutral-500 hover:text-neutral-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Tøm chat"
          >
            <TrashIcon size={16} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-neutral-500 hover:text-neutral-300 p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Innstillinger"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 pt-20 pb-36" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-24 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/15">
                <SparklesIcon size={28} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg text-neutral-300">Hva tenker du på, Casper?</h2>
                <p className="text-neutral-600 text-xs mt-1">
                  {currentModel.label} · {currentModel.meta}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MemoizedMessage key={idx} msg={msg} isUser={msg.role === "user"} />
          ))}

          {isLoading && <LoadingDots />}

          {error && (
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20">
                <AlertCircleIcon size={14} />
                <span>{error}</span>
                <button
                  onClick={() => { setError(""); sendMessage(); }}
                  className="ml-2 text-red-300 hover:text-white transition-colors"
                  title="Prøv igjen"
                >
                  <RotateCcwIcon size={13} />
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="fixed bottom-0 w-full p-4 z-20 pointer-events-none">
        <div className="max-w-2xl mx-auto relative pointer-events-auto">
          <div
            className="absolute -inset-6 pointer-events-none -z-10"
            style={{ background: "linear-gradient(to top, #0a0a0a 60%, transparent)" }}
          />
          <div
            className="relative bg-neutral-900/90 border border-neutral-800 rounded-2xl transition-all focus-within:border-emerald-500/30"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Spør ${currentModel.label}...`}
              rows={1}
              className="w-full bg-transparent pl-4 pr-12 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none resize-none"
              style={{ minHeight: "48px", maxHeight: "200px", scrollbarWidth: "none" }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white rounded-lg transition-colors"
            >
              {isLoading ? <LoaderIcon size={14} className="animate-spin" /> : <SendIcon size={14} />}
            </button>
          </div>
          <p className="text-center mt-2 text-neutral-700 tracking-wide" style={{ fontSize: "9px" }}>
            {selectedModel} · proxy
          </p>
        </div>
      </footer>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          workerUrl={workerUrl}
          systemPrompt={systemPrompt}
          defaultSystemPrompt={DEFAULT_SYSTEM_PROMPT}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          onLogout={resetSetup}
        />
      )}
    </div>
  );
}
