import { Brain, Code, Bug, Trash2, Menu, X } from "lucide-react";
import { useState } from "react";

const modes = [
  { key: "chat", label: "General Chat", icon: <Brain size={18} /> },
  { key: "explain", label: "Explain Code", icon: <Code size={18} /> },
  { key: "fix-error", label: "Fix Error", icon: <Bug size={18} /> },
];

export default function Sidebar({ mode, setMode, onClear }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModeChange = (key) => {
    setMode(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-darkSecondary border border-border rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-darkSecondary border-r border-border flex flex-col p-4
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo / Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-primary">DevMate</span> AI
          </h1>
          <p className="text-sm text-gray-400 mt-1">Developer Assistant</p>
        </div>

        {/* Mode Buttons */}
        <div className="space-y-1 flex-1">
          {modes.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === key
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Clear chat */}
        <button
          onClick={() => {
            onClear();
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 mt-4 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-700/30 transition-colors"
        >
          <Trash2 size={16} />
          Clear chat
        </button>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-gray-500">
            Powered by OpenAI GPT‑4o‑mini
          </p>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
