"use client";

import React, { useState, useTransition } from "react";
import { processFounderData, processContentStrategy, processEventCuration, processMediaGeneration } from "./actions";export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState("intelligence");
  
  // ==========================================
  // ENGINE 1 STATES: Founder Intelligence
  // ==========================================
  const [rawInput, setRawInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [processingResult, setProcessingResult] = useState<{ success?: boolean; data?: any; error?: string } | null>(null);

  // ==========================================
  // ENGINE 2 STATES: Content Strategy
  // ==========================================
  const [themeInput, setThemeInput] = useState("");
  const [isStrategyPending, startStrategyTransition] = useTransition();
  const [strategyResult, setStrategyResult] = useState<{ success?: boolean; data?: any; error?: string } | null>(null);

// ==========================================
  // ENGINE 3 STATES: Event Curation
  // ==========================================
  const [curationTheme, setCurationTheme] = useState("");
  const [curationRegistrant, setCurationRegistrant] = useState("");
  const [isCurationPending, startCurationTransition] = useTransition();
  const [curationResult, setCurationResult] = useState<{ success?: boolean; data?: any; error?: string } | null>(null);

  const handleProcessCuration = () => {
    if (!curationTheme.trim() || !curationRegistrant.trim()) return;
    setCurationResult(null);
    startCurationTransition(async () => {
      const result = await processEventCuration(curationRegistrant, curationTheme);
      setCurationResult(result);
      if (result.success) {
        setCurationRegistrant(""); // Clear registrant, keep theme for faster testing
      }
    });
  };

  // ==========================================
  // ENGINE 4 STATES: Media Generation
  // ==========================================
  const [mediaInput, setMediaInput] = useState("");
  const [isMediaPending, startMediaTransition] = useTransition();
  const [mediaResult, setMediaResult] = useState<{ success?: boolean; data?: any; error?: string } | null>(null);

  const handleProcessMedia = () => {
    if (!mediaInput.trim()) return;
    setMediaResult(null);
    startMediaTransition(async () => {
      const result = await processMediaGeneration(mediaInput);
      setMediaResult(result);
      if (result.success) setMediaInput("");
    });
  };

  // Static UI Data
  const ecosystemMetrics = [
    { name: "Curated Founders", value: "142", trend: "+12 this week", description: "Verified ecosystem builders" },
    { name: "Avg. Trust Density", value: "88%", trend: "High Alignment", description: "Based on 5D scoring engine" },
    { name: "Active Events", value: "3", trend: "Pune Native", description: "Exclusivity-first curation" },
    { name: "Content Pipeline", value: "8 Drafts", trend: "Pending Approval", description: "Short-form & Circle essays" },
  ];

  const engines = [
    { id: "intelligence", name: "Founder Intelligence", icon: "🧠" },
    { id: "curation", name: "Event Curation", icon: "🎯" },
    { id: "strategy", name: "Content Strategy", icon: "✨" },
    { id: "media", name: "Media Studio", icon: "🎬" },
  ];

  // Action Handlers
  const handleProcessFounder = () => {
    if (!rawInput.trim()) return;
    setProcessingResult(null);
    startTransition(async () => {
      const result = await processFounderData(rawInput);
      setProcessingResult(result);
      if (result.success) setRawInput(""); 
    });
  };

  const handleProcessStrategy = () => {
    if (!themeInput.trim()) return;
    setStrategyResult(null);
    startStrategyTransition(async () => {
      const result = await processContentStrategy(themeInput);
      setStrategyResult(result);
      if (result.success) setThemeInput("");
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-slate-900 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-mono tracking-widest text-indigo-400 uppercase">Ecosystem Control Layer</p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              411 Club AI OS
            </h1>
          </div>
          <div className="flex items-center gap-3 backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-xl px-4 py-2 text-sm">
            <span className="text-slate-400 font-mono text-xs">Runtime Engine:</span>
            <span className="text-indigo-400 font-medium font-mono text-xs">Gemini 3.5 Flash</span>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {ecosystemMetrics.map((metric, idx) => (
            <div key={idx} className="backdrop-blur-md bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/60 hover:bg-slate-900/60 group">
              <p className="text-xs font-medium text-slate-400 tracking-wide uppercase mb-1">{metric.name}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-semibold tracking-tight text-white">{metric.value}</span>
                <span className="text-xs font-mono text-indigo-400 group-hover:text-indigo-300 transition-colors">{metric.trend}</span>
              </div>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">{metric.description}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <nav className="lg:col-span-3 flex flex-col gap-2 backdrop-blur-md bg-slate-900/30 border border-slate-900/80 rounded-2xl p-4">
            <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3 mb-2">Core AI Workers</p>
            {engines.map((engine) => (
              <button
                key={engine.id}
                onClick={() => setActiveTab(engine.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  activeTab === engine.id
                    ? "bg-linear-to-r from-indigo-600/20 to-purple-600/10 border border-indigo-500/30 text-white shadow-lg shadow-indigo-500/5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
                }`}
              >
                <span className="text-base">{engine.icon}</span>
                <span>{engine.name}</span>
              </button>
            ))}
          </nav>

          <main className="lg:col-span-9 backdrop-blur-md bg-slate-900/40 border border-slate-800/50 min-h-[500px]rounded-3xl p-8  flex flex-col justify-between">
            <div>
              {/* ENGINE 1 UI */}
              {activeTab === "intelligence" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Founder Intelligence Engine</h2>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                      Paste raw bio, LinkedIn text, or scraped data below. The Gemini engine will parse the context, apply the 5-Dimension scoring framework, and queue the profile in Supabase for manual approval.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <textarea 
                      value={rawInput}
                      onChange={(e) => setRawInput(e.target.value)}
                      placeholder="Paste founder text data here... (e.g. 'Rahul has been building a D2C matcha brand in Pune for 2 years...')"
                      className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
                    />
                    
                    <button 
                      onClick={handleProcessFounder}
                      disabled={isPending || !rawInput.trim()}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isPending || !rawInput.trim() 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                      }`}
                    >
                      {isPending ? "Analyzing & Scoring..." : "Execute Intelligence Pipeline"}
                    </button>

                    {processingResult && (
                      <div className={`p-4 rounded-xl border ${processingResult.success ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                        {processingResult.success ? (
                          <div>
                            <p className="text-sm font-medium text-emerald-400 mb-2">✓ Processed Successfully & Queued in Database</p>
                            <pre className="text-xs text-slate-400 overflow-x-auto">
                              {JSON.stringify(processingResult.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-sm text-red-400">Error: {processingResult.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ENGINE 2 UI */}
              {activeTab === "strategy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Content Strategy & Social Intelligence</h2>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                      Enter an event theme or networking concept. The AI will generate a premium, exclusive social media strategy (hooks, captions, and visual directions) and queue it in Supabase for approval.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <input 
                      type="text"
                      value={themeInput}
                      onChange={(e) => setThemeInput(e.target.value)}
                      placeholder="e.g., A private dinner for bootstrapped SaaS founders doing >$10k MRR..."
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                    
                    <button 
                      onClick={handleProcessStrategy}
                      disabled={isStrategyPending || !themeInput.trim()}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isStrategyPending || !themeInput.trim() 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                      }`}
                    >
                      {isStrategyPending ? "Architecting Strategy..." : "Generate Content Strategy"}
                    </button>

                    {strategyResult && (
                      <div className={`p-4 rounded-xl border ${strategyResult.success ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                        {strategyResult.success ? (
                          <div>
                            <p className="text-sm font-medium text-emerald-400 mb-2">✓ Strategy Architected & Queued</p>
                            <pre className="text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(strategyResult.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-sm text-red-400">Error: {strategyResult.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ENGINE 3 & 4 PLACEHOLDERS */}
              {activeTab === "curation" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Event Curation Gatekeeper</h2>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                      Evaluate a registrant against an event theme. The AI applies "Subtraction Default" logic to protect trust density, flagging aggressive salespeople and rejecting tourists.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <input 
                      type="text"
                      value={curationTheme}
                      onChange={(e) => setCurationTheme(e.target.value)}
                      placeholder="Event Theme (e.g., Bootstrapped SaaS scaling dinner)..."
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />

                    <textarea 
                      value={curationRegistrant}
                      onChange={(e) => setCurationRegistrant(e.target.value)}
                      placeholder="Paste registrant bio/LinkedIn data here..."
                      className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
                    />
                    
                    <button 
                      onClick={handleProcessCuration}
                      disabled={isCurationPending || !curationTheme.trim() || !curationRegistrant.trim()}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isCurationPending || !curationTheme.trim() || !curationRegistrant.trim()
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                      }`}
                    >
                      {isCurationPending ? "Evaluating Trust Density..." : "Execute Curation Engine"}
                    </button>

                    {curationResult && (
                      <div className={`p-4 rounded-xl border ${curationResult.success ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                        {curationResult.success ? (
                          <div>
                            <p className="text-sm font-medium text-emerald-400 mb-2">✓ Gatekeeper Decision Rendered</p>
                            <pre className="text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(curationResult.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <p className="text-sm text-red-400">Error: {curationResult.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Media Generation Studio</h2>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                      Translates raw strategy into cinematic, anti-slop visual briefs. Generates prompts optimized for Midjourney or human editors, enforcing high-trust, brutalist aesthetics.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <textarea 
                      value={mediaInput}
                      onChange={(e) => setMediaInput(e.target.value)}
                      placeholder="Paste the visual_asset_direction from Engine 2 here... (e.g., 'Raw footage of a founder whiteboarding database bottlenecks.')"
                      className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
                    />
                    
                    <button 
                      onClick={handleProcessMedia}
                      disabled={isMediaPending || !mediaInput.trim()}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isMediaPending || !mediaInput.trim() 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                      }`}
                    >
                      {isMediaPending ? "Rendering Creative Brief..." : "Execute Media Engine"}
                    </button>

                    {mediaResult && (
                      <div className={`p-4 rounded-xl border ${mediaResult.success ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                        {mediaResult.success ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-emerald-400 mb-2">✓ Cinematic Brief Generated</p>
                              <pre className="text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
                                {JSON.stringify(mediaResult.data, null, 2)}
                              </pre>
                            </div>
                            
                            {/* THE FREE IMAGE GENERATOR UI */}
                            <div className="mt-4 pt-4 border-t border-emerald-900/30">
                              <p className="text-xs font-mono text-emerald-400 mb-3">Live Render (Pollinations API - Free Tier)</p>
                              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 relative aspect-video">
                                {/* We encode the prompt into the URL to fetch the image instantly */}
                                {/* We now use the condensed, URL-safe API prompt! */}
                                {/* URL-safe prompt + Cache-busting random seed */}
                                {/* Render the secure Base64 image directly from the server */}
                                <img 
                                  src={mediaResult.data.rendered_image} 
                                  alt="Rendered Asset"
                                  className="w-full h-full object-cover bg-slate-900"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-red-400">Error: {mediaResult.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}