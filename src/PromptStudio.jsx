import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────
const PROXY_URL = "https://grokekte.datman123.workers.dev/";

const TAGS = [
  "grainy", "analog noise", "caught off guard", "candid", "messy framing",
  "hyper realistic", "cinematic color grading", "flash burn", "motion blur",
  "polaroid effect", "streetwear aesthetic", "moody atmosphere", "intricate details",
  "unfiltered", "raw authenticity", "editorial fashion", "dutch angle"
];

const CAMERA_OPTIONS = [
  { value: "raw smartphone photo, iPhone 15 Pro Max", label: "Mobil / Rå" },
  { value: "shot on 35mm lens, DSLR photography", label: "35mm DSLR" },
  { value: "shot on 85mm portrait lens, shallow depth of field", label: "85mm Portrett" },
  { value: "CCTV security camera footage, grainy", label: "CCTV overvåkning" },
  { value: "disposable camera flash photography", label: "Engangskamera" },
  { value: "cinematic anamorphic lens, 70mm film", label: "Cinematisk" },
];

const SHOT_OPTIONS = [
  { value: "medium shot", label: "Medium (Halvfigur)" },
  { value: "close-up portrait", label: "Close-up (Nær)" },
  { value: "wide establishing shot", label: "Wide (Miljø)" },
  { value: "selfie angle", label: "Selfie / POV" },
  { value: "low angle dynamic shot", label: "Froskeperspektiv" },
];

const POSE_OPTIONS = [
  { value: "", label: "-- Valgfritt --" },
  { value: "standing naturally", label: "Stående" },
  { value: "sitting casually, relaxed posture", label: "Sittende avslappet" },
  { value: "leaning against a wall", label: "Lener seg mot vegg" },
  { value: "walking towards the camera", label: "Gående mot deg" },
  { value: "looking over the shoulder", label: "Ser over skulder" },
  { value: "dynamic mid-action pose", label: "Dynamisk bevegelse" },
  { value: "crouching low", label: "På huk" },
];

const LIGHTING_OPTIONS = [
  { value: "harsh direct camera flash", label: "Direkte Blits" },
  { value: "soft golden hour natural light", label: "Golden Hour" },
  { value: "neon cyberpunk street lighting", label: "Neon Cyberpunk" },
  { value: "moody cinematic shadows, chiaroscuro", label: "Moody dramatiske skygger" },
  { value: "flat overcast daylight", label: "Overskyet / Flat" },
];

const AR_OPTIONS = [
  { value: "--ar 16:9", label: "16:9" },
  { value: "--ar 9:16", label: "9:16" },
  { value: "--ar 1:1", label: "1:1" },
  { value: "--ar 21:9", label: "21:9" },
];

const HISTORY_KEY = "grok_history_v4";

