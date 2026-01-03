"use client";
import { useState, useEffect } from "react";
import {
  Sparkles, Moon, Sun, Download, Zap, ShieldCheck,
  Infinity, Image as ImageIcon, ArrowUpRight, Layers, Palette,
  CheckCircle2, FileArchive, MousePointer2, Trash2, LayoutGrid,
  Info, HelpCircle, Rocket
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const IMAGE_STYLES = [
  { id: "none", label: "Default", prompt: "" },
  { id: "cinematic", label: "Cinematic", prompt: ", 8k resolution, cinematic lighting, masterpiece, highly detailed" },
  { id: "anime", label: "Anime", prompt: ", studio ghibli style, vibrant, high quality anime art" },
  { id: "3d", label: "3D Render", prompt: ", unreal engine 5, octane render, volumetric lighting, photorealistic" },
  { id: "sketch", label: "Pencil Sketch", prompt: ", graphite pencil drawing, detailed shading, artistic" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageCount, setImageCount] = useState(4);
  const [selectedStyle, setSelectedStyle] = useState(IMAGE_STYLES[0]);
  const [images, setImages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode, mounted]);

  const generateImages = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    const fullPrompt = `${input} ${selectedStyle.prompt}`;

    try {
      const imagePromises = Array.from({ length: imageCount }).map(async () => {
        const seed = Math.floor(Math.random() * 1000000);
        const res = await fetch(`/api/gen?prompt=${encodeURIComponent(fullPrompt)}&seed=${seed}`);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({
            id: Math.random().toString(36).substr(2, 9),
            src: reader.result,
            prompt: input,
            style: selectedStyle.label
          });
          reader.readAsDataURL(blob);
        });
      });

      const results = await Promise.allSettled(imagePromises);
      const newImgs = results.filter(r => r.status === 'fulfilled').map(r => r.value);
      setImages(prev => [...newImgs, ...prev]);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async (targetImages) => {
    const zip = new JSZip();
    const folder = zip.folder("ai-generations");
    targetImages.forEach((img, index) => {
      const base64Data = img.src.split(',')[1];
      folder.file(`art-${index + 1}.png`, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `Export_${Date.now()}.zip`);
  };

  if (!mounted) return <div className="min-h-screen bg-[#F8F9FB]" />;

  return (
    <div className={`min-h-screen transition-all duration-500 font-sans ${darkMode ? 'bg-[#0B0B0C] text-slate-100' : 'bg-[#F8F9FB] text-slate-900'}`}>

      {/* 1. PREMIUM NAV */}
      <nav className={`fixed top-0 w-full z-50 px-8 h-16 flex justify-between items-center border-b shadow-sm ${darkMode ? 'border-white/5 bg-black/40' : 'border-slate-200/60 bg-white/40'} backdrop-blur-xl`}>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-1.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">Free AI Image Generation</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold tracking-wide transition-all ${darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10 text-yellow-400' : 'border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-600'}`}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            {darkMode ? "LIGHT" : "DARK"}
          </button>
        </div>
      </nav>

      <div className="flex pt-24 px-6 gap-8 max-w-[1920px] mx-auto">

        <aside className="hidden 2xl:block w-48 shrink-0">
          <div className={`sticky top-28 h-[600px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 ${darkMode ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-100/50'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20 [writing-mode:vertical-lr]">FREE</span>
          </div>
        </aside>

        <main className="flex-1 max-w-5xl mx-auto w-full">

          {/* HEADER SECTION - SEO OPTIMIZED */}
          <section className="text-center mb-12 space-y-4">
            <div className="flex justify-center gap-4">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${darkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50/50 border-blue-100 text-blue-600'}`}>
                <ShieldCheck size={12} /> 100% FREE NO LOGIN
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${darkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50/50 border-indigo-100 text-indigo-600'}`}>
                <Infinity size={12} /> UNLIMITED AI GENERATION
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">
              FREE AI IMAGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 uppercase">GENERATOR</span>
            </h1>
            <p className={`text-sm max-w-2xl mx-auto opacity-60 leading-relaxed font-medium`}>
              Generate high-resolution AI art instantly with our advanced neural engine. No account required, unlimited generations, and high-fidelity outputs for professional creators.
            </p>
          </section>

          {/* GLASS INPUT CONSOLE */}
          <div className={`mb-12 p-6 rounded-[2.5rem] border transition-all duration-300 shadow-2xl ${darkMode ? 'bg-[#121214] border-white/5 shadow-black/40' : 'bg-white border-slate-200/60 shadow-slate-200/40'}`}>
            <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Batch Size</label>
                  <div className={`flex p-1 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-100/80'}`}>
                    {[1, 4, 8].map(n => (
                      <button key={n} onClick={() => setImageCount(n)} className={`px-5 py-2 rounded-xl text-[10px] font-bold transition-all ${imageCount === n ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{n}X</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Style Preset</label>
                  <div className={`flex p-1 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-100/80'}`}>
                    {IMAGE_STYLES.map(style => (
                      <button key={style.id} onClick={() => setSelectedStyle(style)} className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${selectedStyle.id === style.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{style.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full group">
                {/* The Input Field */}
                <input
                  className={`w-full bg-transparent border-2 outline-none px-6 h-16 rounded-2xl font-medium transition-all duration-300
      ${darkMode
                      ? 'border-white/10 bg-white/[0.02] text-white placeholder:text-slate-600 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] focus:bg-white/[0.04]'
                      : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.1)] focus:bg-white'
                    }`}
                  placeholder="Describe your vision (e.g. A futuristic city at sunset)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateImages()}
                />

                {/* Decorative Icon with reactive color */}
                <div className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none
    ${input.length > 0 ? 'text-blue-500 opacity-100' : 'opacity-20 text-current'}`}
                >
                  <Zap size={18} className={loading ? "animate-pulse" : ""} />
                </div>

                {/* Subtle Bottom Highlight Line */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-500 
    ${input.length > 0 ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}`}
                />
              </div>
              <button
                onClick={generateImages}
                disabled={loading || !input.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 h-16 rounded-2xl font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUpRight size={20} />}
                GENERATE
              </button>
            </div>
          </div>

          {/* ACTION TOOLBAR */}
          {images.length > 0 && (
            <div className={`flex items-center justify-between p-4 mb-8 rounded-3xl border animate-in slide-in-from-bottom-2 duration-700 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 text-blue-500 p-2 rounded-xl">
                  <LayoutGrid size={18} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">{images.length} Creations</p>
                {selectedIndices.length > 0 && (
                  <button onClick={() => downloadZip(images.filter(img => selectedIndices.includes(img.id)))} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
                    <Download size={14} /> SAVE SELECTED ({selectedIndices.length})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadZip(images)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-slate-500/10 transition-all opacity-60 hover:opacity-100 italic underline">
                  <FileArchive size={14} /> Download All Zip
                </button>
                <button onClick={() => { if (confirm("Delete all?")) setImages([]); }} className="p-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
            {loading && Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className={`aspect-[3/4] rounded-3xl border animate-pulse flex flex-col items-center justify-center gap-4 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                <ImageIcon size={32} className="opacity-10" />
              </div>
            ))}
            {images.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedIndices(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                className={`group relative aspect-[3/4] rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl 
                  ${selectedIndices.includes(item.id) ? 'ring-4 ring-blue-500 scale-[0.98]' : darkMode ? 'border-white/10 bg-[#121214]' : 'border-slate-200 bg-white shadow-lg shadow-slate-200/50'}`}
              >
                <img src={item.src} alt="AI Generated Image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute top-4 left-4 right-4 flex justify-between items-start transition-opacity ${selectedIndices.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase border border-white/10">{item.style}</span>
                  <div className={`p-1.5 rounded-full shadow-lg transition-all ${selectedIndices.includes(item.id) ? 'bg-blue-600 text-white scale-110' : 'bg-white/20 text-white backdrop-blur-md'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all text-left">
                  <p className="text-white text-[11px] font-medium leading-relaxed italic line-clamp-3">"{item.prompt}"</p>
                  <a href={item.src} download className="mt-4 block w-full bg-white text-black py-3 rounded-xl font-bold text-[10px] text-center uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">Download PNG</a>
                </div>
              </div>
            ))}
          </div>

          {/* SEO OPTIMIZED GUIDE SECTION */}
          <section className={`mb-20 p-8 rounded-[2.5rem] border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
                <HelpCircle size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight uppercase italic">User Guide & Features</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 mt-1"><Rocket size={16} /></div>
                  <div>
                    <h3 className="font-bold text-sm uppercase mb-1">How to generate?</h3>
                    <p className="text-[12px] opacity-60 leading-relaxed">Enter a detailed description in the text box above. Select your preferred style preset like <strong>Cinematic</strong> or <strong>Anime</strong>, choose your batch size, and hit generate. This free AI tool creates images instantly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 mt-1"><Layers size={16} /></div>
                  <div>
                    <h3 className="font-bold text-sm uppercase mb-1">Batch Processing</h3>
                    <p className="text-[12px] opacity-60 leading-relaxed">We allows you to generate up to 8 images at once. Use the <strong>Save Selected</strong> feature to download only your favorite art pieces as high-quality PNGs.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 mt-1"><Zap size={16} /></div>
                  <div>
                    <h3 className="font-bold text-sm uppercase mb-1">100% Free & Unlimited</h3>
                    <p className="text-[12px] opacity-60 leading-relaxed">Unlike other AI art generators, we offer <strong>unlimited AI image generation for free</strong>. There are no daily limits, credits, or login requirements. Pure creativity, no barriers.</p>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 uppercase">PRO TIP</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed italic opacity-80">"For the best results, use descriptive adjectives like 'volumetric lighting', 'intricate details', or 'unreal engine 5' in your prompts."</p>
                </div>
              </div>
            </div>
          </section>

        </main>

        <aside className="hidden 2xl:block w-48 shrink-0">
          <div className={`sticky top-28 h-[600px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-slate-100/50'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20 [writing-mode:vertical-lr]">FREE</span>
          </div>
        </aside>

      </div>

      <footer className={`py-20 border-t text-center ${darkMode ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.8em] mb-4 underline decoration-blue-600 decoration-2 underline-offset-4">Free Image Gen Architecture • 2026</p>
        <div className="flex justify-center gap-8 text-[9px] font-medium uppercase tracking-widest">
          <span>No Login Required AI</span>
          <span>Unlimited Art Generation</span>
          <span>High Resolution AI Engine</span>
        </div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-widest opacity-30">This platform is 100% free for all</p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3B82F6; border-radius: 10px; }
      `}</style>
    </div>
  );
}