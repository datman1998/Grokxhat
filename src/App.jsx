import React from "react";

const soups = [
  {
    name: "Klassisk Tomatsuppe",
    desc: "Fyldig suppe laget på solmodne tomater, hvitløk og basilikum.",
    price: "79 kr",
    badge: "Bestselger",
  },
  {
    name: "Kremet Tomat & Chili",
    desc: "Silkemyk tomatsuppe med mild varme fra rød chili og crème fraîche.",
    price: "89 kr",
    badge: "Nyhet",
  },
  {
    name: "Vegansk Tomatsuppe",
    desc: "Plantebasert favoritt med kokosmelk, linser og urter.",
    price: "84 kr",
    badge: "100% Vegansk",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-white text-neutral-900">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <p className="text-xl font-extrabold tracking-tight text-red-700">TomatMagi</p>
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          Bestill nå
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <section className="grid md:grid-cols-2 gap-10 items-center py-12">
          <div>
            <p className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              Fersklaget hver dag
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Nettsiden for
              <span className="text-red-600"> tomatsuppe-elskere</span>
            </h1>
            <p className="text-lg text-neutral-700 mb-8">
              Bestill varm, smakfull tomatsuppe rett hjem. Velg din favoritt, legg til toppings,
              og få levering samme dag i utvalgte områder.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Se meny
              </button>
              <button className="bg-white hover:bg-neutral-100 border border-neutral-300 font-semibold px-6 py-3 rounded-full transition-colors">
                Abonner ukentlig
              </button>
            </div>
          </div>

          <div className="bg-white border border-red-100 shadow-xl shadow-red-100/60 rounded-3xl p-8">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-8xl">
              🍅
            </div>
            <p className="text-sm text-neutral-500 mt-4">Håndlaget tomatsuppe levert i miljøvennlig emballasje.</p>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-extrabold mb-2">Våre mest populære supper</h2>
          <p className="text-neutral-600 mb-8">Alle supper serveres med ferskt brød inkludert.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {soups.map((soup) => (
              <article key={soup.name} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <p className="inline-block text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full mb-4">
                  {soup.badge}
                </p>
                <h3 className="text-xl font-bold mb-2">{soup.name}</h3>
                <p className="text-neutral-600 mb-6">{soup.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-red-700">{soup.price}</span>
                  <button className="text-sm font-semibold bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-full transition-colors">
                    Legg i kurv
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-red-600 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Sulten akkurat nå?</h2>
          <p className="text-red-100 mb-7 max-w-2xl mx-auto">
            Bestill før kl. 20:00 og få gratis levering på din første ordre.
          </p>
          <button className="bg-white text-red-700 hover:bg-red-50 font-bold px-8 py-3 rounded-full transition-colors">
            Start bestilling
          </button>
        </section>
      </main>
    </div>
  );
}
