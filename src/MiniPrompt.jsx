import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./MiniPrompt.css";

const STORAGE_KEY = "grok_mini_prompt_v3";
const HISTORY_KEY = "grok_mini_prompt_history_v3";
const MAX_HISTORY = 8;

const OPTIONS = {
  style: [
    ["Foto", "photorealistic, 8k resolution, highly detailed texture"],
    ["Cinematisk", "cinematic film still, high dynamic range, dramatic composition"],
    ["Anime", "anime style illustration, vibrant colors, clean lines"],
    ["3D Render", "detailed 3D digital render, octane render style"],
    ["Fantasy", "epic dark fantasy concept art, moody atmosphere"],
    ["Maleri", "oil painting style, visible brush strokes, painterly"],
    ["Skisse", "pencil sketch, hand-drawn, monochrome"],
    ["Pixel", "pixel art, 16-bit retro style"],
  ],
  lighting: [
    ["Gylden time", "golden hour lighting"],
    ["Neon", "neon cyberpunk illumination"],
    ["Dramatisk", "dramatic studio lighting, heavy contrast"],
    ["Naturlig", "soft natural overcast daylight"],
    ["Måneskinn", "moody moonlight, blue tones"],
    ["Volumetrisk", "volumetric god rays, light shafts"],
  ],
  mood: [
    ["Drømmende", "dreamy, ethereal atmosphere"],
    ["Mørk", "dark, ominous mood"],
    ["Lekent", "playful, whimsical vibe"],
    ["Episk", "epic, awe-inspiring scale"],
    ["Minimal", "minimalist, clean composition"],
  ],
  camera: [
    ["Nærbilde", "close-up shot, shallow depth of field"],
    ["Vidvinkel", "wide-angle lens, 24mm"],
    ["Portrett", "portrait shot, 85mm bokeh"],
    ["Drone", "aerial drone shot, top-down view"],
    ["Makro", "extreme macro photography"],
  ],
  quality: [
    ["Detaljert", "ultra-detailed, intricate details"],
    ["Skarp", "sharp focus, crystal clear"],
    ["Trending", "trending on artstation, masterpiece"],
    ["HDR", "HDR, vibrant tones"],
  ],
  aspect: [
    ["16:9", "--ar 16:9", 24, 14],
    ["9:16", "--ar 9:16", 14, 24],
    ["1:1", "--ar 1:1", 20, 20],
    ["4:3", "--ar 4:3", 22, 17],
  ],
};

const PRESETS = [
  { emoji: "✨", label: "Portrett", apply: { style: ["photorealistic, 8k resolution, highly detailed texture"], lighting: ["golden hour lighting"], camera: ["portrait shot, 85mm bokeh"], aspect: "--ar 9:16" } },
  { emoji: "🏔️", label: "Landskap", apply: { style: ["cinematic film still, high dynamic range, dramatic composition"], lighting: ["golden hour lighting"], camera: ["wide-angle lens, 24mm"], aspect: "--ar 16:9" } },
  { emoji: "🤖", label: "Cyberpunk", apply: { style: ["detailed 3D digital render, octane render style"], lighting: ["neon cyberpunk illumination"], mood: ["dark, ominous mood"], aspect: "--ar 16:9" } },
  { emoji: "🐉", label: "Fantasy", apply: { style: ["epic dark fantasy concept art, moody atmosphere"], lighting: ["volumetric god rays, light shafts"], mood: ["epic, awe-inspiring scale"], aspect: "--ar 16:9" } },
  { emoji: "🎨", label: "Anime", apply: { style: ["anime style illustration, vibrant colors, clean lines"], mood: ["playful, whimsical vibe"], aspect: "--ar 9:16" } },
  { emoji: "📐", label: "Logo", apply: { style: ["minimalist, clean composition"], quality: ["sharp focus, crystal clear"], aspect: "--ar 1:1" } },
];

const TOK_CLASS = {
  style: "mp-tok-style",
  lighting: "mp-tok-light",
  mood: "mp-tok-mood",
  camera: "mp-tok-camera",
  quality: "mp-tok-quality",
};

const EMPTY_STATE = {
  subject: "",
  style: [],
  lighting: [],
  mood: [],
  camera: [],
  quality: [],
  aspect: "",
  neg: { enabled: false, text: "" },
};

function loadInitialState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...EMPTY_STATE, ...stored, neg: { ...EMPTY_STATE.neg, ...(stored.neg || {}) } };
  } catch {
    return EMPTY_STATE;
  }
}

function loadInitialHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {}
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch {}
  document.body.removeChild(ta);
}

