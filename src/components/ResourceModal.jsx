import { X } from "lucide-react";

export default function ResourceModal({ children, onClose, open, title }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4 py-6">
      <div className="w-full max-w-xl rounded-md bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
