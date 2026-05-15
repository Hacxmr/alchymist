import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Hexagon, Wand2, Download, RefreshCcw, ArrowRight } from "lucide-react";
import { cn } from "./lib/utils";

interface PaletteColor {
  hex: string;
  name: string;
}

interface AlchemyResult {
  aestheticName: string;
  manifesto: string;
  imagePrompt: string;
  palette: PaletteColor[];
  fonts: {
    display: string;
    body: string;
  };
  cardImage?: string;
}

export default function App() {
  const [concepts, setConcepts] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<AlchemyResult | null>(null);

  const handleConceptChange = (index: number, value: string) => {
    const newConcepts = [...concepts];
    newConcepts[index] = value;
    setConcepts(newConcepts);
  };

  const performAlchemy = async () => {
    if (concepts.some(c => !c.trim())) return;

    setLoading(true);
    setResult(null);
    setStatus("Consulting the archives...");

    try {
      // Step 1: Alchemy
      const alchemyRes = await fetch("/api/alchemy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concepts }),
      });
      const alchemyData = await alchemyRes.json();
      
      if (alchemyData.error) throw new Error(alchemyData.error);
      
      setStatus("Transmuting visuals...");
      
      // Step 2: Image Gen
      const imageRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: alchemyData.imagePrompt }),
      });
      const imageData = await imageRes.json();
      
      if (imageData.error) throw new Error(imageData.error);

      setResult({ ...alchemyData, cardImage: imageData.image });
    } catch (error: any) {
      console.error("Alchemy failed:", error);
      setStatus("Alchemy failed. The elements were unstable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] font-sans selection:bg-black selection:text-white overflow-x-hidden relative flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 minimal-grid pointer-events-none" />

      <main className="relative z-10 w-full flex-1 flex flex-col items-center">
        {/* Top Framing Bar */}
        <div className="w-full h-1 bg-black" />
        
        <div className="max-w-7xl w-full mx-auto px-12 py-16 flex flex-col flex-1">
          {/* Header Section from Design */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8 pb-12 border-b border-gray-100"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Hexagon className="w-4 h-4 text-gray-400" />
                <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase">Input Synthesis / Lab 01</p>
              </div>
              <h1 className="text-6xl md:text-7xl font-sans font-light tracking-tighter leading-none">
                ALCHY<span className="font-black">MIST</span>
              </h1>
            </div>
            
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Status</p>
              <p className="font-mono text-sm uppercase">Engine Ready</p>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Concept Inputs */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400">The Transmutation</h2>
                <div className="space-y-4">
                  {concepts.map((concept, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <input
                        type="text"
                        placeholder={`Concept 0${i + 1}`}
                        value={concept}
                        onChange={(e) => handleConceptChange(i, e.target.value)}
                        className="w-full bg-white border border-gray-200 px-6 py-5 focus:outline-none focus:border-black transition-all text-lg font-light placeholder:text-gray-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={performAlchemy}
                  disabled={loading || concepts.some(c => !c.trim())}
                  className={cn(
                    "w-full py-6 flex items-center justify-center gap-3 transition-all",
                    "bg-black text-white font-bold tracking-[0.2em] text-xs uppercase",
                    "disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-default"
                  )}
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Perform Alchemy</span>
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 bg-gray-100 rounded-sm"
                  >
                    <p className="text-[10px] uppercase tracking-tighter mb-1 font-bold text-gray-400">Computational State</p>
                    <p className="font-mono text-sm">{status}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            {/* Right Column: Results */}
            <section className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12"
                  >
                    <VibeCard result={result} />
                    
                    <div className="flex flex-col h-full">
                      <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                          <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Synthesis Manifesto</h2>
                          <p className="text-2xl font-serif italic leading-relaxed text-[#4A4A4A]">
                            "{result.manifesto}"
                          </p>
                        </div>

                        <div className="space-y-4">
                           <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Chromatic Alignment</h2>
                           <div className="flex flex-wrap gap-2">
                            {result.palette.map((color, i) => (
                              <div key={i} className="group relative">
                                <div 
                                  className="w-10 h-10 border border-gray-100 shadow-sm" 
                                  style={{ backgroundColor: color.hex }}
                                />
                                <div className="absolute top-full mt-2 left-0 invisible group-hover:visible z-20 bg-black text-white text-[10px] py-1 px-2 uppercase whitespace-nowrap">
                                  {color.hex} / {color.name}
                                </div>
                              </div>
                            ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                          <div>
                            <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Display</h2>
                            <span className="text-sm font-bold uppercase">{result.fonts.display}</span>
                          </div>
                          <div>
                            <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Body</h2>
                            <span className="text-sm font-bold uppercase">{result.fonts.body}</span>
                          </div>
                        </div>
                      </div>

                      <footer className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        <span>AESTHETIC ID: {result.aestheticName.replace(/\s+/g, '-').toUpperCase()}</span>
                        <button className="text-black hover:underline cursor-default">Export System</button>
                      </footer>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[400px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 p-12 text-center">
                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-serif italic text-xl max-w-sm">
                      "Waiting for the alchemy of thought to manifest into visual reality."
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function VibeCard({ result }: { result: AlchemyResult }) {
  return (
    <div className="w-full aspect-[3/4] rounded-sm overflow-hidden border border-gray-100 bg-white shadow-sm relative group p-6 flex flex-col">
      {/* Structural Framing */}
      <div className="flex-1 overflow-hidden relative">
        <img 
          src={result.cardImage} 
          alt={result.aestheticName}
          className="w-full h-full object-covergrayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="pt-6 space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Transmutation v.01</p>
            <h3 className="text-2xl font-light tracking-tight">
              {result.aestheticName.split(' ')[0]}<span className="font-black">{result.aestheticName.split(' ')[1] || ''}</span>
            </h3>
          </div>
          <div className="p-2 border border-black rounded-full">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