// ─── Icons ───
const I = {
  Back: () => <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>,
  Shuffle: () => <svg viewBox="0 0 24 24"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  Share: () => <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>,
  Check: () => <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

export default function MiniPrompt({ onBack }) {
  const [state, setState] = useState(loadInitialState);
  const [history, setHistory] = useState(loadInitialHistory);
  const [toast, setToast] = useState({ text: "", show: false });
  const toastTimerRef = useRef(null);

  // Persist state
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Build prompt + segments for highlighted preview
  const built = useMemo(() => {
    const parts = [];
    const segments = [];
    const sub = state.subject.trim();
    if (sub) {
      segments.push({ cls: "mp-tok-subject", text: sub });
      parts.push(sub);
    }
    for (const key of Object.keys(TOK_CLASS)) {
      if (state[key].length) {
        const joined = state[key].join(", ");
        segments.push({ cls: TOK_CLASS[key], text: joined });
        parts.push(joined);
      }
    }
    let plain = parts.join(", ");
    const aspect = state.aspect || "";
    if (aspect) plain += (plain ? " " : "") + aspect;
    const negText = state.neg.enabled ? state.neg.text.trim() : "";
    if (negText) plain += " --no " + negText;
    return { plain, segments, aspect, negText };
  }, [state]);

  const showToast = useCallback((text) => {
    setToast({ text, show: true });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      1800
    );
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const pushHistory = useCallback((prompt) => {
    if (!prompt) return;
    setHistory((prev) => {
      const next = [prompt, ...prev.filter((p) => p !== prompt)].slice(0, MAX_HISTORY);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const copyPrompt = useCallback(
    async (textOverride) => {
      const text = textOverride ?? built.plain;
      if (!text) return;
      await copyToClipboard(text);
      showToast("Kopiert!");
      pushHistory(text);
    },
    [built.plain, showToast, pushHistory]
  );

  const sharePrompt = useCallback(async () => {
    if (!built.plain) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Grok Mini-Prompt", text: built.plain });
        pushHistory(built.plain);
        return;
      } catch {
        // user cancelled or share failed → fall back to copy
      }
    }
    copyPrompt();
  }, [built.plain, copyPrompt, pushHistory]);

  const resetAll = useCallback(() => {
    setState(EMPTY_STATE);
    showToast("Nullstilt");
  }, [showToast]);

  const randomize = useCallback(() => {
    const pickVal = (arr) => arr[Math.floor(Math.random() * arr.length)][1];
    const maybe = (arr, p) => (Math.random() < p ? [pickVal(arr)] : []);
    setState((s) => ({
      ...s,
      style: [pickVal(OPTIONS.style)],
      lighting: [pickVal(OPTIONS.lighting)],
      mood: maybe(OPTIONS.mood, 0.6),
      camera: maybe(OPTIONS.camera, 0.5),
      quality: [pickVal(OPTIONS.quality)],
      aspect: pickVal(OPTIONS.aspect),
    }));
    showToast("Tilfeldig miks!");
  }, [showToast]);

  const applyPreset = useCallback(
    (preset) => {
      setState((s) => ({
        ...s,
        style: preset.apply.style ? [...preset.apply.style] : [],
        lighting: preset.apply.lighting ? [...preset.apply.lighting] : [],
        mood: preset.apply.mood ? [...preset.apply.mood] : [],
        camera: preset.apply.camera ? [...preset.apply.camera] : [],
        quality: preset.apply.quality ? [...preset.apply.quality] : [],
        aspect: preset.apply.aspect || "",
      }));
      showToast(`${preset.label} brukt`);
    },
    [showToast]
  );

  const toggleChip = useCallback((group, value) => {
    setState((s) => {
      const arr = s[group];
      const idx = arr.indexOf(value);
      const next = idx > -1 ? arr.filter((_, i) => i !== idx) : [...arr, value];
      return { ...s, [group]: next };
    });
  }, []);

  const toggleAspect = useCallback((value) => {
    setState((s) => ({ ...s, aspect: s.aspect === value ? "" : value }));
  }, []);

  // Cmd/Ctrl+Enter to copy
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        copyPrompt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copyPrompt]);

  const hasPrompt = built.plain.length > 0;

  return (
    <div className="mp-root">
      <div className="mp-shell">
        <div className="mp-topbar">
          <div className="mp-brand">
            {onBack && (
              <button
                type="button"
                className="mp-icon-btn"
                onClick={onBack}
                aria-label="Tilbake til chat"
                title="Tilbake"
              >
                <I.Back />
              </button>
            )}
            <div className="mp-brand-mark">G</div>
            <div className="mp-brand-text">
              <span className="mp-brand-title">Mini-Prompt</span>
              <span className="mp-brand-sub">Casper · v3.0</span>
            </div>
          </div>
          <div className="mp-topbar-actions">
            <button type="button" className="mp-icon-btn" onClick={randomize} aria-label="Tilfeldig prompt" title="Tilfeldig">
              <I.Shuffle />
            </button>
            <button type="button" className="mp-icon-btn" onClick={resetAll} aria-label="Nullstill alt" title="Nullstill">
              <I.Trash />
            </button>
          </div>
        </div>

        <div className="mp-card">
          {/* Presets */}
          <div className="mp-section">
            <div className="mp-section-head"><span className="mp-label">Maler</span></div>
            <div className="mp-preset-row" role="toolbar" aria-label="Maler">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="mp-preset"
                  onClick={() => applyPreset(p)}
                >
                  <span className="mp-preset-emoji" aria-hidden="true">{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="mp-section">
            <div className="mp-section-head">
              <span className="mp-label">Motiv</span>
              <span className="mp-label-counter">{state.subject.length}</span>
            </div>
            <textarea
              className="mp-input"
              rows={2}
              maxLength={500}
              placeholder="Hva vil du lage? F.eks: En rev som drikker te i et bibliotek..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={state.subject}
              onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
            />
          </div>

          {/* Style / Lighting */}
          <ChipGroup
            label="Stil"
            group="style"
            options={OPTIONS.style}
            selected={state.style}
            onToggle={toggleChip}
          />
          <ChipGroup
            label="Lys"
            group="lighting"
            options={OPTIONS.lighting}
            selected={state.lighting}
            onToggle={toggleChip}
          />

          {/* Aspect */}
          <div className="mp-section">
            <div className="mp-section-head"><span className="mp-label">Format</span></div>
            <div className="mp-aspects" role="radiogroup" aria-label="Sideforhold">
              {OPTIONS.aspect.map(([label, value, w, h]) => {
                const active = state.aspect === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className="mp-aspect"
                    role="radio"
                    aria-checked={active}
                    aria-pressed={active}
                    onClick={() => toggleAspect(value)}
                  >
                    <span className="mp-aspect-glyph" style={{ width: w, height: h }} />
                    <span className="mp-aspect-label">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced */}
          <details className="mp-details">
            <summary>Avansert</summary>
            <ChipGroup label="Stemning" group="mood" options={OPTIONS.mood} selected={state.mood} onToggle={toggleChip} />
            <ChipGroup label="Kamera" group="camera" options={OPTIONS.camera} selected={state.camera} onToggle={toggleChip} />
            <ChipGroup label="Kvalitet" group="quality" options={OPTIONS.quality} selected={state.quality} onToggle={toggleChip} />
            <div className="mp-section">
              <label className="mp-neg-toggle">
                <input
                  type="checkbox"
                  checked={state.neg.enabled}
                  onChange={(e) =>
                    setState((s) => ({ ...s, neg: { ...s.neg, enabled: e.target.checked } }))
                  }
                />
                <span className="mp-switch" aria-hidden="true" />
                <span>Inkluder negativ prompt</span>
              </label>
              {state.neg.enabled && (
                <textarea
                  className="mp-input mp-neg-input"
                  rows={2}
                  placeholder="Ting å unngå: blurry, watermark, deformed..."
                  value={state.neg.text}
                  onChange={(e) =>
                    setState((s) => ({ ...s, neg: { ...s.neg, text: e.target.value } }))
                  }
                />
              )}
            </div>
          </details>

          {/* Output */}
          <div className="mp-output-wrap">
            <div className="mp-output-head">
              <span className="mp-label">Ferdig prompt</span>
              <span className="mp-label-counter">{built.plain.length} tegn</span>
            </div>
            {hasPrompt ? (
              <div className="mp-output" aria-live="polite">
                {built.segments.map((seg, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="mp-tok-sep">, </span>}
                    <span className={seg.cls}>{seg.text}</span>
                  </React.Fragment>
                ))}
                {built.aspect && (
                  <>
                    {" "}<span className="mp-tok-aspect">{built.aspect}</span>
                  </>
                )}
                {built.negText && (
                  <>
                    {" "}<span className="mp-tok-neg">--no {built.negText}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="mp-output mp-empty" aria-live="polite">
                Velg en mal eller skriv et motiv for å starte…
              </div>
            )}
          </div>

          <div className="mp-actions">
            <button
              type="button"
              className="mp-btn mp-btn-primary"
              onClick={() => copyPrompt()}
              disabled={!hasPrompt}
            >
              <I.Copy /> Kopier prompt
            </button>
            <button
              type="button"
              className="mp-btn mp-btn-ghost"
              onClick={sharePrompt}
              disabled={!hasPrompt}
              aria-label="Del"
              title="Del"
            >
              <I.Share />
            </button>
          </div>

          {/* History */}
          <details className="mp-details">
            <summary>Nylige</summary>
            <div className="mp-section">
              <div className="mp-history-list">
                {history.length === 0 ? (
                  <div className="mp-history-empty">Ingen prompts ennå.</div>
                ) : (
                  history.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      className="mp-history-item"
                      title="Klikk for å kopiere"
                      onClick={() => copyPrompt(p)}
                    >
                      <span className="mp-history-text">{p}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className={`mp-toast${toast.show ? " mp-show" : ""}`} role="status" aria-live="polite">
        <I.Check />
        <span>{toast.text || "Kopiert!"}</span>
      </div>
    </div>
  );
}

function ChipGroup({ label, group, options, selected, onToggle }) {
  return (
    <div className="mp-section">
      <div className="mp-section-head"><span className="mp-label">{label}</span></div>
      <div className="mp-chips" role="group" aria-label={label}>
        {options.map(([lbl, value]) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              className="mp-chip"
              aria-pressed={active}
              onClick={() => onToggle(group, value)}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}
