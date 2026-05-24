// Bilingual chip dataset.
//  - `no` / `en`: display label per language
//  - `prompt`: English fragment sent to the model (always English; the model wants English)
export const DATA = {
  subject: [
    { no: "Person", en: "Person", prompt: "A detailed portrait of a person" },
    { no: "Landskap", en: "Landscape", prompt: "A vast landscape" },
    { no: "Nordlys", en: "Aurora", prompt: "Shimmering green aurora borealis swirling in the night sky" },
    { no: "Vikingkriger", en: "Viking warrior", prompt: "A rugged Viking warrior with a braided beard and worn iron armor" },
    { no: "Norsk fjord", en: "Norwegian fjord", prompt: "A majestic Norwegian fjord with steep green mountains and deep blue waters" },
    { no: "Hytte i fjellet", en: "Mountain cabin", prompt: "A cozy wooden mountain cabin with a grass roof and warm glowing windows" },
    { no: "Lofoten", en: "Lofoten", prompt: "Lofoten islands with red fisherman cabins (rorbuer) and dramatic snow-capped peaks" },
    { no: "Midnattsol", en: "Midnight sun", prompt: "The golden-orange light of the midnight sun casting long dramatic shadows" },
    { no: "Cyberpunk By", en: "Cyberpunk city", prompt: "A rain-slicked cyberpunk metropolis with glowing neon signs and holograms" },
    { no: "Fremtidsromskip", en: "Spaceship", prompt: "A sleek sci-fi spaceship navigating through a colorful cosmic nebula" },
    { no: "Fantasy Skog", en: "Fantasy forest", prompt: "An enchanted fantasy forest filled with bioluminescent mushrooms and ancient mossy trees" },
    { no: "Søt rev", en: "Cute fox", prompt: "A cute fluffy arctic fox playing in deep crisp snow" }
  ],
  outfit: [
    { no: "Leather leotard", en: "Leather leotard", prompt: "wearing an extremely tight shiny black leather leotard with a deep plunging neckline and high-cut legs that barely covers anything" },
    { no: "Micro bikini", en: "Micro bikini", prompt: "wearing a tiny micro bikini with thin strings that barely covers her nipples and pussy lips" },
    { no: "Leather leggings", en: "Leather leggings", prompt: "wearing skin-tight glossy black leather leggings with a matching strappy leather bra" },
    { no: "Latex bodysuit", en: "Latex bodysuit", prompt: "wearing a super tight glossy black latex bodysuit that clings to every curve like a second skin" },
    { no: "Fishnet outfit", en: "Fishnet outfit", prompt: "wearing sheer black fishnet stockings and a revealing fishnet top with nothing underneath" },
    { no: "Crop top & thong", en: "Crop top & thong", prompt: "wearing a tiny crop top and a thin thong that disappears between her ass cheeks" },
    { no: "Leather harness", en: "Leather harness", prompt: "wearing only a black leather harness that frames her breasts and pussy with nothing else on" },
    { no: "Wetlook latex", en: "Wetlook latex", prompt: "wearing shiny wet-look black latex with oil glistening on her skin" },
    { no: "Sheer lingerie", en: "Sheer lingerie", prompt: "wearing completely sheer see-through black lingerie that hides almost nothing" },
    { no: "Pasties & thong", en: "Pasties & thong", prompt: "wearing only nipple pasties and a tiny thong, otherwise completely naked" }
  ],
  style: [
    { no: "Fotorealistisk", en: "Photorealistic", prompt: "ultra-photorealistic, 8k resolution, highly detailed texture" },
    { no: "Cinematisk", en: "Cinematic", prompt: "cinematic film still, high dynamic range, theatrical composition" },
    { no: "Anime/Manga", en: "Anime / Manga", prompt: "vibrant anime style illustration, crisp lines, rich colors" },
    { no: "3D Digital", en: "3D digital", prompt: "detailed 3D digital render, Octane render style, clean geometry" },
    { no: "Akvarell", en: "Watercolor", prompt: "soft watercolor painting with elegant paint splatters and wet-on-wet technique" },
    { no: "Oljemaling", en: "Oil painting", prompt: "textured oil on canvas, visible expressive impasto brushstrokes" },
    { no: "Minimalistisk", en: "Minimalist", prompt: "clean minimalist design, empty space, striking central focus" },
    { no: "Konseptkunst", en: "Concept art", prompt: "dark moody concept art, epic masterwork digital painting" },
    { no: "Retro 80-talls", en: "Retro 80s", prompt: "80s synthwave aesthetic, neon grids, retrofuturistic vaporwave look" },
    { no: "Ukiyo-e", en: "Ukiyo-e", prompt: "traditional Japanese woodblock print style, elegant line art" }
  ],
  lighting: [
    { no: "Gylden time", en: "Golden hour", prompt: "warm golden hour lighting, soft long shadows" },
    { no: "Dramatisk studio", en: "Dramatic studio", prompt: "dramatic studio lighting, low-key Chiaroscuro with deep contrast" },
    { no: "Neon/Cyber", en: "Neon / Cyber", prompt: "cyberpunk cyber-neon illumination, pink and cyan glowing highlights" },
    { no: "Naturlig dagslys", en: "Natural daylight", prompt: "bright natural overcast daylight, soft diffuse shadows" },
    { no: "Volumetrisk lys", en: "Volumetric light", prompt: "volumetric light beams, sun rays filtering through haze" },
    { no: "Baklys", en: "Backlight", prompt: "strong backlighting, golden rim light framing the subject" },
    { no: "Vinduslys", en: "Window light", prompt: "soft side lighting shining through an old window pane" },
    { no: "Mørkt & Dystert", en: "Dark & moody", prompt: "moody dim lighting, heavy shadows, mysterious ambiance" }
  ],
  camera: [
    { no: "85mm portrett", en: "85mm portrait", prompt: "shot on 85mm lens, shallow depth of field, creamy bokeh background" },
    { no: "Vidvinkel (Wide)", en: "Wide-angle", prompt: "wide-angle lens capture, epic scale, expansive perspective" },
    { no: "Makro (Nærbilde)", en: "Macro (closeup)", prompt: "extreme macro closeup shot, microscopic crisp detail" },
    { no: "Dronefoto", en: "Drone shot", prompt: "aerial drone photography, high-altitude top-down perspective" },
    { no: "Analog 35mm", en: "Analog 35mm", prompt: "vintage 35mm film photography, subtle grain, warm nostalgic tones, Kodachrome" },
    { no: "GoPro POV", en: "GoPro POV", prompt: "action cam first-person perspective, immersive fish-eye distortion" },
    { no: "Hasselblad", en: "Hasselblad", prompt: "medium format Hasselblad look, incredible sharpness, premium studio quality" }
  ],
  color: [
    { no: "Varme farger", en: "Warm colors", prompt: "warm color palette, cozy ambers, rich oranges and reds" },
    { no: "Kalde toner", en: "Cool tones", prompt: "cool color temperature, icy blues, deep teals, clean whites" },
    { no: "Svart/Hvitt", en: "Black & white", prompt: "timeless high-contrast monochrome, dramatic black and white film style" },
    { no: "Pastell", en: "Pastel", prompt: "soft muted pastel color scheme, gentle pinks, lavenders, and mints" },
    { no: "Sterk kontrast", en: "High contrast", prompt: "hyper-saturated vibrant colors, bold color blocks, extreme pop" },
    { no: "Vintage fargetoner", en: "Vintage tones", prompt: "faded vintage color grading, muted greens, warm sepia, retro undertones" },
    { no: "Dystopisk grå", en: "Dystopian gray", prompt: "desaturated industrial color palette, gritty steel-greys and dark greens" }
  ],
  mood: [
    { no: "Episk", en: "Epic", prompt: "epic scale, awe-inspiring atmosphere, sense of great wonder" },
    { no: "Melankolsk", en: "Melancholic", prompt: "somber melancholic mood, quiet loneliness, reflective atmosphere" },
    { no: "Fredelig", en: "Peaceful", prompt: "serene peaceful ambiance, calm tranquil surroundings, relaxing vibes" },
    { no: "Mystisk", en: "Mysterious", prompt: "mysterious aura, foggy ethereal haze, cryptic elements" },
    { no: "Energisk", en: "Energetic", prompt: "high-energy, dynamic movement, action-packed expression" },
    { no: "Drømmende", en: "Dreamy", prompt: "surreal dreamlike atmosphere, floating elements, magic realism" }
  ],
  aspect: [
    { no: "1:1 (Kvadrat)", en: "1:1 (Square)", prompt: "--ar 1:1" },
    { no: "16:9 (Skjerm)", en: "16:9 (Screen)", prompt: "--ar 16:9" },
    { no: "9:16 (Mobil)", en: "9:16 (Mobile)", prompt: "--ar 9:16" },
    { no: "4:3 (Klassisk)", en: "4:3 (Classic)", prompt: "--ar 4:3" },
    { no: "2.39:1 (Kino)", en: "2.39:1 (Cinema)", prompt: "--ar 2.39:1" }
  ]
};