// ─── Helpers ───────────────────────────────────────────────
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function compressImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width, height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Sub-components ──────────────────────────────────────────
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="studio-label">{label}</label>
      <select className="studio-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Slider({ label, value, onChange, min = 1, max = 10 }) {
  return (
    <div className="studio-slider-container">
      <div className="studio-slider-header">
        <span>{label}</span>
        <span className="studio-slider-val">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function PromptStudio() {
  const [subject, setSubject] = useState("");
  const [camera, setCamera] = useState(CAMERA_OPTIONS[0].value);
  const [shot, setShot] = useState(SHOT_OPTIONS[0].value);
  const [pose, setPose] = useState("");
  const [lighting, setLighting] = useState(LIGHTING_OPTIONS[0].value);
  const [location, setLocation] = useState("");
  const [negative, setNegative] = useState("ai look, plastic skin, overly smooth, perfect symmetry");
  const [ar, setAr] = useState(AR_OPTIONS[0].value);
  const [activeTags, setActiveTags] = useState(new Set());
  const [detail, setDetail] = useState(8);
  const [style, setStyle] = useState(6);
  const [chaos, setChaos] = useState(2);
  const [output, setOutput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [status, setStatusState] = useState({ msg: "Klar til å chillern grillern.", type: "" });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const fileInputRef = useRef(null);
  const statusTimeoutRef = useRef(null);

  const charCount = output.length;
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  const setStatus = useCallback((msg, type = "ok") => {
    setStatusState({ msg, type });
    clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatusState((s) => ({ ...s, type: "" })), 3000);
  }, []);

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }, []);

  const saveToHistory = useCallback((promptStr) => {
    setHistory((prev) => {
      if (!promptStr || prev[0] === promptStr) return prev;
      const next = [promptStr, ...prev].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const buildPrompt = useCallback(() => {
    const parts = [];
    parts.push(subject.trim() || "A striking and captivating subject");
    parts.push(shot);
    parts.push(camera);
    if (pose) parts.push(pose);
    parts.push(lighting);
    if (location.trim()) parts.push(`set in ${location.trim()}`);
    if (activeTags.size > 0) parts.push([...activeTags].join(", "));
    parts.push(`detail level ${detail}/10`);
    parts.push(`stylization ${style}/10`);
    if (chaos > 4) parts.push(`creative weirdness ${chaos}/10`);

    let finalStr = parts.filter(Boolean).join(", ");
    finalStr += ` ${ar}`;
    const neg = negative.trim();
    if (neg) finalStr += ` --no ${neg}`;

    setOutput(finalStr);
    setStatus("Prompt generert suksessfullt!", "ok");
    saveToHistory(finalStr);
    return finalStr;
  }, [subject, shot, camera, pose, lighting, location, activeTags, detail, style, chaos, ar, negative, setStatus, saveToHistory]);

  const copyToClipboard = useCallback(() => {
    if (!output) return setStatus("Ingenting å kopiere", "warn");
    navigator.clipboard.writeText(output).then(() => setStatus("Kopiert til utklippstavle!", "ok"));
  }, [output, setStatus]);

  const sendToWorker = useCallback(async () => {
    const promptText = output || buildPrompt();
    if (!promptText) return;
    setApiOutput("Sender request til Worker...");
    setStatus("Venter på proxy...", "warn");

    try {
      const res = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, source: "grok-prompt-studio-pro", timestamp: Date.now() }),
      });
      const data = await res.text();
      try { setApiOutput(JSON.stringify(JSON.parse(data), null, 2)); } catch { setApiOutput(data); }
      if (res.ok) setStatus("Suksess fra API!", "ok");
      else setStatus(`Feilkode: ${res.status}`, "err");
    } catch (err) {
      setApiOutput(`Feil:\n${err.message}`);
      setStatus("Kunne ikke koble til Worker", "err");
    }
  }, [output, buildPrompt, setStatus]);

  const randomizeAll = useCallback(() => {
    const randFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setCamera(randFrom(CAMERA_OPTIONS).value);
    setShot(randFrom(SHOT_OPTIONS).value);
    setPose(randFrom(POSE_OPTIONS).value);
    setLighting(randFrom(LIGHTING_OPTIONS).value);
    setDetail(Math.floor(Math.random() * 6) + 5);
    setStyle(Math.floor(Math.random() * 10) + 1);
    setChaos(Math.floor(Math.random() * 10) + 1);
    setAr(randFrom(AR_OPTIONS).value);

    const shuffled = [...TAGS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
    setActiveTags(new Set(selected));
  }, []);

  // Build prompt after randomize (need to wait for state updates)
  const [shouldBuild, setShouldBuild] = useState(false);
  const handleRandomize = useCallback(() => {
    randomizeAll();
    setShouldBuild(true);
  }, [randomizeAll]);

  useEffect(() => {
    if (shouldBuild) {
      buildPrompt();
      setStatus("Randomisert!", "ok");
      setShouldBuild(false);
    }
  }, [shouldBuild, buildPrompt, setStatus]);

  const clearAll = useCallback(() => {
    setSubject("");
    setLocation("");
    setOutput("");
    setApiOutput("");
    setCamera(CAMERA_OPTIONS[0].value);
    setShot(SHOT_OPTIONS[0].value);
    setPose("");
    setLighting(LIGHTING_OPTIONS[0].value);
    setAr(AR_OPTIONS[0].value);
    setNegative("ai look, plastic skin, overly smooth, perfect symmetry");
    setDetail(8);
    setStyle(6);
    setChaos(2);
    setActiveTags(new Set());
    setImageBase64(null);
    setImagePreviewUrl("");
    setStatus("Alt tømt", "warn");
  }, [setStatus]);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target?.files?.[0] || e;
    if (!file) return;
    setStatus("Komprimerer bilde...", "warn");
    const compressed = await compressImage(file);
    setImageBase64(compressed.split(",")[1]);
    setImagePreviewUrl(compressed);
    setStatus("Bilde klart for analyse.", "ok");
  }, [setStatus]);

  const clearImage = useCallback(() => {
    setImageBase64(null);
    setImagePreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!imageBase64) return setStatus("Du må laste opp et bilde først.", "warn");
    setAnalyzing(true);
    setStatus("Sender til AI...", "warn");

    const payload = {
      contents: [{
        role: "user",
        parts: [
          { text: "Analyze this image and write a detailed text prompt to generate a similar image in an AI generator. Focus on subject, colors, mood, lighting. Write in English." },
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
        ],
      }],
    };

    try {
      let response = null, success = false;
      const delays = [1000, 2000, 4000];
      for (let i = 0; i < 3; i++) {
        try {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`,
            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
          );
          if (response.ok) { success = true; break; }
        } catch {}
        if (!success && i < 2) await sleep(delays[i]);
      }
      if (!success || !response) throw new Error("API utilgjengelig etter forsøk.");
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        setSubject(aiText.trim());
        setStatus("Bilde analysert!", "ok");
      } else throw new Error("Ingen tekst i respons.");
    } catch {
      setStatus("Klarte ikke å analysere bildet.", "err");
    } finally {
      setAnalyzing(false);
    }
  }, [imageBase64, setStatus]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    setStatus("Historikk tømt", "warn");
  }, [setStatus]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("studio-dragover");
    if (e.dataTransfer.files?.length > 0) handleImageUpload({ target: { files: e.dataTransfer.files } });
  }, [handleImageUpload]);

  return (
    <div className="studio-root">
      <div className="studio-container">
        {/* Header */}
        <header className="studio-header">
          <div>
            <h1 className="studio-title">
              Grok Prompt Studio <span style={{ color: "var(--studio-accent)", fontWeight: 300 }}>Pro v4</span>
            </h1>
            <p className="studio-subtitle">Optimalisert prompt-bygger med bildekomprimering og debouncing.</p>
          </div>
        </header>

        {/* LEFT COLUMN: CONTROLS */}
        <div className="studio-card">
          {/* Image Upload */}
          <div className="studio-image-section">
            <label className="studio-label" style={{ color: "var(--studio-accent)" }}>
              Gjør bilde om til prompt (Image-to-Text)
            </label>

            {!imagePreviewUrl ? (
              <div
                className="studio-dropzone"
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("studio-dragover"); }}
                onDragLeave={(e) => e.currentTarget.classList.remove("studio-dragover")}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <div className="studio-dropzone-content">
                  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--studio-text-muted)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span style={{ fontWeight: 500 }}>Klikk eller dra bilde hit</span>
                  <span style={{ fontSize: "11px", color: "var(--studio-text-muted)" }}>Skaleres ned automatisk for lynrask analyse</span>
                </div>
              </div>
            ) : (
              <div className="studio-preview-container">
                <button className="studio-btn-remove" onClick={clearImage} title="Fjern bilde">&times;</button>
                <img src={imagePreviewUrl} alt="Preview" className="studio-preview-img" />
                <button className="studio-btn studio-btn-primary" onClick={analyzeImage} disabled={analyzing} style={{ width: "100%", marginTop: "12px" }}>
                  {analyzing && <span className="studio-loader" />}
                  <span>{analyzing ? "Analyserer..." : "Analyser bilde med AI"}</span>
                </button>
              </div>
            )}
          </div>

          <h2 className="studio-h2" style={{ marginTop: "24px" }}>1. Motiv & Basis</h2>

          <div className="studio-section">
            <label className="studio-label">Hovedmotiv / Idé</label>
            <textarea
              className="studio-input studio-textarea"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Eksempel: En fyr som sitter og chillern grillern i parken, drikker kaffe, solnedgang, avslappet stemning..."
            />
          </div>

          <div className="studio-section">
            <label className="studio-label">Format (Aspect Ratio)</label>
            <div className="studio-ar-selector">
              {AR_OPTIONS.map((opt) => (
                <div key={opt.value} className="studio-ar-option">
                  <input type="radio" name="ar" id={`ar-${opt.label}`} value={opt.value} checked={ar === opt.value} onChange={() => setAr(opt.value)} />
                  <label htmlFor={`ar-${opt.label}`}>{opt.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="studio-grid-3">
            <SelectField label="Kamera / Linse" value={camera} onChange={setCamera} options={CAMERA_OPTIONS} />
            <SelectField label="Utsnitt (Shot)" value={shot} onChange={setShot} options={SHOT_OPTIONS} />
            <SelectField label="Positur" value={pose} onChange={setPose} options={POSE_OPTIONS} />
          </div>

          <div className="studio-grid-2" style={{ marginTop: "16px" }}>
            <SelectField label="Lyssattning" value={lighting} onChange={setLighting} options={LIGHTING_OPTIONS} />
            <div>
              <label className="studio-label">Miljø / Lokasjon</label>
              <input
                type="text"
                className="studio-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="F.eks: downtown Oslo, cozy cafe"
              />
            </div>
          </div>

          <h2 className="studio-h2" style={{ marginTop: "24px" }}>2. Stil & Modifikatorer</h2>

          <div className="studio-section">
            <label className="studio-label">Style Tags</label>
            <div className="studio-tags">
              {TAGS.map((tag) => (
                <div
                  key={tag}
                  className={`studio-tag ${activeTags.has(tag) ? "active" : ""}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="studio-grid-3">
            <Slider label="Detaljnivå" value={detail} onChange={setDetail} />
            <Slider label="Stylisering" value={style} onChange={setStyle} />
            <Slider label="Kaos / Weird" value={chaos} onChange={setChaos} />
          </div>

          <div className="studio-section" style={{ marginTop: "16px" }}>
            <label className="studio-label">Negative Prompt</label>
            <input
              type="text"
              className="studio-input"
              value={negative}
              onChange={(e) => setNegative(e.target.value)}
              placeholder="F.eks: ai look, plastic skin..."
            />
          </div>

          <div className="studio-btn-group">
            <button className="studio-btn studio-btn-primary" onClick={buildPrompt}>Bygg Prompt</button>
            <button className="studio-btn studio-btn-secondary" onClick={copyToClipboard}>Kopier Tekst</button>
            <button className="studio-btn studio-btn-secondary" onClick={sendToWorker}>Send til Proxy</button>
            <button className="studio-btn studio-btn-ghost" onClick={handleRandomize}>Tilfeldig</button>
            <button className="studio-btn studio-btn-ghost" onClick={clearAll} style={{ marginLeft: "auto" }}>Tøm alt</button>
          </div>
        </div>

        {/* RIGHT COLUMN: OUTPUT & HISTORY */}
        <div>
          <div className="studio-card" style={{ marginBottom: "24px" }}>
            <h2 className="studio-h2">3. Resultat</h2>
            <div className="studio-section">
              <textarea
                className="studio-input studio-output-area"
                value={output}
                readOnly
                placeholder="Trykk 'Bygg Prompt' for å generere..."
              />
            </div>

            <div className="studio-status-bar">
              <div className={`studio-status-msg ${status.type}`}>{status.msg}</div>
              <div className="studio-stats">
                <div>Tegn: <span>{charCount}</span></div>
                <div>Ord: <span>{wordCount}</span></div>
              </div>
            </div>

            <div className="studio-section" style={{ marginTop: "24px" }}>
              <label className="studio-label">API Respons (Worker)</label>
              <textarea
                className="studio-input"
                style={{ minHeight: "80px", fontFamily: "monospace", fontSize: "12px" }}
                value={apiOutput}
                readOnly
                placeholder="Venter..."
              />
              <div style={{ fontSize: "11px", color: "var(--studio-text-muted)", marginTop: "6px" }}>
                Proxy: {PROXY_URL}
              </div>
            </div>
          </div>

          <div className="studio-card">
            <h2 className="studio-h2">
              Historikk (Siste 5)
              <button className="studio-btn studio-btn-ghost" onClick={clearHistory} style={{ padding: "2px 6px", fontSize: "11px", borderRadius: "4px" }}>
                Tøm
              </button>
            </h2>
            <div className="studio-history-list">
              {history.length === 0 ? (
                <div style={{ color: "var(--studio-text-muted)", fontSize: "13px" }}>Ingen historikk enda.</div>
              ) : (
                history.map((str, i) => (
                  <div
                    key={i}
                    className="studio-history-item"
                    onClick={() => { setOutput(str); setStatus("Hentet", "ok"); }}
                  >
                    {str}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
