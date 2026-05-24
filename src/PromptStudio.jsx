import React, { useState, useRef, useEffect, useCallback } from "react";

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
  const [status, setStatusState] = useState({ msg: "Klar til å chillern grillern.", type: "" });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  });

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
    setStatus("Alt tømt", "warn");
  }, [setStatus]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    setStatus("Historikk tømt", "warn");
  }, [setStatus]);

  return (
    <div className="studio-root">
      <div className="studio-container">
        <header className="studio-header">
          <div>
            <h1 className="studio-title">
              Grok Prompt Studio <span style={{ color: "var(--studio-accent)", fontWeight: 300 }}>Pro v4</span>
            </h1>
            <p className="studio-subtitle">Detaljert prompt-bygger med tags, kamera-presets og randomisering.</p>
          </div>
        </header>

        <div className="studio-card">
          <h2 className="studio-h2">1. Motiv & Basis</h2>

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
            <button className="studio-btn studio-btn-ghost" onClick={handleRandomize}>Tilfeldig</button>
            <button className="studio-btn studio-btn-ghost" onClick={clearAll} style={{ marginLeft: "auto" }}>Tøm alt</button>
          </div>
        </div>

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