// Premade Prompt Templates. title / category / desc are bilingual; prompt is the English string sent to the model.
export const EXAMPLES = [
  {
    title: { no: "Viking ved Norsk Fjord", en: "Viking by a Norwegian fjord" },
    category: { no: "Norsk / Episk", en: "Nordic / Epic" },
    desc: {
      no: "En ekstremt tøff, detaljert viking som skuer utover en dyp norsk fjord under nordlyset.",
      en: "A rugged, detailed Viking looking out over a deep Norwegian fjord beneath the aurora."
    },
    prompt: "A rugged Viking warrior with a braided beard and worn iron armor standing proudly on a high cliff edge, overlooking a majestic Norwegian fjord with steep green mountains and deep blue waters, shimmering green aurora borealis swirling in the night sky, cinematic film still, warm golden hour lighting mixing with northern lights, shot on 85mm lens, shallow depth of field, cool color temperature, epic scale, awe-inspiring atmosphere --ar 16:9"
  },
  {
    title: { no: "Hytte under Nordlyset", en: "Cabin under the aurora" },
    category: { no: "Nostalgisk", en: "Nostalgic" },
    desc: {
      no: "Norsk fjellhytte med gresstak som bader i det magiske lyset fra nordlyset.",
      en: "A Norwegian mountain cabin with a turf roof bathed in the magical light of the aurora."
    },
    prompt: "A cozy wooden mountain cabin with a grass roof and warm glowing windows, nestled in deep white snow, shimmering green aurora borealis swirling in the night sky, highly detailed landscape photography, soft side lighting shining through an old window, vintage 35mm film photography, subtle grain, cool color temperature, serene peaceful ambiance, calm tranquil surroundings --ar 16:9"
  },
  {
    title: { no: "Cyberpunk Strøget", en: "Cyberpunk street" },
    category: { no: "Sci-Fi / Neon", en: "Sci-fi / Neon" },
    desc: {
      no: "En regnvåt, høyteknologisk bygate badet i neon-farger med svevende reklamer.",
      en: "A rain-slick high-tech street bathed in neon with floating holographic ads."
    },
    prompt: "A detailed portrait of a cyberpunk explorer walking through a rain-slicked cyberpunk metropolis with glowing neon signs and holograms, epic scale concept art, cyber-neon illumination with pink and cyan glowing highlights, wide-angle lens capture, hyper-saturated vibrant colors, mysterious aura, foggy ethereal haze --ar 9:16"
  },
  {
    title: { no: "Lofoten i Vinterskrud", en: "Lofoten in winter" },
    category: { no: "Fotografi", en: "Photography" },
    desc: {
      no: "Røde rorbuer i Lofoten omringet av snødekte fjell i den gyldne timen.",
      en: "Red Lofoten cabins surrounded by snow-capped peaks in the golden hour."
    },
    prompt: "Lofoten islands with red fisherman cabins (rorbuer) and dramatic snow-capped peaks, ultra-photorealistic, 8k resolution, warm golden hour lighting, soft long shadows, medium format Hasselblad look, clean crisp details, rich warm and cool contrast tones --ar 16:9"
  }
];
