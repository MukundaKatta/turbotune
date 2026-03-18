"use client";

import { useState } from "react";
import { Zap, Settings, Database, BarChart3, Merge, Play, Square, Plus, Trash2, Upload, Download } from "lucide-react";

type Tab = "training" | "dataset" | "loss" | "merging";

interface TrainingRun {
  id: string;
  name: string;
  model: string;
  method: string;
  status: "running" | "completed" | "failed" | "queued";
  progress: number;
  currentLoss: number;
  epoch: string;
  startedAt: string;
}

interface DatasetSample {
  instruction: string;
  input: string;
  output: string;
}

const mockRuns: TrainingRun[] = [
  { id: "1", name: "Code Assistant v2", model: "llama3-8b", method: "LoRA", status: "running", progress: 67, currentLoss: 0.42, epoch: "2/3", startedAt: "2 hours ago" },
  { id: "2", name: "Customer Support Bot", model: "mistral-7b", method: "QLoRA", status: "completed", progress: 100, currentLoss: 0.31, epoch: "5/5", startedAt: "Yesterday" },
  { id: "3", name: "Medical QA", model: "llama3-70b", method: "QLoRA", status: "queued", progress: 0, currentLoss: 0, epoch: "0/3", startedAt: "-" },
];

const mockLossData = Array.from({ length: 50 }, (_, i) => ({
  step: (i + 1) * 100,
  trainLoss: 2.5 * Math.exp(-i * 0.06) + 0.3 + Math.random() * 0.08,
  valLoss: 2.5 * Math.exp(-i * 0.05) + 0.35 + Math.random() * 0.1,
  lr: 2e-4 * Math.max(0, 1 - i / 50),
}));

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("training");
  const [runs] = useState<TrainingRun[]>(mockRuns);
  const [showNewRun, setShowNewRun] = useState(false);
  const [config, setConfig] = useState({
    model: "llama3-8b", method: "lora", loraRank: 16, loraAlpha: 32,
    loraDropout: 0.05, targetModules: "q_proj,v_proj,k_proj,o_proj",
    lr: "2e-4", epochs: 3, batchSize: 4, gradAccum: 4,
    warmupSteps: 100, maxSeqLen: 2048, fp16: true, gradCheckpoint: true,
  });
  const [dataset, setDataset] = useState<DatasetSample[]>([
    { instruction: "Summarize the following text", input: "The quick brown fox jumps over the lazy dog...", output: "A fox jumps over a dog." },
    { instruction: "Translate to French", input: "Hello, how are you?", output: "Bonjour, comment allez-vous?" },
    { instruction: "Write a Python function", input: "Calculate fibonacci numbers", output: "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)" },
  ]);
  const [mergeModels, setMergeModels] = useState({ base: "llama3-8b", adapter1: "", adapter2: "", method: "linear", weight: 0.5 });

  const tabs: { key: Tab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { key: "training", icon: Zap, label: "Training" },
    { key: "dataset", icon: Database, label: "Dataset Builder" },
    { key: "loss", icon: BarChart3, label: "Loss Curves" },
    { key: "merging", icon: Merge, label: "Model Merging" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-brand-400" />
            <h1 className="text-lg font-bold">TurboTune</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Fast Fine-Tuning</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.key ? "bg-brand-600/20 text-brand-400" : "text-gray-400 hover:bg-gray-800"}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3 text-xs space-y-1">
            <p className="text-gray-500">Active Jobs</p>
            <p className="text-lg font-bold text-brand-400">{runs.filter((r) => r.status === "running").length}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === "training" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Training Runs</h2>
              <button onClick={() => setShowNewRun(!showNewRun)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium text-gray-900">
                <Plus size={14} /> New Run
              </button>
            </div>

            {showNewRun && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="font-medium mb-4">Configure Training Run</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Base Model</label>
                    <select value={config.model} onChange={(e) => setConfig({ ...config, model: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                      <option value="llama3-8b">LLaMA 3 8B</option>
                      <option value="llama3-70b">LLaMA 3 70B</option>
                      <option value="mistral-7b">Mistral 7B</option>
                      <option value="phi3-mini">Phi-3 Mini</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Method</label>
                    <select value={config.method} onChange={(e) => setConfig({ ...config, method: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                      <option value="lora">LoRA</option>
                      <option value="qlora">QLoRA (4-bit)</option>
                      <option value="full">Full Fine-tune</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Learning Rate</label>
                    <input value={config.lr} onChange={(e) => setConfig({ ...config, lr: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LoRA Rank</label>
                    <input type="number" value={config.loraRank} onChange={(e) => setConfig({ ...config, loraRank: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LoRA Alpha</label>
                    <input type="number" value={config.loraAlpha} onChange={(e) => setConfig({ ...config, loraAlpha: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Target Modules</label>
                    <input value={config.targetModules} onChange={(e) => setConfig({ ...config, targetModules: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Epochs</label>
                    <input type="number" value={config.epochs} onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Batch Size</label>
                    <input type="number" value={config.batchSize} onChange={(e) => setConfig({ ...config, batchSize: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Seq Length</label>
                    <input type="number" value={config.maxSeqLen} onChange={(e) => setConfig({ ...config, maxSeqLen: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.fp16} onChange={(e) => setConfig({ ...config, fp16: e.target.checked })} className="rounded" /> FP16 Training</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.gradCheckpoint} onChange={(e) => setConfig({ ...config, gradCheckpoint: e.target.checked })} className="rounded" /> Gradient Checkpointing</label>
                </div>
                <div className="flex gap-2">
                  <button className="bg-brand-600 hover:bg-brand-700 px-6 py-2 rounded-lg text-sm font-medium text-gray-900 flex items-center gap-2"><Play size={14} /> Start Training</button>
                  <button onClick={() => setShowNewRun(false)} className="bg-gray-800 px-4 py-2 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {runs.map((run) => (
                <div key={run.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{run.name}</h3>
                      <p className="text-sm text-gray-500">{run.model} | {run.method} | Started {run.startedAt}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${run.status === "running" ? "bg-green-900/30 text-green-400 animate-pulse" : run.status === "completed" ? "bg-blue-900/30 text-blue-400" : run.status === "failed" ? "bg-red-900/30 text-red-400" : "bg-gray-800 text-gray-400"}`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div><p className="text-xs text-gray-500">Progress</p><p className="text-sm font-medium">{run.progress}%</p></div>
                    <div><p className="text-xs text-gray-500">Current Loss</p><p className="text-sm font-medium">{run.currentLoss || "-"}</p></div>
                    <div><p className="text-xs text-gray-500">Epoch</p><p className="text-sm font-medium">{run.epoch}</p></div>
                    <div><p className="text-xs text-gray-500">ETA</p><p className="text-sm font-medium">{run.status === "running" ? "~45 min" : "-"}</p></div>
                  </div>
                  {run.progress > 0 && (
                    <div className="bg-gray-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${run.status === "completed" ? "bg-blue-500" : run.status === "failed" ? "bg-red-500" : "bg-brand-500"}`} style={{ width: `${run.progress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "dataset" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Dataset Builder</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"><Upload size={14} /> Import</button>
                <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"><Download size={14} /> Export JSONL</button>
                <button onClick={() => setDataset([...dataset, { instruction: "", input: "", output: "" }])} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium text-gray-900"><Plus size={14} /> Add Sample</button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{dataset.length} samples | Format: Alpaca (instruction/input/output)</p>
            <div className="space-y-4">
              {dataset.map((sample, idx) => (
                <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Sample #{idx + 1}</span>
                    <button onClick={() => setDataset(dataset.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Instruction</label>
                      <input value={sample.instruction} onChange={(e) => { const d = [...dataset]; d[idx] = { ...d[idx], instruction: e.target.value }; setDataset(d); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Input</label>
                      <textarea value={sample.input} onChange={(e) => { const d = [...dataset]; d[idx] = { ...d[idx], input: e.target.value }; setDataset(d); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-16 resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Output</label>
                      <textarea value={sample.output} onChange={(e) => { const d = [...dataset]; d[idx] = { ...d[idx], output: e.target.value }; setDataset(d); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-16 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "loss" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Loss Visualization</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-medium mb-4">Training & Validation Loss</h3>
              <div className="h-64 flex items-end gap-1">
                {mockLossData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                      Step {d.step} | Train: {d.trainLoss.toFixed(3)} | Val: {d.valLoss.toFixed(3)}
                    </div>
                    <div className="w-full bg-blue-500/60 rounded-t" style={{ height: `${(d.valLoss / 3) * 100}%` }} />
                    <div className="w-full bg-brand-500 rounded-t" style={{ height: `${(d.trainLoss / 3) * 100}%`, marginTop: "-2px" }} />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-brand-500 rounded" /> Train Loss</span>
                  <span className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-blue-500/60 rounded" /> Val Loss</span>
                </div>
                <span className="text-xs text-gray-500">Steps: 0 - {mockLossData.length * 100}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500">Final Train Loss</p>
                <p className="text-2xl font-bold text-brand-400">{mockLossData[mockLossData.length - 1].trainLoss.toFixed(3)}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500">Final Val Loss</p>
                <p className="text-2xl font-bold text-blue-400">{mockLossData[mockLossData.length - 1].valLoss.toFixed(3)}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500">Best Val Loss</p>
                <p className="text-2xl font-bold text-green-400">{Math.min(...mockLossData.map((d) => d.valLoss)).toFixed(3)}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500">Total Steps</p>
                <p className="text-2xl font-bold">{mockLossData.length * 100}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "merging" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Model Merging</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="font-medium">Merge Configuration</h3>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Base Model</label>
                  <select value={mergeModels.base} onChange={(e) => setMergeModels({ ...mergeModels, base: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="llama3-8b">LLaMA 3 8B</option>
                    <option value="mistral-7b">Mistral 7B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Adapter / Model A</label>
                  <input value={mergeModels.adapter1} onChange={(e) => setMergeModels({ ...mergeModels, adapter1: e.target.value })} placeholder="Path to adapter or model" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Adapter / Model B (optional)</label>
                  <input value={mergeModels.adapter2} onChange={(e) => setMergeModels({ ...mergeModels, adapter2: e.target.value })} placeholder="Path to second adapter or model" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Merge Method</label>
                  <select value={mergeModels.method} onChange={(e) => setMergeModels({ ...mergeModels, method: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="linear">Linear Interpolation</option>
                    <option value="slerp">SLERP</option>
                    <option value="ties">TIES</option>
                    <option value="dare">DARE</option>
                    <option value="passthrough">Passthrough (Frankenmerge)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Weight: {mergeModels.weight}</label>
                  <input type="range" min="0" max="1" step="0.05" value={mergeModels.weight} onChange={(e) => setMergeModels({ ...mergeModels, weight: parseFloat(e.target.value) })} className="w-full" />
                </div>
                <button className="w-full bg-brand-600 hover:bg-brand-700 py-2.5 rounded-lg text-sm font-medium text-gray-900 flex items-center justify-center gap-2"><Merge size={14} /> Merge Models</button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-medium mb-4">Merge Methods Explained</h3>
                <div className="space-y-3">
                  {[
                    { name: "Linear", desc: "Simple weighted average of model weights. W = a*W_A + (1-a)*W_B" },
                    { name: "SLERP", desc: "Spherical linear interpolation. Better preserves model geometry." },
                    { name: "TIES", desc: "Trim, Elect, Scale. Resolves parameter conflicts intelligently." },
                    { name: "DARE", desc: "Drop And REscale. Randomly drops delta params and rescales." },
                    { name: "Passthrough", desc: "Stack layers from different models. Creates frankenmerge." },
                  ].map((m) => (
                    <div key={m.name} className="bg-gray-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-brand-400">{m.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
